export abstract class Ast {
    abstract visit(visitor: AstVisitor, context: any): any;
}
export class ProgressAst extends Ast {
    scalars: ScalarAst[] = [];
    enums: EnumAst[] = [];
    type: Map<string, TypeAst> = new Map();
    input: Map<string, TypeAst> = new Map();
    docs: DocumentAst[] = [];
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitProgressAst(this, context);
    }
}
export class DocumentAst extends Ast {
    mutation: MutationAst;
    query: QueryAst;
    subscription: SubscriptionAst;
    constructor() {
        super();
    }
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitDocumentAst(this, context);
    }
}
export class EmptyAst extends Ast {
    constructor(name: string) {
        super();
    }
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitEmptyAst(this, context);
    }
}
export class SubscriptionAst extends Ast {
    properties: (MethodAst | PropertyAst)[] = [];
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitSubscriptionAst(this, context);
    }
}
export class MutationAst extends Ast {
    properties: (MethodAst | PropertyAst)[] = [];
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitMutationAst(this, context);
    }
}
export class QueryAst extends Ast {
    properties: (MethodAst | PropertyAst)[] = [];
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitQueryAst(this, context);
    }
}

export class MethodAst extends Ast {
    name: string;
    parameters: ParameterAst[] = [];
    returnType: AstType;
    requiredReturn: boolean;
    constructor(name: string) {
        super();
        this.name = name;
    }
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitMethodAst(this, context);
    }
}
export class ParameterAst extends Ast {
    index: number;
    name: string;
    ast: AstType;
    required: boolean;
    constructor(index: number, name: string, ast: AstType, required: boolean) {
        super();
        this.index = index;
        this.name = name;
        this.ast = ast;
        this.required = required;
    }
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitParameterAst(this, context);
    }
}

export class InputAst extends Ast {
    name: string;
    properties: PropertyAst[] = [];
    father: AstType;
    constructor(name: string, father?: AstType) {
        super();
        this.name = name;
        if (father) this.father = father;
    }
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitInputAst(this, context);
    }
}
export class EnumAst extends Ast {
    name: string;
    properties: string[] = [];
    constructor(name: string, properties: string[] = []) {
        super();
        this.name = name;
        this.properties = properties;
    }
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitEnumAst(this, context);
    }
}
export class StringAst extends Ast {
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitStringAst(this, context);
    }
}
export class IntAst extends Ast {
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitIntAst(this, context);
    }
}

export class DateAst extends Ast {
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitDateAst(this, context);
    }
}

export class ObjectLiteralAst extends Ast {
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitObjectLiteralAst(this, context);
    }
}

export class FloatAst extends Ast {
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitFloatAst(this, context);
    }
}

export class BooleanAst extends Ast {
    constructor() {
        super();
    }
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitBooleanAst(this, context);
    }
}
export class IdAst extends Ast {
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitIdAst(this, context);
    }
}
export class ArrayAst extends Ast {
    required: boolean;
    type: AstType;
    constructor(type: AstType, required: boolean) {
        super();
        this.type = type;
        this.required = required;
    }
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitArrayAst(this, context);
    }
}
export class ScalarAst extends Ast {
    name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitScalarAst(this, context);
    }
}
export class PropertyAst extends Ast {
    name: string;
    type: AstType;
    required: boolean;
    constructor(name: string, type: AstType, required: boolean) {
        super();
        this.name = name;
        this.type = type;
        this.required = required;
    }
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitPropertyAst(this, context);
    }
}
export type AstType = ArrayAst | IdAst | BooleanAst | FloatAst | IntAst | StringAst | TypeAst | EnumAst;
export class UseAst extends Ast {
    name: string;
    type: 'enum' | 'type' | 'input';
    constructor(name: string) {
        super();
        this.name = name;
    }
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitUseAst(this, context);
    }
}
export class TypeAst extends Ast {
    name: string;
    properties: (PropertyAst | MethodAst | EmptyAst)[] = [];
    father: AstType;
    constructor(name: string, father?: AstType) {
        super();
        this.name = name;
        if (father) this.father = father;
    }
    visit(visitor: AstVisitor, context: any) {
        return visitor.visitTypeAst(this, context);
    }
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

export class NullAstVisitor<T = any> implements AstVisitor<T> {
    visitUseAst(ast: UseAst, context: T): any { }
    visitObjectLiteralAst(ast: ObjectLiteralAst, context: T): any { }
    visitTypeAst(ast: TypeAst, context: T): any { }
    visitParameterAst(ast: ParameterAst, context: T): any { }
    visitQueryAst(ast: QueryAst, context: T): any { }
    visitMutationAst(ast: MutationAst, context: T): any { }
    visitSubscriptionAst(ast: SubscriptionAst, context: T): any { }
    visitInputAst(ast: InputAst, context: T): any { }
    visitEnumAst(ast: EnumAst, context: T): any { }
    visitIdAst(ast: IdAst, context: T): any { }
    visitBooleanAst(ast: BooleanAst, context: T): any { }
    visitFloatAst(ast: FloatAst, context: T): any { }
    visitIntAst(ast: IntAst, context: T): any { }
    visitStringAst(ast: StringAst, context: T): any { }
    visitScalarAst(ast: ScalarAst, context: T): any { }
    visitMethodAst(ast: MethodAst, context: T): any { }
    visitPropertyAst(ast: PropertyAst, context: T): any { }
    visitArrayAst(ast: ArrayAst, context: T): any { }
    visitDocumentAst(ast: DocumentAst, context: T): any { }
    visitDateAst(ast: DateAst, context: T): any { }
    visitProgressAst(ast: ProgressAst, context: T): any { }
    visitEmptyAst(ast: EmptyAst, context: T) { }
}