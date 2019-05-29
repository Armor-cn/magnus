"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ast = __importStar(require("./ast"));
class Compiler {
    constructor(connection, entities) {
        this.connection = connection;
        this.entities = entities;
        this.progress = new ast.ProgressAst();
        const visitor = new CompilerVisitor();
        const options = { connection, entities };
        this.progress.visit(visitor, options);
    }
}
exports.Compiler = Compiler;
class CompilerVisitor {
    visitProgressAst(item, context) {
        context.entities.map((entity) => {
            const meta = context.connection.getMetadata(entity);
            const doc = new ast.DocumentAst(meta.name);
            item.docs.push(doc.visit(this, meta));
        });
        item.scalars.push(new ast.ScalarAst(`ObjectLiteral`));
        item.scalars.push(new ast.ScalarAst(`Date`));
        item.enums.push(new ast.EnumAst(`MutationType`, [
            'CREATED',
            'UPDATED',
            'DELETED'
        ]));
        item.enums.push(new ast.EnumAst(`OrderType`, [
            'ASC',
            'DESC'
        ]));
        this.progress = item;
        return item;
    }
    visitDateAst(item, context) {
        return item;
    }
    visitObjectLiteralAst(item, context) {
        return item;
    }
    visitTypeAst(item, context) {
        switch (item.name) {
            case `${context.name}SaveResult`:
                item.properties = [
                    new ast.PropertyAst(`data`, new ast.TypeAst(context.name).visit(this, context), true).visit(this, context)
                ];
                break;
            case `${context.name}SaveInput`:
                item.properties = [
                    new ast.PropertyAst(`data`, new ast.TypeAst(context.name).visit(this, context), true).visit(this, context),
                    new ast.PropertyAst(`options`, new ast.TypeAst(`SaveOptions`).visit(this, context), false).visit(this, context)
                ];
                break;
            case `${context.name}RemoveInput`:
                item.properties = [
                    new ast.PropertyAst(`data`, new ast.TypeAst(context.name).visit(this, context), true).visit(this, context),
                    new ast.PropertyAst(`options`, new ast.TypeAst(`RemoveOptions`).visit(this, context), false).visit(this, context)
                ];
                break;
            case `${context.name}InsertResult`:
                item.properties = [
                    new ast.PropertyAst(`identifiers`, new ast.ObjectLiteralAst(), true),
                    new ast.PropertyAst(`generatedMaps`, new ast.ObjectLiteralAst(), true),
                    new ast.PropertyAst(`raw`, new ast.UseAst(`${context.name}`), true)
                ];
                break;
            case `${context.name}UpdateResult`:
                item.properties = [
                    new ast.PropertyAst(`raw`, new ast.UseAst(`${context.name}`), true),
                    new ast.PropertyAst(`generatedMaps`, new ast.ObjectLiteralAst(), true)
                ];
                break;
            case `${context.name}DeleteResult`:
                item.properties = [
                    new ast.PropertyAst(`raw`, new ast.UseAst(`${context.name}`), true),
                    new ast.PropertyAst(`affected`, new ast.IntAst(), false)
                ];
                break;
            case `${context.name}CountResult`:
                item.properties = [
                    new ast.PropertyAst(`count`, new ast.IntAst(), true)
                ];
                break;
            case `${context.name}FindQuery`:
                item.properties = [
                    new ast.PropertyAst(`where`, new ast.TypeAst(`${context.name}FindConditions`).visit(this, context), true),
                    new ast.PropertyAst(`entity`, new ast.UseAst(`${context.name}`), true)
                ];
                break;
            case `${context.name}FindConditions`:
                item.properties = [
                    ...context.ownColumns.map(column => {
                        const type = createType(column);
                        if (column.isVirtual) {
                            return new ast.EmptyAst(``);
                        }
                        return new ast.PropertyAst(column.propertyName, type, false);
                    })
                ];
                break;
            case `${context.name}FindResult`:
                item.properties = [
                    new ast.PropertyAst(`data`, new ast.ArrayAst(new ast.UseAst(`${context.name}`), true), true)
                ];
                break;
            case `${context.name}FindAndCountResult`:
                item.properties = [
                    new ast.PropertyAst(`count`, new ast.IntAst(), true),
                    new ast.PropertyAst(`data`, new ast.ArrayAst(new ast.UseAst(`${context.name}`), true), true)
                ];
                break;
            case `${context.name}FindByIdsResult`:
                item.properties = [
                    new ast.PropertyAst(`data`, new ast.ArrayAst(new ast.UseAst(`${context.name}`), true), true)
                ];
                break;
            case `${context.name}FindByIdsQuery`:
                item.properties = [
                    new ast.PropertyAst(`ids`, new ast.ArrayAst(new ast.StringAst(), true), true),
                    new ast.PropertyAst(`options`, new ast.UseAst(`${context.name}FindManyOptions`), false)
                ];
                break;
            case `${context.name}FindOneResult`:
                item.properties = [
                    new ast.PropertyAst(`data`, new ast.UseAst(`${context.name}`), true)
                ];
                break;
            case `${context.name}FindOneQuery`:
                item.properties = [
                    new ast.PropertyAst(`options`, new ast.ObjectLiteralAst(), false)
                ];
                break;
            case `${context.name}WatchResult`:
                item.properties = [
                    new ast.PropertyAst(`data`, new ast.UseAst(`${context.name}`), true),
                    new ast.PropertyAst(`action`, new ast.UseAst(`MutationType`), true),
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
                    ...context.ownColumns.map(column => {
                        const required = checkRequired(column);
                        const type = createType(column);
                        if (column.isVirtual) {
                            return new ast.EmptyAst(``);
                        }
                        return new ast.PropertyAst(column.propertyName, type, required);
                    }),
                    ...context.relations.map(column => {
                        const type = createRelationType(column);
                        if (column.isOneToMany || column.isManyToMany) {
                            return new ast.PropertyAst(column.propertyName, new ast.ArrayAst(type, true), false);
                        }
                        else {
                            return new ast.PropertyAst(column.propertyName, type, true);
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
                    new ast.MethodAst(`remove`).visit(this, context),
                    new ast.MethodAst(`insert`).visit(this, context),
                    new ast.MethodAst(`update`).visit(this, context),
                    new ast.MethodAst(`delete`).visit(this, context),
                ];
                break;
            case `${context.name}Subscription`:
                const watch = new ast.MethodAst(`watch`);
                watch.returnType = new ast.TypeAst(`${context.name}WatchResult`).visit(this, context);
                watch.requiredReturn = true;
                watch.parameters = [
                    new ast.ParameterAst(0, 'options', new ast.UseAst(`${context.name}WatchInput`), true)
                ];
                item.properties = [
                    watch.visit(this, context)
                ];
                break;
            case `${context.name}FindManyOptions`:
                item.properties = [
                    new ast.PropertyAst(`skip`, new ast.IntAst(), false),
                    new ast.PropertyAst(`take`, new ast.IntAst(), false),
                    new ast.PropertyAst(`where`, new ast.UseAst(`${context.name}FindConditions`), false),
                    new ast.PropertyAst(`relations`, new ast.ArrayAst(new ast.StringAst(), true), false),
                    new ast.PropertyAst(`join`, new ast.TypeAst(`JoinOptions`).visit(this, context), false),
                    new ast.PropertyAst(`order`, new ast.TypeAst(`${context.name}Order`).visit(this, context), false)
                ];
                item.father = new ast.TypeAst(`${context.name}FindOneOptions`).visit(this, context);
                break;
            case `${context.name}FindOneOptions`:
                item.properties = [
                    new ast.PropertyAst(`where`, new ast.UseAst(`${context.name}FindConditions`), false),
                    new ast.PropertyAst(`relations`, new ast.ArrayAst(new ast.StringAst(), true), false),
                    new ast.PropertyAst(`join`, new ast.TypeAst(`JoinOptions`).visit(this, context), false),
                    new ast.PropertyAst(`order`, new ast.TypeAst(`${context.name}Order`).visit(this, context), false)
                ];
                break;
            case `SaveOptions`:
                item.properties = [
                    new ast.PropertyAst(`listeners`, new ast.BooleanAst(), false).visit(this, context),
                    new ast.PropertyAst(`transaction`, new ast.BooleanAst(), false).visit(this, context),
                    new ast.PropertyAst(`chunk`, new ast.IntAst(), false).visit(this, context),
                    new ast.PropertyAst(`reload`, new ast.BooleanAst(), false).visit(this, context),
                ];
                break;
            case `RemoveOptions`:
                item.properties = [
                    new ast.PropertyAst(`listeners`, new ast.BooleanAst(), false).visit(this, context),
                    new ast.PropertyAst(`transaction`, new ast.BooleanAst(), false).visit(this, context),
                    new ast.PropertyAst(`chunk`, new ast.IntAst(), false).visit(this, context),
                ];
                break;
            case `${context.name}Order`:
                item.properties = [
                    ...context.ownColumns.map(column => {
                        if (column.isVirtual) {
                            return new ast.EmptyAst(``);
                        }
                        return new ast.PropertyAst(column.propertyName, new ast.UseAst(`OrderType`), false);
                    })
                ];
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
    visitParameterAst(item, context) {
        return item;
    }
    visitMethodAst(item, context) {
        switch (item.name) {
            case `count`:
                item.returnType = new ast.TypeAst(`${context.name}CountResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(0, `options`, new ast.TypeAst(`${context.name}FindManyOptions`).visit(this, context), false).visit(this, context)
                ];
                break;
            case `save`:
                item.returnType = new ast.TypeAst(`${context.name}`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(0, `entity`, new ast.TypeAst(`${context.name}`).visit(this, context), true).visit(this, context),
                    new ast.ParameterAst(1, `options`, new ast.TypeAst(`SaveOptions`).visit(this, context), false).visit(this, context)
                ];
                break;
            case `remove`:
                item.returnType = new ast.TypeAst(`${context.name}`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(0, `entity`, new ast.TypeAst(`${context.name}`).visit(this, context), true).visit(this, context),
                    new ast.ParameterAst(0, `options`, new ast.TypeAst(`RemoveOptions`).visit(this, context), false).visit(this, context)
                ];
                break;
            case `insert`:
                item.returnType = new ast.TypeAst(`${context.name}InsertResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(0, `options`, new ast.TypeAst(`${context.name}Input`).visit(this, context), true).visit(this, context)
                ];
                break;
            case `update`:
                item.returnType = new ast.TypeAst(`${context.name}UpdateResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(0, 'where', new ast.UseAst(`${context.name}FindConditions`), true),
                    new ast.ParameterAst(0, `options`, new ast.UseAst(`${context.name}`).visit(this, context), true).visit(this, context)
                ];
                break;
            case `delete`:
                item.returnType = new ast.TypeAst(`${context.name}DeleteResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(0, `options`, new ast.TypeAst(`${context.name}FindConditions`).visit(this, context), true).visit(this, context)
                ];
                break;
            case `find`:
                item.returnType = new ast.TypeAst(`${context.name}FindResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(0, `options`, new ast.TypeAst(`${context.name}FindQuery`).visit(this, context), true).visit(this, context)
                ];
                break;
            case `findAndCount`:
                item.returnType = new ast.TypeAst(`${context.name}FindAndCountResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(0, `options`, new ast.TypeAst(`${context.name}FindManyOptions`).visit(this, context), true).visit(this, context)
                ];
                break;
            case `findByIds`:
                item.returnType = new ast.TypeAst(`${context.name}FindByIdsResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(0, `options`, new ast.TypeAst(`${context.name}FindByIdsQuery`).visit(this, context), true).visit(this, context)
                ];
                break;
            case `findOne`:
                item.returnType = new ast.TypeAst(`${context.name}`).visit(this, context);
                item.requiredReturn = false;
                item.parameters = [
                    new ast.ParameterAst(0, `options`, new ast.TypeAst(`${context.name}FindOneQuery`).visit(this, context), true).visit(this, context)
                ];
                break;
            case `watch`:
                item.returnType = new ast.TypeAst(`${context.name}WatchResult`).visit(this, context);
                item.requiredReturn = true;
                item.parameters = [
                    new ast.ParameterAst(0, `options`, new ast.TypeAst(`${context.name}WatchInput`).visit(this, context), true).visit(this, context),
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
    visitQueryAst(item, context) {
        item.properties.push(new ast.PropertyAst(`${context.name}`, new ast.TypeAst(`${context.name}Query`).visit(this, context), true).visit(this, context));
        return item;
    }
    /**
     * save
     * remove
     * insert
     * update
     * delete
     */
    visitMutationAst(item, context) {
        item.properties.push(new ast.PropertyAst(`${context.name}`, new ast.TypeAst(`${context.name}Mutation`).visit(this, context), true).visit(this, context));
        return item;
    }
    visitUseAst(item, context) {
        return item;
    }
    /**
     * watch
     */
    visitSubscriptionAst(item, context) {
        item.properties.push(new ast.PropertyAst(`${context.name}`, new ast.TypeAst(`${context.name}Subscription`).visit(this, context), true).visit(this, context));
        return item;
    }
    visitInputAst(item, context) {
        return item;
    }
    visitEnumAst(item, context) {
        return item;
    }
    visitIdAst(item, context) {
        return item;
    }
    visitBooleanAst(item, context) {
        return item;
    }
    visitFloatAst(item, context) {
        return item;
    }
    visitIntAst(item, context) {
        return item;
    }
    visitStringAst(item, context) {
        return item;
    }
    visitArrayAst(item, context) {
        return item;
    }
    visitScalarAst(item, context) {
        return item;
    }
    visitPropertyAst(item, context) {
        return item;
    }
    visitDocumentAst(item, context) {
        item.mutation = new ast.MutationAst().visit(this, context);
        item.query = new ast.QueryAst().visit(this, context);
        item.subscription = new ast.SubscriptionAst().visit(this, context);
        return item;
    }
    visitEmptyAst(item, context) {
        return item;
    }
}
exports.CompilerVisitor = CompilerVisitor;
function checkRelationRequired(column) {
    let required = false;
    // 如果可以不是null
    if (!column.isNullable) {
        required = true;
    }
    return required;
}
function checkRequired(column) {
    let required = false;
    // 如果可以不是null
    if (typeof column.default !== 'undefined' || column.isUpdateDate || column.isCreateDate || column.isGenerated) {
        required = false;
    }
    else {
        required = true;
    }
    return required;
}
function createName(column) {
    let name = ``;
    if (typeof column.type === 'string') {
        name = column.type;
    }
    else {
        name = column.type.name;
    }
    return name;
}
function createType(column) {
    let type;
    if (column.isCreateDate) {
        type = new ast.DateAst();
    }
    else if (column.isUpdateDate) {
        type = new ast.DateAst();
    }
    else if (column.isGenerated) {
        type = new ast.IntAst();
    }
    else if (column.isObjectId) {
        type = new ast.IdAst();
    }
    else {
        const name = createName(column);
        type = createTypeByName(name);
    }
    return type;
}
function createRelationType(column) {
    const name = createName(column);
    return createTypeByName(name);
}
function createTypeByName(name) {
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
                return new ast.UseAst(name);
            }
            else {
                return new ast.EmptyAst(`empty`);
            }
    }
}
