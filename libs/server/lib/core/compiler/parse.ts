import * as ast from './ast';
export class ParseVisitor implements ast.AstVisitor {
    type: Map<string, ast.TypeAst> = new Map()
    input: Map<string, ast.TypeAst> = new Map()
    visitMethodAst(ast: ast.MethodAst, context: 'input' | 'output'): string {
        return `${ast.name}(${ast.parameters.map(par => par.visit(this, 'input')).join(', ')}): ${ast.returnType.visit(this, 'output')}${ast.requiredReturn ? `!` : ``}`
    }
    visitParameterAst(ast: ast.ParameterAst, context: 'input' | 'type'): string {
        const type = ast.ast.visit(this, 'input');
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
                if (this.type.has(ast.name)) {
                    // 如果type里有了
                    const name = ast.name + `Input`;
                    this.input.set(name, ast)
                    return name;
                } else {
                    this.input.set(ast.name, ast)
                    return ast.name;
                }
            default:
                // output
                ast.properties.map(pro => pro.visit(this, context))
                if (this.input.has(ast.name)) {
                    const name = ast.name + `Output`;
                    this.type.set(name, ast)
                    return name;
                } else {
                    this.type.set(ast.name, ast);
                    return ast.name;
                }
        }
    }
    visitQueryAst(ast: ast.QueryAst, context: any): any {
        return `type Query {\n\t${ast.properties.map(method => method.visit(this, 'output')).join(`\n\t`)}\n}\n`
    }
    visitMutationAst(ast: ast.MutationAst, context: any): any {
        return `type Mutation {\n\t${ast.properties.map(method => method.visit(this, 'output')).join(`\n\t`)}\n}\n`
    }
    visitSubscriptionAst(ast: ast.SubscriptionAst, context: any): any {
        return `type Subscription {\n\t${ast.properties.map(method => method.visit(this, 'output')).join(`\n\t`)}\n}\n`
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
                if (!this.input.has(item.type.name)) {
                    if (this.type.has(item.type.name)) {
                        const ast = this.type.get(item.type.name)
                        if (ast) {
                            this.input.set(ast.name + 'Input', ast)
                            item.type.name = ast.name + 'Input';
                        }
                    }
                }
            } else {
                if (!this.type.has(item.type.name)) {
                    if (this.input.has(item.type.name)) {
                        const ast = this.input.get(item.type.name)
                        if (ast) {
                            this.type.set(ast.name + 'Output', ast)
                            item.type.name = ast.name + 'Output';
                        }
                    }
                }
            }
        }
        return `${item.name}:${item.type.visit(this, context)}${item.required ? `!` : ``}`;
    }
    visitArrayAst(item: ast.ArrayAst, context: 'input' | 'output'): any {
        if (item.type instanceof ast.UseAst) {
            if (context === 'input') {
                if (!this.input.has(item.type.name)) {
                    if (this.type.has(item.type.name)) {
                        const ast = this.type.get(item.type.name)
                        if (ast) {
                            this.input.set(ast.name + 'Input', ast)
                            item.type.name = ast.name + 'Input';
                        }
                    }
                }
            } else {
                if (!this.type.has(item.type.name)) {
                    if (this.input.has(item.type.name)) {
                        const ast = this.input.get(item.type.name)
                        if (ast) {
                            this.type.set(ast.name + 'Output', ast)
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
    visitDocumentAst(ast: ast.DocumentAst, context: any): any {
        const mutation = ast.mutation.visit(this, context);
        const query = ast.query.visit(this, context);
        const subscription = ast.subscription.visit(this, context);
        const scalars = ast.scalars.map(scalar => scalar.visit(this, context)).join(`\n`);
        const enu = ast.enums.map(enu => enu.visit(this, context)).join(`\n`);
        let inputString = ``;
        this.input.forEach((input) => {
            inputString += `input ${input.name} `;
            inputString += `{\n\t${input.properties.map(pro => pro.visit(this, `input`)).join(`\n\t`)}\n}\n`
        });
        let typeString = ``;
        this.type.forEach((input, key) => {
            typeString += `type ${key} `;
            typeString += `{\n\t${input.properties.map(pro => pro.visit(this, `output`)).join(`\n\t`)}\n}\n`
        });
        return `
${scalars}
${enu}
${inputString}
${typeString}
${query}
${mutation}
${subscription}
`
    }
}
