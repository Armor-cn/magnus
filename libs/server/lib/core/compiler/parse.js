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
class ParseVisitor {
    visitEmptyAst(item, context) {
        return ``;
    }
    visitProgressAst(item, context) {
        this.progress = item;
        const scalars = item.scalars.map(scalar => scalar.visit(this, context)).join(`\n`);
        const enu = item.enums.map(enu => enu.visit(this, context)).join(`\n`);
        let mutation = ``, query = ``, subscription = ``;
        item.docs.map(doc => {
            mutation += doc.mutation.visit(this, item);
            query += doc.query.visit(this, item);
            subscription += doc.subscription.visit(this, item);
        });
        let inputString = ``;
        item.input.forEach((input) => {
            inputString += `input ${input.name} `;
            inputString += `{\n\t${input.properties.map(pro => pro.visit(this, `input`)).join(`\n\t`)}\n}\n`;
        });
        let typeString = ``;
        item.type.forEach((input, key) => {
            typeString += `type ${key} `;
            typeString += `{\n\t${input.properties.map(pro => pro.visit(this, `output`)).join(`\n\t`)}\n}\n`;
        });
        return `
${scalars}
${enu}
${inputString}
${typeString}
type Query {
${query}
}
type Subscription {
${subscription} 
}
type Mutation {
${mutation} 
}
`;
    }
    visitMethodAst(ast, context) {
        return `${ast.name}(${ast.parameters.map(par => par.visit(this, 'input')).join(', ')}): ${ast.returnType.visit(this, 'output')}${ast.requiredReturn ? `!` : ``}`;
    }
    visitParameterAst(ast, context) {
        const type = ast.ast.visit(this, 'input');
        return `${ast.name}: ${type}${ast.required ? `!` : ``}`;
    }
    visitInputAst(ast, context) {
        return `input ${ast.name} {\n\t${ast.properties.map(property => property.visit(this, context)).join(`\n\t`)}}\n`;
    }
    visitTypeAst(ast, context) {
        switch (context) {
            case 'input':
                // 如果是Input,如果属性不是Input需要转换成input
                ast.properties.map(pro => pro.visit(this, 'input'));
                if (this.progress.type.has(ast.name)) {
                    // 如果type里有了
                    const name = ast.name + `Input`;
                    this.progress.input.set(name, ast);
                    return name;
                }
                else {
                    this.progress.input.set(ast.name, ast);
                    return ast.name;
                }
            default:
                // output
                ast.properties.map(pro => pro.visit(this, context));
                if (this.progress.input.has(ast.name)) {
                    const name = ast.name + `Output`;
                    this.progress.type.set(name, ast);
                    return name;
                }
                else {
                    this.progress.type.set(ast.name, ast);
                    return ast.name;
                }
        }
    }
    visitQueryAst(ast, context) {
        return `\t${ast.properties.map(method => method.visit(this, 'output')).join(`\n\t`)}\n`;
    }
    visitMutationAst(ast, context) {
        return `\t${ast.properties.map(method => method.visit(this, 'output')).join(`\n\t`)}\n`;
    }
    visitSubscriptionAst(ast, context) {
        return `\t${ast.properties.map(method => method.visit(this, 'output')).join(`\n\t`)}\n`;
    }
    visitEnumAst(ast, context) {
        return `enum ${ast.name} {\n\t${ast.properties.join(`\n\t`)}\n}\n`;
    }
    visitUseAst(item, context) {
        return item.name;
    }
    visitIdAst(ast, context) {
        return `Id`;
    }
    visitBooleanAst(ast, context) {
        return `Boolean`;
    }
    visitFloatAst(ast, context) {
        return `Float`;
    }
    visitIntAst(ast, context) {
        return `Int`;
    }
    visitStringAst(ast, context) {
        return `String`;
    }
    visitScalarAst(ast, context) {
        return `scalar ${ast.name}`;
    }
    visitPropertyAst(item, context) {
        if (item.type instanceof ast.UseAst) {
            if (context === 'input') {
                if (!this.progress.input.has(item.type.name)) {
                    if (this.progress.type.has(item.type.name)) {
                        const ast = this.progress.type.get(item.type.name);
                        if (ast) {
                            this.progress.input.set(ast.name + 'Input', ast);
                            item.type.name = ast.name + 'Input';
                        }
                    }
                }
            }
            else {
                if (!this.progress.type.has(item.type.name)) {
                    if (this.progress.input.has(item.type.name)) {
                        const ast = this.progress.input.get(item.type.name);
                        if (ast) {
                            this.progress.type.set(ast.name + 'Output', ast);
                            item.type.name = ast.name + 'Output';
                        }
                    }
                }
            }
        }
        return `${item.name}:${item.type.visit(this, context)}${item.required ? `!` : ``}`;
    }
    visitArrayAst(item, context) {
        if (item.type instanceof ast.UseAst) {
            if (context === 'input') {
                if (!this.progress.input.has(item.type.name)) {
                    if (this.progress.type.has(item.type.name)) {
                        const ast = this.progress.type.get(item.type.name);
                        if (ast) {
                            this.progress.input.set(ast.name + 'Input', ast);
                            item.type.name = ast.name + 'Input';
                        }
                    }
                }
            }
            else {
                if (!this.progress.type.has(item.type.name)) {
                    if (this.progress.input.has(item.type.name)) {
                        const ast = this.progress.input.get(item.type.name);
                        if (ast) {
                            this.progress.type.set(ast.name + 'Output', ast);
                            item.type.name = ast.name + 'Output';
                        }
                    }
                }
            }
        }
        return `[${item.type.visit(this, context)}${item.required ? `!` : ``}]`;
    }
    visitObjectLiteralAst(item, context) {
        return `ObjectLiteral`;
    }
    visitDateAst() {
        return `Date`;
    }
    visitDocumentAst(ast, context) {
        return ``;
    }
}
exports.ParseVisitor = ParseVisitor;
