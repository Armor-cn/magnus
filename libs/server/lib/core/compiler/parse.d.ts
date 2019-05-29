import * as ast from './ast';
export declare class ParseVisitor implements ast.AstVisitor {
    progress: ast.ProgressAst;
    visitEmptyAst(item: ast.ProgressAst, context: any): string;
    visitProgressAst(item: ast.ProgressAst, context: any): string;
    visitMethodAst(ast: ast.MethodAst, context: 'input' | 'output'): string;
    visitParameterAst(ast: ast.ParameterAst, context: 'input' | 'type'): string;
    visitInputAst(ast: ast.InputAst, context: any): any;
    visitTypeAst(ast: ast.TypeAst, context: 'input' | 'output'): string;
    visitQueryAst(ast: ast.QueryAst, context: any): any;
    visitMutationAst(ast: ast.MutationAst, context: any): any;
    visitSubscriptionAst(ast: ast.SubscriptionAst, context: any): any;
    visitEnumAst(ast: ast.EnumAst, context: any): any;
    visitUseAst(item: ast.UseAst, context: any): any;
    visitIdAst(ast: ast.IdAst, context: any): any;
    visitBooleanAst(ast: ast.BooleanAst, context: any): any;
    visitFloatAst(ast: ast.FloatAst, context: any): any;
    visitIntAst(ast: ast.IntAst, context: any): any;
    visitStringAst(ast: ast.StringAst, context: any): any;
    visitScalarAst(ast: ast.ScalarAst, context: any): any;
    visitPropertyAst(item: ast.PropertyAst, context: 'input' | 'output'): any;
    visitArrayAst(item: ast.ArrayAst, context: 'input' | 'output'): any;
    visitObjectLiteralAst(item: ast.ObjectLiteralAst, context: any): string;
    visitDateAst(): string;
    visitDocumentAst(ast: ast.DocumentAst, context: ast.ProgressAst): any;
}
export declare class ParseOuterVisitor extends ParseVisitor {
}
