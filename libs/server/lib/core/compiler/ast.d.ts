export declare abstract class Ast {
    abstract visit(visitor: AstVisitor, context: any): any;
}
export declare class ProgressAst extends Ast {
    scalars: ScalarAst[];
    enums: EnumAst[];
    type: Map<string, TypeAst>;
    input: Map<string, TypeAst>;
    docs: DocumentAst[];
    visit(visitor: AstVisitor, context: any): any;
}
export declare class DocumentAst extends Ast {
    name: string;
    mutation: MutationAst;
    query: QueryAst;
    subscription: SubscriptionAst;
    constructor(name: string);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class EmptyAst extends Ast {
    constructor(name: string);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class SubscriptionAst extends Ast {
    properties: (MethodAst | PropertyAst)[];
    visit(visitor: AstVisitor, context: any): any;
}
export declare class MutationAst extends Ast {
    properties: (MethodAst | PropertyAst)[];
    visit(visitor: AstVisitor, context: any): any;
}
export declare class QueryAst extends Ast {
    properties: (MethodAst | PropertyAst)[];
    visit(visitor: AstVisitor, context: any): any;
}
export declare class MethodAst extends Ast {
    name: string;
    parameters: ParameterAst[];
    returnType: AstType;
    requiredReturn: boolean;
    constructor(name: string);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class ParameterAst extends Ast {
    index: number;
    name: string;
    ast: AstType;
    required: boolean;
    constructor(index: number, name: string, ast: AstType, required: boolean);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class InputAst extends Ast {
    name: string;
    properties: PropertyAst[];
    father: AstType;
    constructor(name: string, father?: AstType);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class EnumAst extends Ast {
    name: string;
    properties: string[];
    constructor(name: string, properties?: string[]);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class StringAst extends Ast {
    visit(visitor: AstVisitor, context: any): any;
}
export declare class IntAst extends Ast {
    visit(visitor: AstVisitor, context: any): any;
}
export declare class DateAst extends Ast {
    visit(visitor: AstVisitor, context: any): any;
}
export declare class ObjectLiteralAst extends Ast {
    visit(visitor: AstVisitor, context: any): any;
}
export declare class FloatAst extends Ast {
    visit(visitor: AstVisitor, context: any): any;
}
export declare class BooleanAst extends Ast {
    constructor();
    visit(visitor: AstVisitor, context: any): any;
}
export declare class IdAst extends Ast {
    visit(visitor: AstVisitor, context: any): any;
}
export declare class ArrayAst extends Ast {
    required: boolean;
    type: AstType;
    constructor(type: AstType, required: boolean);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class ScalarAst extends Ast {
    name: string;
    constructor(name: string);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class PropertyAst extends Ast {
    name: string;
    type: AstType;
    required: boolean;
    constructor(name: string, type: AstType, required: boolean);
    visit(visitor: AstVisitor, context: any): any;
}
export declare type AstType = ArrayAst | IdAst | BooleanAst | FloatAst | IntAst | StringAst | TypeAst | EnumAst;
export declare function isTypeAst(val: any): val is TypeAst;
export declare class UseAst extends Ast {
    name: string;
    type: 'enum' | 'type' | 'input';
    constructor(name: string);
    visit(visitor: AstVisitor, context: any): any;
}
export declare class TypeAst extends Ast {
    name: string;
    properties: (PropertyAst | MethodAst | EmptyAst)[];
    father: AstType;
    constructor(name: string, father?: AstType);
    visit(visitor: AstVisitor, context: any): any;
}
export interface AstVisitor<T = any> {
    visitUseAst(ast: UseAst, context: T): any;
    visitObjectLiteralAst(ast: ObjectLiteralAst, context: T): any;
    visitTypeAst(ast: TypeAst, context: T): any;
    visitParameterAst(ast: ParameterAst, context: T): any;
    visitQueryAst(ast: QueryAst, context: T): any;
    visitMutationAst(ast: MutationAst, context: T): any;
    visitSubscriptionAst(ast: SubscriptionAst, context: T): any;
    visitInputAst(ast: InputAst, context: T): any;
    visitEnumAst(ast: EnumAst, context: T): any;
    visitIdAst(ast: IdAst, context: T): any;
    visitBooleanAst(ast: BooleanAst, context: T): any;
    visitFloatAst(ast: FloatAst, context: T): any;
    visitIntAst(ast: IntAst, context: T): any;
    visitStringAst(ast: StringAst, context: T): any;
    visitScalarAst(ast: ScalarAst, context: T): any;
    visitMethodAst(ast: MethodAst, context: T): any;
    visitPropertyAst(ast: PropertyAst, context: T): any;
    visitArrayAst(ast: ArrayAst, context: T): any;
    visitDocumentAst(ast: DocumentAst, context: T): any;
    visitDateAst(ast: DateAst, context: T): any;
    visitProgressAst(ast: ProgressAst, context: T): any;
    visitEmptyAst(ast: EmptyAst, context: T): any;
}
export declare class NullAstVisitor<T = any> implements AstVisitor<T> {
    visitUseAst(ast: UseAst, context: T): any;
    visitObjectLiteralAst(ast: ObjectLiteralAst, context: T): any;
    visitTypeAst(ast: TypeAst, context: T): any;
    visitParameterAst(ast: ParameterAst, context: T): any;
    visitQueryAst(ast: QueryAst, context: T): any;
    visitMutationAst(ast: MutationAst, context: T): any;
    visitSubscriptionAst(ast: SubscriptionAst, context: T): any;
    visitInputAst(ast: InputAst, context: T): any;
    visitEnumAst(ast: EnumAst, context: T): any;
    visitIdAst(ast: IdAst, context: T): any;
    visitBooleanAst(ast: BooleanAst, context: T): any;
    visitFloatAst(ast: FloatAst, context: T): any;
    visitIntAst(ast: IntAst, context: T): any;
    visitStringAst(ast: StringAst, context: T): any;
    visitScalarAst(ast: ScalarAst, context: T): any;
    visitMethodAst(ast: MethodAst, context: T): any;
    visitPropertyAst(ast: PropertyAst, context: T): any;
    visitArrayAst(ast: ArrayAst, context: T): any;
    visitDocumentAst(ast: DocumentAst, context: T): any;
    visitDateAst(ast: DateAst, context: T): any;
    visitProgressAst(ast: ProgressAst, context: T): any;
    visitEmptyAst(ast: EmptyAst, context: T): void;
}
export declare function isMethodAst(ast: any): ast is MethodAst;
