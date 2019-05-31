import * as ast from './ast';
import { lowerFirst, upperFirst } from 'lodash';

export class ParseVisitor implements ast.AstVisitor {
    progress: ast.ProgressAst;
    visitUnionAst(item: ast.UnionAst, context: any): any {
        return `union ${item.name} = ${item.properties.map(pro => {
            if (pro instanceof ast.StringAst) {
                return `String`
            }
            else if (pro instanceof ast.IntAst) {
                return `Int`
            }
            else if (pro instanceof ast.TypeAst) {
                return `${pro.name}`
            }
            else if (pro instanceof ast.UseAst) {
                return `${pro.name}`
            }
            else if (pro instanceof ast.BooleanAst) {
                return `Boolean`
            }
            else if (pro instanceof ast.FloatAst) {
                return `Float`
            }
            else if (pro instanceof ast.EnumAst) {
                return `${pro.name}`
            }
        }).join(`| `)}\n`;
    }
    visitEmptyAst(item: ast.ProgressAst, context: any) {
        return ``
    }
    visitProgressAst(item: ast.ProgressAst, context: any): string {
        this.progress = item;
        const scalars = item.scalars.map(scalar => scalar.visit(this, context)).join(`\n`);
        const union = item.union.map(union => union.visit(this, context)).join(`\n`)
        const enu = item.enums.map(enu => enu.visit(this, context)).join(`\n`);
        let mutation = ``, query = ``, subscription = ``;
        item.docs.map(doc => {
            const outer = new ParseOuterVisitor(doc.name, this.progress, this);
            mutation += doc.mutation.visit(this, item);
            mutation += doc.mutation.visit(outer, item)
            query += doc.query.visit(this, item);
            query += doc.query.visit(outer, item)
            subscription += doc.subscription.visit(this, item);
            subscription += doc.subscription.visit(outer, item)
        })
        let inputString = ``;
        item.input.forEach((input) => {
            inputString += `input ${input.name} `;
            inputString += `{\n\t${input.properties.map(pro => pro.visit(this, `input`)).join(`\n\t`)}\n}\n`
        });
        let typeString = ``;
        item.type.forEach((input, key) => {
            typeString += `type ${key} `;
            typeString += `{\n\t${input.properties.map(pro => pro.visit(this, `output`)).join(`\n\t`)}\n}\n`
        });
        return `
${union}
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
`
    }
    visitMethodAst(ast: ast.MethodAst, context: 'input' | 'output'): string {
        return `${ast.name}(${ast.parameters.map(par => par.visit(this, 'input')).join(', ')}): ${ast.returnType.visit(this, 'output')}${ast.requiredReturn ? `!` : ``}`
    }
    visitParameterAst(ast: ast.ParameterAst, context: 'input' | 'type'): string {
        let type = ``
        if (Array.isArray(ast.ast)) {
            type = ast.ast.map(ast => ast.visit && ast.visit(this, 'input')).join(`|`);
        } else {
            type = ast.ast.visit(this, 'input');
        }
        return `${ast.name}: ${type}${ast.required ? `!` : ``}`;
    }
    visitInputAst(ast: ast.InputAst, context: any): any {
        return `input ${ast.name} {\n\t${ast.properties.map(property => property.visit(this, context)).join(`\n\t`)}}\n`
    }
    visitTypeAst(ast: ast.TypeAst, context: 'input' | 'output'): string {
        switch (context) {
            case 'input':
                // 如果是Input,如果属性不是Input需要转换成input
                ast.properties.map(pro => pro.visit(this, 'input'))
                if (this.progress.type.has(ast.name)) {
                    // 如果type里有了
                    const name = ast.name + `Input`;
                    this.progress.input.set(name, ast)
                    return name;
                } else {
                    this.progress.input.set(ast.name, ast)
                    return ast.name;
                }
            default:
                // output
                ast.properties.map(pro => pro.visit(this, context))
                if (this.progress.input.has(ast.name)) {
                    const name = ast.name + `Output`;
                    this.progress.type.set(name, ast)
                    return name;
                } else {
                    this.progress.type.set(ast.name, ast);
                    return ast.name;
                }
        }
    }
    visitQueryAst(ast: ast.QueryAst, context: any): any {
        return `\t${ast.properties.map(method => method.visit(this, 'output')).join(`\n\t`)}\n`
    }
    visitMutationAst(ast: ast.MutationAst, context: any): any {
        return `\t${ast.properties.map(method => method.visit(this, 'output')).join(`\n\t`)}\n`
    }
    visitSubscriptionAst(ast: ast.SubscriptionAst, context: any): any {
        return `\t${ast.properties.map(method => method.visit(this, 'output')).join(`\n\t`)}\n`
    }
    visitEnumAst(ast: ast.EnumAst, context: any): any {
        return `enum ${ast.name} {\n\t${ast.properties.join(`\n\t`)}\n}\n`
    }
    visitUseAst(item: ast.UseAst, context: any): any {
        return item.name;
    }
    visitIdAst(ast: ast.IdAst, context: any): any {
        return `Id`
    }
    visitBooleanAst(ast: ast.BooleanAst, context: any): any {
        return `Boolean`
    }
    visitFloatAst(ast: ast.FloatAst, context: any): any {
        return `Float`
    }
    visitIntAst(ast: ast.IntAst, context: any): any {
        return `Int`
    }
    visitStringAst(ast: ast.StringAst, context: any): any {
        return `String`
    }
    visitScalarAst(ast: ast.ScalarAst, context: any): any {
        return `scalar ${ast.name}`
    }
    visitPropertyAst(item: ast.PropertyAst, context: 'input' | 'output'): any {
        if (item.type instanceof ast.UseAst) {
            if (context === 'input') {
                if (!this.progress.input.has(item.type.name)) {
                    if (this.progress.type.has(item.type.name)) {
                        const ast = this.progress.type.get(item.type.name)
                        if (ast) {
                            this.progress.input.set(ast.name + 'Input', ast)
                            item.type.name = ast.name + 'Input';
                        }
                    }
                }
            } else {
                if (!this.progress.type.has(item.type.name)) {
                    if (this.progress.input.has(item.type.name)) {
                        const ast = this.progress.input.get(item.type.name)
                        if (ast) {
                            this.progress.type.set(ast.name + 'Output', ast)
                            item.type.name = ast.name + 'Output';
                        }
                    }
                }
            }
        }
        if (Array.isArray(item.type)) {
            return `${item.name}:${item.type.map(ast => ast.visit(this, context)).join('| ')}${item.required ? `!` : ``}`;
        } else {
            return `${item.name}:${item.type.visit(this, context)}${item.required ? `!` : ``}`;
        }
    }
    visitArrayAst(item: ast.ArrayAst, context: 'input' | 'output'): any {
        if (item.type instanceof ast.UseAst) {
            if (context === 'input') {
                if (!this.progress.input.has(item.type.name)) {
                    if (this.progress.type.has(item.type.name)) {
                        const ast = this.progress.type.get(item.type.name)
                        if (ast) {
                            this.progress.input.set(ast.name + 'Input', ast)
                            item.type.name = ast.name + 'Input';
                        }
                    }
                }
            } else {
                if (!this.progress.type.has(item.type.name)) {
                    if (this.progress.input.has(item.type.name)) {
                        const ast = this.progress.input.get(item.type.name)
                        if (ast) {
                            this.progress.type.set(ast.name + 'Output', ast)
                            item.type.name = ast.name + 'Output';
                        }
                    }
                }
            }
        }
        return `[${item.type.visit(this, context)}${item.required ? `!` : ``}]`
    }
    visitObjectLiteralAst(item: ast.ObjectLiteralAst, context: any) {
        return `ObjectLiteral`;
    }
    visitDateAst() {
        return `Date`
    }
    visitDocumentAst(ast: ast.DocumentAst, context: ast.ProgressAst): any {
        return ``;
    }
}

export class ParseOuterVisitor extends ParseVisitor {
    parent: ParseVisitor;
    constructor(public name: string, progress: ast.ProgressAst, parent: ParseVisitor) {
        super();
        this.progress = progress;
        this.parent = parent;
    }
    visitQueryAst(item: ast.QueryAst, context: any): any {
        return item.properties.map((it, key) => {
            if (ast.isMethodAst(it)) { } else {
                // 如果是属性
                if (ast.isTypeAst(it.type)) {
                    return it.type.properties.map((pro) => {
                        return `\t${lowerFirst(this.name)}${upperFirst(pro.visit(this, context))}\n`
                    }).join(`\n`)
                }
            }
        }).join(`\n\t`)
    }
    visitMutationAst(item: ast.MutationAst, context: any): string {
        return item.properties.map((it, key) => {
            if (ast.isMethodAst(it)) { } else {
                // 如果是属性
                if (ast.isTypeAst(it.type)) {
                    return it.type.properties.map((pro) => {
                        return `\t${lowerFirst(this.name)}${upperFirst(pro.visit(this, context))}\n`
                    }).join(`\n\t`)
                }
            }
        }).join(`\n\t`)
    }
    visitSubscriptionAst(item: ast.SubscriptionAst, context: any): string {
        return item.properties.map((it) => {
            if (ast.isMethodAst(it)) { } else {
                // 如果是属性
                if (ast.isTypeAst(it.type)) {
                    return it.type.properties.map((pro) => {
                        return `${lowerFirst(this.name)}${upperFirst(pro.visit(this, context))}\n`
                    }).join(`\n\t`)
                }
            }
        }).join(`\n\t`)
    }
}

