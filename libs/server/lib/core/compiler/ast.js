"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ast {
}
exports.Ast = Ast;
class DocumentAst extends Ast {
    constructor() {
        super(...arguments);
        this.scalars = [];
        this.enums = [];
    }
    visit(visitor, context) {
        return visitor.visitDocumentAst(this, context);
    }
}
exports.DocumentAst = DocumentAst;
class SubscriptionAst extends Ast {
    constructor() {
        super(...arguments);
        this.properties = [];
    }
    visit(visitor, context) {
        return visitor.visitSubscriptionAst(this, context);
    }
}
exports.SubscriptionAst = SubscriptionAst;
class MutationAst extends Ast {
    constructor() {
        super(...arguments);
        this.properties = [];
    }
    visit(visitor, context) {
        return visitor.visitMutationAst(this, context);
    }
}
exports.MutationAst = MutationAst;
class QueryAst extends Ast {
    constructor() {
        super(...arguments);
        this.properties = [];
    }
    visit(visitor, context) {
        return visitor.visitQueryAst(this, context);
    }
}
exports.QueryAst = QueryAst;
class MethodAst extends Ast {
    constructor(name) {
        super();
        this.parameters = [];
        this.name = name;
    }
    visit(visitor, context) {
        return visitor.visitMethodAst(this, context);
    }
}
exports.MethodAst = MethodAst;
class ParameterAst extends Ast {
    constructor(index, name, ast, required) {
        super();
        this.index = index;
        this.name = name;
        this.ast = ast;
        this.required = required;
    }
    visit(visitor, context) {
        return visitor.visitParameterAst(this, context);
    }
}
exports.ParameterAst = ParameterAst;
class InputAst extends Ast {
    constructor(name, father) {
        super();
        this.properties = [];
        this.name = name;
        if (father)
            this.father = father;
    }
    visit(visitor, context) {
        return visitor.visitInputAst(this, context);
    }
}
exports.InputAst = InputAst;
class EnumAst extends Ast {
    constructor(name, properties = []) {
        super();
        this.properties = [];
        this.name = name;
        this.properties = properties;
    }
    visit(visitor, context) {
        return visitor.visitEnumAst(this, context);
    }
}
exports.EnumAst = EnumAst;
class StringAst extends Ast {
    visit(visitor, context) {
        return visitor.visitStringAst(this, context);
    }
}
exports.StringAst = StringAst;
class IntAst extends Ast {
    visit(visitor, context) {
        return visitor.visitIntAst(this, context);
    }
}
exports.IntAst = IntAst;
class DateAst extends Ast {
    visit(visitor, context) {
        return visitor.visitDateAst(this, context);
    }
}
exports.DateAst = DateAst;
class ObjectLiteralAst extends Ast {
    visit(visitor, context) {
        return visitor.visitObjectLiteralAst(this, context);
    }
}
exports.ObjectLiteralAst = ObjectLiteralAst;
class FloatAst extends Ast {
    visit(visitor, context) {
        return visitor.visitFloatAst(this, context);
    }
}
exports.FloatAst = FloatAst;
class BooleanAst extends Ast {
    constructor() {
        super();
    }
    visit(visitor, context) {
        return visitor.visitBooleanAst(this, context);
    }
}
exports.BooleanAst = BooleanAst;
class IdAst extends Ast {
    visit(visitor, context) {
        return visitor.visitIdAst(this, context);
    }
}
exports.IdAst = IdAst;
class ArrayAst extends Ast {
    constructor(type, required) {
        super();
        this.type = type;
        this.required = required;
    }
    visit(visitor, context) {
        return visitor.visitArrayAst(this, context);
    }
}
exports.ArrayAst = ArrayAst;
class ScalarAst extends Ast {
    constructor(name) {
        super();
        this.name = name;
    }
    visit(visitor, context) {
        return visitor.visitScalarAst(this, context);
    }
}
exports.ScalarAst = ScalarAst;
class PropertyAst extends Ast {
    constructor(name, type, required) {
        super();
        this.name = name;
        this.type = type;
        this.required = required;
    }
    visit(visitor, context) {
        return visitor.visitPropertyAst(this, context);
    }
}
exports.PropertyAst = PropertyAst;
class UseAst extends Ast {
    constructor(name) {
        super();
        this.name = name;
    }
    visit(visitor, context) {
        return visitor.visitUseAst(this, context);
    }
}
exports.UseAst = UseAst;
class TypeAst extends Ast {
    constructor(name, father) {
        super();
        this.properties = [];
        this.name = name;
        if (father)
            this.father = father;
    }
    visit(visitor, context) {
        return visitor.visitTypeAst(this, context);
    }
}
exports.TypeAst = TypeAst;
