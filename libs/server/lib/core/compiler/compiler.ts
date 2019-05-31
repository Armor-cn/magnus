import { EntityMetadata, ObjectType, Connection } from 'typeorm';
import * as ast from './ast';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
export class Compiler {
    progress: ast.ProgressAst;
    constructor(public connection: Connection, public entities: ObjectType<any>[]) {
        this.progress = new ast.ProgressAst();
        const visitor = new CompilerVisitor();
        const options: any = { connection, entities };
        this.progress.visit(visitor, options)
    }
}

export class CompilerVisitor implements ast.AstVisitor<EntityMetadata> {
    progress: ast.ProgressAst;
    visitUnionAst(ast: ast.UnionAst, context: any): any {
        return ast;
    }
    visitProgressAst(item: ast.ProgressAst, context: any): any {
        context.entities.map((entity: any) => {
            const meta = context.connection.getMetadata(entity)
            const doc = new ast.DocumentAst(meta.name);
            item.docs.push(doc.visit(this, meta))
        })
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
        );
        this.progress = item;
        return item;
    }
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
            case `UpdateResult`:
                item.properties = [
                    new ast.PropertyAst(`code`, new ast.IntAst(), true),
                    new ast.PropertyAst(
                        `message`,
                        new ast.StringAst(),
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
                    ...context.ownColumns.map(column => {
                        let type: ast.AstType | ast.AstType[] = createType(column);
                        if (column.isVirtual) {
                            return new ast.EmptyAst(``)
                        }
                        return new ast.PropertyAst(
                            column.propertyName,
                            type,
                            false
                        );
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
                item.properties = [
                    ...context.ownColumns.map(column => {
                        const required = checkRequired(column);
                        const type: ast.AstType = createType(column);
                        if (column.isVirtual) {
                            return new ast.EmptyAst(``)
                        }
                        return new ast.PropertyAst(
                            column.propertyName,
                            type,
                            required
                        )
                    }),
                    ...context.relations.map(column => {
                        const type: ast.AstType = createRelationType(column);
                        if (column.isOneToMany || column.isManyToMany) {
                            return new ast.PropertyAst(
                                column.propertyName,
                                new ast.ArrayAst(type, true),
                                false
                            )
                        } else {
                            return new ast.PropertyAst(
                                column.propertyName,
                                type,
                                false
                            )
                        }
                    })
                ];
                break;
            case `${context.name}Input`:
                item.properties = [
                    ...context.ownColumns.map(column => {
                        const type: ast.AstType = createType(column);
                        if (column.isVirtual) {
                            return new ast.EmptyAst(``)
                        }
                        return new ast.PropertyAst(
                            column.propertyName,
                            type,
                            false
                        )
                    }),
                    ...context.relations.map(column => {
                        const type: ast.AstType = createRelationType(column);
                        if (column.isOneToMany || column.isManyToMany) {
                            return new ast.PropertyAst(
                                column.propertyName,
                                new ast.ArrayAst(type, true),
                                false
                            )
                        } else {
                            return new ast.PropertyAst(
                                column.propertyName,
                                type,
                                false
                            )
                        }
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
                    new ast.MethodAst(`saves`).visit(this, context),
                    new ast.MethodAst(`remove`).visit(this, context),
                    new ast.MethodAst(`removes`).visit(this, context),
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
                    ...context.ownColumns.map(column => {
                        if (column.isVirtual) {
                            return new ast.EmptyAst(``)
                        }
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
                        false
                    ).visit(this, context)
                ];
                break;
            case `save`:
                item.returnType = new ast.TypeAst(`${context.name}`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(
                        0,
                        `entity`,
                        new ast.TypeAst(`${context.name}`).visit(this, context),
                        true
                    ).visit(this, context),
                    new ast.ParameterAst(
                        1,
                        `options`,
                        new ast.TypeAst(`SaveOptions`).visit(this, context),
                        false
                    ).visit(this, context)
                ];
                break;
            case 'saves':
                item.returnType = new ast.ArrayAst(
                    new ast.TypeAst(`${context.name}`).visit(this, context),
                    true
                ).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(
                        0,
                        `entities`,
                        new ast.ArrayAst(
                            new ast.TypeAst(`${context.name}`).visit(this, context),
                            true
                        ).visit(this, context),
                        true
                    ).visit(this, context),
                    new ast.ParameterAst(
                        1,
                        `options`,
                        new ast.TypeAst(`SaveOptions`).visit(this, context),
                        false
                    ).visit(this, context)
                ];
                break;
            case `remove`:
                item.returnType = new ast.TypeAst(`UpdateResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(
                        0,
                        `entity`,
                        new ast.TypeAst(`${context.name}Input`).visit(this, context),
                        true
                    ).visit(this, context),
                    new ast.ParameterAst(
                        0,
                        `option`,
                        new ast.TypeAst(`RemoveOptions`).visit(this, context),
                        false
                    ).visit(this, context)
                ];
                break;
            case `removes`:
                item.returnType = new ast.ArrayAst(new ast.TypeAst(`${context.name}`), true).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(
                        0,
                        `entities`,
                        new ast.TypeAst(`${context.name}Input`).visit(this, context),
                        true
                    ).visit(this, context),
                    new ast.ParameterAst(
                        0,
                        `option`,
                        new ast.TypeAst(`RemoveOptions`).visit(this, context),
                        false
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
                item.returnType = new ast.TypeAst(`UpdateResult`).visit(this, context);
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
                        new ast.UseAst(`${context.name}Input`).visit(this, context),
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
                        `where`,
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
                        new ast.TypeAst(`${context.name}FindManyOptions`).visit(this, context),
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
                item.returnType = new ast.TypeAst(`${context.name}`).visit(this, context);
                item.requiredReturn = false;
                item.parameters = [
                    new ast.ParameterAst(
                        0,
                        `options`,
                        new ast.TypeAst(`${context.name}FindOneOptions`).visit(this, context),
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
        return item;
    }
    visitEmptyAst(item: ast.EmptyAst, context: EntityMetadata) {
        return item;
    }
}

function checkRelationRequired(column: RelationMetadata) {
    let required = false;
    // 如果可以不是null
    if (!column.isNullable) {
        required = true;
    }
    return required;
}
function checkRequired(column: ColumnMetadata) {
    let required = false;
    // 如果可以不是null
    if (typeof column.default !== 'undefined' || column.isNullable || column.isUpdateDate || column.isCreateDate || column.isGenerated) {
        required = false;
    } else {
        required = true;
    }
    return required;
}

function createName(column: ColumnMetadata | RelationMetadata) {
    let name = ``;
    if (typeof column.type === 'string') {
        name = column.type;
    } else {
        name = (column.type as any).name;
    }
    return name;
}

function createType(column: ColumnMetadata): ast.AstType {
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
        const name = createName(column)
        type = createTypeByName(name)
    }
    return type;
}

function createRelationType(column: RelationMetadata) {
    const name = createName(column)
    return createTypeByName(name)
}

function createTypeByName(name: string) {
    switch (name) {
        case 'String':
        case 'varchar':
        case `text`:
        case `uuid`:
            return new ast.StringAst();
        case 'Number':
        case 'smallint':
        case 'int':
        case 'bigint':
            return new ast.IntAst();
        case 'Float':
            return new ast.FloatAst();
        case 'Boolean':
            return new ast.BooleanAst();
        case 'timestamp':
        case `timestamptz`:
            return new ast.UseAst(`Date`);
        default:
            if (name.length > 0) {
                return new ast.UseAst(name)
            } else {
                return new ast.EmptyAst(`empty`)
            }
    }
}
