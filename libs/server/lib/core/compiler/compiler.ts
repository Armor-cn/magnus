import { EntityMetadata } from 'typeorm';
import * as ast from './ast';

export class Compiler<T> {
    document: ast.DocumentAst;
    constructor(public meta: EntityMetadata) {
        this.document = new ast.DocumentAst();
        const visitor = new CompilerVisitor();
        this.document.visit(visitor, meta)
    }
}

export class CompilerVisitor implements ast.AstVisitor<EntityMetadata> {
    document: ast.DocumentAst;
    visitDateAst(item: ast.TypeAst, context: EntityMetadata) {
        return item;
    }
    visitObjectLiteralAst(item: ast.ObjectLiteralAst, context: EntityMetadata) {
        return item;
    }
    visitTypeAst(item: ast.TypeAst, context: EntityMetadata) {
        switch (item.name) {
            case `${context.name}SaveResult`:
                item.properties = [
                    new ast.PropertyAst(
                        `data`,
                        new ast.TypeAst(context.name).visit(this, context),
                        true
                    ).visit(this, context)
                ];
                break;
            case `${context.name}SaveInput`:
                item.properties = [
                    new ast.PropertyAst(
                        `data`,
                        new ast.TypeAst(context.name).visit(this, context),
                        true
                    ).visit(this, context),
                    new ast.PropertyAst(
                        `options`,
                        new ast.TypeAst(`SaveOptions`).visit(this, context),
                        false
                    ).visit(this, context)
                ];
                break;
            case `${context.name}RemoveInput`:
                item.properties = [
                    new ast.PropertyAst(
                        `data`,
                        new ast.TypeAst(context.name).visit(this, context),
                        true
                    ).visit(this, context),
                    new ast.PropertyAst(
                        `options`,
                        new ast.TypeAst(`RemoveOptions`).visit(this, context),
                        false
                    ).visit(this, context)
                ];
                break;
            case `${context.name}RemoveResult`:
                item.properties = [
                    new ast.PropertyAst(
                        `data`,
                        new ast.TypeAst(context.name).visit(this, context),
                        true
                    ).visit(this, context)
                ];
                break;
            case `${context.name}InsertResult`:
                item.properties = [
                    new ast.PropertyAst(
                        `identifiers`,
                        new ast.ObjectLiteralAst(),
                        true
                    ),
                    new ast.PropertyAst(
                        `generatedMaps`,
                        new ast.ObjectLiteralAst(),
                        true
                    ),
                    new ast.PropertyAst(
                        `raw`,
                        new ast.UseAst(`${context.name}`),
                        true
                    )
                ];
                break;
            case `${context.name}UpdateResult`:
                item.properties = [
                    new ast.PropertyAst(`raw`, new ast.UseAst(`${context.name}`), true),
                    new ast.PropertyAst(
                        `generatedMaps`,
                        new ast.ObjectLiteralAst(),
                        true
                    )
                ];
                break;
            case `${context.name}DeleteResult`:
                item.properties = [
                    new ast.PropertyAst(
                        `raw`,
                        new ast.UseAst(`${context.name}`),
                        true
                    ),
                    new ast.PropertyAst(
                        `affected`,
                        new ast.IntAst(),
                        false
                    )
                ];
                break;
            case `${context.name}CountResult`:
                item.properties = [
                    new ast.PropertyAst(
                        `count`,
                        new ast.IntAst(),
                        true
                    )
                ];
                break;
            case `${context.name}FindQuery`:
                item.properties = [
                    new ast.PropertyAst(
                        `where`,
                        new ast.TypeAst(`${context.name}FindConditions`).visit(this, context),
                        true
                    ),
                    new ast.PropertyAst(
                        `entity`,
                        new ast.UseAst(`${context.name}`),
                        true
                    )
                ];
                break;
            case `${context.name}FindConditions`:
                item.properties = [
                    ...context.columns.map(column => {
                        let name = ``;
                        if (typeof column.type === 'string') {
                            name = column.type;
                        } else {
                            name = (column.type as any).name;
                        }
                        let type: ast.AstType;
                        if (column.isCreateDate) {
                            type = new ast.DateAst();
                        } else if (column.isUpdateDate) {
                            type = new ast.DateAst();
                        } else if (column.isGenerated) {
                            type = new ast.IntAst();
                        } else if (column.isObjectId) {
                            type = new ast.IdAst();
                        } else {
                            type = this.createTypeByName(name)
                        }
                        return new ast.PropertyAst(
                            column.propertyName,
                            type,
                            false
                        )
                    })
                ];
                break;
            case `${context.name}FindResult`:
                item.properties = [
                    new ast.PropertyAst(
                        `data`,
                        new ast.ArrayAst(
                            new ast.UseAst(`${context.name}`),
                            true
                        ),
                        true
                    )
                ];
                break;
            case `${context.name}FindAndCountResult`:
                item.properties = [
                    new ast.PropertyAst(
                        `count`,
                        new ast.IntAst(),
                        true
                    ),
                    new ast.PropertyAst(
                        `data`,
                        new ast.ArrayAst(
                            new ast.UseAst(`${context.name}`),
                            true
                        ),
                        true
                    )
                ];
                break;
            case `${context.name}FindByIdsResult`:
                item.properties = [
                    new ast.PropertyAst(
                        `data`,
                        new ast.ArrayAst(
                            new ast.UseAst(`${context.name}`),
                            true
                        ),
                        true
                    )
                ];
                break;
            case `${context.name}FindByIdsQuery`:
                item.properties = [
                    new ast.PropertyAst(
                        `ids`,
                        new ast.ArrayAst(
                            new ast.StringAst(),
                            true
                        ),
                        true
                    ),
                    new ast.PropertyAst(
                        `options`,
                        new ast.UseAst(`${context.name}FindManyOptions`),
                        false
                    )
                ];
                break;
            case `${context.name}FindOneResult`:
                item.properties = [
                    new ast.PropertyAst(
                        `data`,
                        new ast.UseAst(`${context.name}`),
                        true
                    )
                ];
                break;
            case `${context.name}FindOneQuery`:
                item.properties = [
                    new ast.PropertyAst(
                        `options`,
                        new ast.ObjectLiteralAst(),
                        false
                    )
                ];
                break;
            case `${context.name}WatchResult`:
                item.properties = [
                    new ast.PropertyAst(
                        `data`,
                        new ast.UseAst(`${context.name}`),
                        true
                    ),
                    new ast.PropertyAst(
                        `action`,
                        new ast.UseAst(`MutationType`),
                        true
                    ),
                ];
                break;
            case `${context.name}WatchInput`:
                item.properties = [
                    new ast.PropertyAst(`mutation_in`, new ast.UseAst(`MutationType`), false),
                ];
                break;
            case `${context.name}`:
            case `${context.name}Input`:
                item.properties = [
                    ...context.columns.map(column => {
                        let name = ``;
                        let required = false;
                        if (typeof column.type === 'string') {
                            name = column.type;
                        } else {
                            name = (column.type as any).name;
                        }
                        let type: ast.AstType;
                        if (column.isCreateDate) {
                            type = new ast.DateAst();
                        } else if (column.isUpdateDate) {
                            type = new ast.DateAst();
                        } else if (column.isGenerated) {
                            type = new ast.IntAst();
                        } else if (column.isObjectId) {
                            type = new ast.IdAst();
                        } else {
                            if (!column.isNullable) {
                                required = true;
                            }
                            type = this.createTypeByName(name)
                        }
                        return new ast.PropertyAst(
                            column.propertyName,
                            type,
                            required
                        )
                    })
                ];
                break;
            case `${context.name}Query`:
                item.properties = [
                    new ast.MethodAst(`count`).visit(this, context),
                    new ast.MethodAst(`find`).visit(this, context),
                    new ast.MethodAst(`findAndCount`).visit(this, context),
                    new ast.MethodAst(`findByIds`).visit(this, context),
                    new ast.MethodAst(`findOne`).visit(this, context),
                ];
                break;
            case `${context.name}Mutation`:
                item.properties = [
                    new ast.MethodAst(`save`).visit(this, context),
                    new ast.MethodAst(`remove`).visit(this, context),
                    new ast.MethodAst(`insert`).visit(this, context),
                    new ast.MethodAst(`update`).visit(this, context),
                    new ast.MethodAst(`delete`).visit(this, context),
                ]
                break;
            case `${context.name}Subscription`:
                const watch = new ast.MethodAst(`watch`);
                watch.returnType = new ast.TypeAst(`${context.name}WatchResult`).visit(this, context)
                watch.requiredReturn = true;
                watch.parameters = [
                    new ast.ParameterAst(0, 'options', new ast.UseAst(`${context.name}WatchInput`), true)
                ]
                item.properties = [
                    watch.visit(this, context)
                ]
                break;
            case `${context.name}FindManyOptions`:
                item.properties = [
                    new ast.PropertyAst(`skip`, new ast.IntAst(), false),
                    new ast.PropertyAst(`take`, new ast.IntAst(), false),
                    new ast.PropertyAst(`where`, new ast.UseAst(`${context.name}FindConditions`), false),
                    new ast.PropertyAst(
                        `relations`,
                        new ast.ArrayAst(new ast.StringAst(), true),
                        false
                    ),
                    new ast.PropertyAst(
                        `join`,
                        new ast.TypeAst(`JoinOptions`).visit(this, context),
                        false
                    ),
                    new ast.PropertyAst(
                        `order`,
                        new ast.TypeAst(`${context.name}Order`).visit(this, context),
                        false
                    )
                ];
                item.father = new ast.TypeAst(`${context.name}FindOneOptions`).visit(this, context)
                break;
            case `${context.name}FindOneOptions`:
                item.properties = [
                    new ast.PropertyAst(`where`, new ast.UseAst(`${context.name}FindConditions`), false),
                    new ast.PropertyAst(
                        `relations`,
                        new ast.ArrayAst(new ast.StringAst(), true),
                        false
                    ),
                    new ast.PropertyAst(
                        `join`,
                        new ast.TypeAst(`JoinOptions`).visit(this, context),
                        false
                    ),
                    new ast.PropertyAst(
                        `order`,
                        new ast.TypeAst(`${context.name}Order`).visit(this, context),
                        false
                    )
                ];
                break;
            case `SaveOptions`:
                item.properties = [
                    new ast.PropertyAst(
                        `listeners`,
                        new ast.BooleanAst(),
                        false
                    ).visit(this, context),
                    new ast.PropertyAst(
                        `transaction`,
                        new ast.BooleanAst(),
                        false
                    ).visit(this, context),
                    new ast.PropertyAst(
                        `chunk`,
                        new ast.IntAst(),
                        false
                    ).visit(this, context),
                    new ast.PropertyAst(
                        `reload`,
                        new ast.BooleanAst(),
                        false
                    ).visit(this, context),
                ];
                break;
            case `RemoveOptions`:
                item.properties = [
                    new ast.PropertyAst(
                        `listeners`,
                        new ast.BooleanAst(),
                        false
                    ).visit(this, context),
                    new ast.PropertyAst(
                        `transaction`,
                        new ast.BooleanAst(),
                        false
                    ).visit(this, context),
                    new ast.PropertyAst(
                        `chunk`,
                        new ast.IntAst(),
                        false
                    ).visit(this, context),
                ];
                break;
            case `${context.name}Order`:
                item.properties = [
                    ...context.columns.map(column => {
                        return new ast.PropertyAst(
                            column.propertyName,
                            new ast.UseAst(`OrderType`),
                            false
                        )
                    })
                ]
                break;
            case 'JoinOptions':
                item.properties = [
                    new ast.PropertyAst(`alias`, new ast.StringAst(), true),
                    new ast.PropertyAst(`leftJoinAndSelect`, new ast.UseAst(`ObjectLiteral`), false),
                    new ast.PropertyAst(`innerJoinAndSelect`, new ast.UseAst(`ObjectLiteral`), false),
                    new ast.PropertyAst(`leftJoin`, new ast.UseAst(`ObjectLiteral`), false),
                    new ast.PropertyAst(`innerJoin`, new ast.UseAst(`ObjectLiteral`), false),
                ];
                break;
            default:
                debugger;
                break;
        }
        return item;
    }
    createTypeByName(name: string) {
        switch (name) {
            case 'String':
            case 'varchar':
                return new ast.StringAst();
            case 'Number':
                return new ast.IntAst();
            case 'Float':
                return new ast.FloatAst();
            case 'Boolean':
                return new ast.BooleanAst();
            default:
                debugger;
                return new ast.TypeAst(name)
        }
    }
    visitParameterAst(item: ast.ParameterAst, context: EntityMetadata) {
        return item;
    }
    visitMethodAst(item: ast.MethodAst, context: EntityMetadata) {
        switch (item.name) {
            case `count`:
                item.returnType = new ast.TypeAst(`${context.name}CountResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(
                        0,
                        `options`,
                        new ast.TypeAst(`${context.name}FindManyOptions`).visit(this, context),
                        true
                    ).visit(this, context)
                ];
                break;
            case `save`:
                item.returnType = new ast.TypeAst(`${context.name}SaveResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(
                        0,
                        `options`,
                        new ast.TypeAst(`${context.name}SaveInput`).visit(this, context),
                        true
                    ).visit(this, context)
                ];
                break;
            case `remove`:
                item.returnType = new ast.TypeAst(`${context.name}RemoveResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(
                        0,
                        `options`,
                        new ast.TypeAst(`${context.name}RemoveInput`).visit(this, context),
                        true
                    ).visit(this, context)
                ];
                break;
            case `insert`:
                item.returnType = new ast.TypeAst(`${context.name}InsertResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(
                        0,
                        `options`,
                        new ast.TypeAst(`${context.name}Input`).visit(this, context),
                        true
                    ).visit(this, context)
                ];
                break;
            case `update`:
                item.returnType = new ast.TypeAst(`${context.name}UpdateResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(
                        0,
                        'where',
                        new ast.UseAst(`${context.name}FindConditions`),
                        true
                    ),
                    new ast.ParameterAst(
                        0,
                        `options`,
                        new ast.UseAst(`${context.name}`).visit(this, context),
                        true
                    ).visit(this, context)
                ];
                break;
            case `delete`:
                item.returnType = new ast.TypeAst(`${context.name}DeleteResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(
                        0,
                        `options`,
                        new ast.TypeAst(`${context.name}FindConditions`).visit(this, context),
                        true
                    ).visit(this, context)
                ];
                break;
            case `find`:
                item.returnType = new ast.TypeAst(`${context.name}FindResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(
                        0,
                        `options`,
                        new ast.TypeAst(`${context.name}FindQuery`).visit(this, context),
                        true
                    ).visit(this, context)
                ];
                break;
            case `findAndCount`:
                item.returnType = new ast.TypeAst(`${context.name}FindAndCountResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(
                        0,
                        `options`,
                        new ast.TypeAst(`${context.name}FindManyOptions`).visit(this, context),
                        true
                    ).visit(this, context)
                ];
                break;
            case `findByIds`:
                item.returnType = new ast.TypeAst(`${context.name}FindByIdsResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(
                        0,
                        `options`,
                        new ast.TypeAst(`${context.name}FindByIdsQuery`).visit(this, context),
                        true
                    ).visit(this, context)
                ];
                break;
            case `findOne`:
                item.returnType = new ast.TypeAst(`${context.name}FindOneResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(
                        0,
                        `options`,
                        new ast.TypeAst(`${context.name}FindOneQuery`).visit(this, context),
                        true
                    ).visit(this, context)
                ];
                break;
            case `watch`:
                item.returnType = new ast.TypeAst(`${context.name}WatchResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(
                        0,
                        `options`,
                        new ast.TypeAst(`${context.name}WatchInput`).visit(this, context),
                        true
                    ).visit(this, context),
                ];
                break;
            default:
                break;
        }
        return item;
    }
    /**
     * count
     * find
     * findAndCount
     * findByIds
     * findOne
     * findOneOrFail
     */
    visitQueryAst(item: ast.QueryAst, context: EntityMetadata): ast.QueryAst {
        item.properties.push(
            new ast.PropertyAst(`${context.name}`, new ast.TypeAst(`${context.name}Query`).visit(this, context), true).visit(this, context),
        );
        return item;
    }
    /**
     * save
     * remove
     * insert
     * update
     * delete
     */
    visitMutationAst(item: ast.MutationAst, context: EntityMetadata): ast.MutationAst {
        item.properties.push(
            new ast.PropertyAst(`${context.name}`, new ast.TypeAst(`${context.name}Mutation`).visit(this, context), true).visit(this, context),
        );
        return item;
    }
    visitUseAst(item: ast.UseAst, context: EntityMetadata): any {
        return item;
    }
    /**
     * watch
     */
    visitSubscriptionAst(item: ast.SubscriptionAst, context: EntityMetadata): ast.SubscriptionAst {
        item.properties.push(
            new ast.PropertyAst(`${context.name}`, new ast.TypeAst(`${context.name}Subscription`).visit(this, context), true).visit(this, context),
        );
        return item;
    }
    visitInputAst(item: ast.InputAst, context: EntityMetadata): ast.InputAst {
        return item;
    }
    visitEnumAst(item: ast.EnumAst, context: EntityMetadata): ast.EnumAst {
        return item;
    }
    visitIdAst(item: ast.IdAst, context: EntityMetadata): any {
        return item;
    }
    visitBooleanAst(item: ast.BooleanAst, context: EntityMetadata): any {
        return item;
    }
    visitFloatAst(item: ast.FloatAst, context: EntityMetadata): any {
        return item;
    }
    visitIntAst(item: ast.IntAst, context: EntityMetadata): any {
        return item;
    }
    visitStringAst(item: ast.StringAst, context: EntityMetadata): any {
        return item;
    }
    visitArrayAst(item: ast.ArrayAst, context: EntityMetadata): any {
        return item;
    }
    visitScalarAst(item: ast.ScalarAst, context: EntityMetadata): any {
        return item;
    }
    visitPropertyAst(item: ast.PropertyAst, context: EntityMetadata): any {
        return item;
    }
    visitDocumentAst(item: ast.DocumentAst, context: EntityMetadata): any {
        item.mutation = new ast.MutationAst().visit(this, context);
        item.query = new ast.QueryAst().visit(this, context);
        item.subscription = new ast.SubscriptionAst().visit(this, context);
        item.scalars.push(new ast.ScalarAst(`ObjectLiteral`))
        item.scalars.push(new ast.ScalarAst(`Date`))
        item.enums.push(new ast.EnumAst(`MutationType`, [
            'CREATED',
            'UPDATED',
            'DELETED'
        ]));
        item.enums.push(
            new ast.EnumAst(`OrderType`, [
                'ASC',
                'DESC'
            ])
        )
        this.document = item;
        return item;
    }
}