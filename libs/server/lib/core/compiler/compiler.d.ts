import { EntityMetadata, ObjectType, Connection } from 'typeorm';
import * as ast from './ast';
export declare class Compiler {
    connection: Connection;
    entities: ObjectType<any>[];
    progress: ast.ProgressAst;
    constructor(connection: Connection, entities: ObjectType<any>[]);
}
export declare class CompilerVisitor implements ast.AstVisitor<EntityMetadata> {
    progress: ast.ProgressAst;
    visitProgressAst(item: ast.ProgressAst, context: any): any;
    visitDateAst(item: ast.TypeAst, context: EntityMetadata): ast.TypeAst;
    visitObjectLiteralAst(item: ast.ObjectLiteralAst, context: EntityMetadata): ast.ObjectLiteralAst;
    visitTypeAst(item: ast.TypeAst, context: EntityMetadata): ast.TypeAst;
    visitParameterAst(item: ast.ParameterAst, context: EntityMetadata): ast.ParameterAst;
    visitMethodAst(item: ast.MethodAst, context: EntityMetadata): ast.MethodAst;
    /**
     * count
     * find
     * findAndCount
     * findByIds
     * findOne
     * findOneOrFail
     */
    visitQueryAst(item: ast.QueryAst, context: EntityMetadata): ast.QueryAst;
    /**
     * save
     * remove
     * insert
     * update
     * delete
     */
    visitMutationAst(item: ast.MutationAst, context: EntityMetadata): ast.MutationAst;
    visitUseAst(item: ast.UseAst, context: EntityMetadata): any;
    /**
     * watch
     */
    visitSubscriptionAst(item: ast.SubscriptionAst, context: EntityMetadata): ast.SubscriptionAst;
    visitInputAst(item: ast.InputAst, context: EntityMetadata): ast.InputAst;
    visitEnumAst(item: ast.EnumAst, context: EntityMetadata): ast.EnumAst;
    visitIdAst(item: ast.IdAst, context: EntityMetadata): any;
    visitBooleanAst(item: ast.BooleanAst, context: EntityMetadata): any;
    visitFloatAst(item: ast.FloatAst, context: EntityMetadata): any;
    visitIntAst(item: ast.IntAst, context: EntityMetadata): any;
    visitStringAst(item: ast.StringAst, context: EntityMetadata): any;
    visitArrayAst(item: ast.ArrayAst, context: EntityMetadata): any;
    visitScalarAst(item: ast.ScalarAst, context: EntityMetadata): any;
    visitPropertyAst(item: ast.PropertyAst, context: EntityMetadata): any;
    visitDocumentAst(item: ast.DocumentAst, context: EntityMetadata): any;
    visitEmptyAst(item: ast.EmptyAst, context: EntityMetadata): ast.EmptyAst;
}
