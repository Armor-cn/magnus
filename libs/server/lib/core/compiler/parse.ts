import * as ast from './ast';
export class ParseVisitor implements ast.AstVisitor {
    type: Map<string, ast.TypeAst> = new Map()
    input: Map<string, ast.TypeAst> = new Map()
    visitMethodAst(ast: ast.MethodAst, context: string): string {
        return `${ast.name}(${ast.parameters.map(par => par.visit(this, 'input')).join(', ')}): ${ast.returnType.visit(this, context)}${ast.requiredReturn ? `!` : ``}`
    }
    visitParameterAst(ast: ast.ParameterAst, context: 'input' | 'type'): string {
        const type = ast.ast.visit(this, context);
        return `${ast.name}: ${type}${ast.required ? `!` : ``}`;
    }
    visitTypeAst(ast: ast.TypeAst, context: 'input' | 'type'): string {
        switch (context) {
            case 'type':
                ast.properties.map(pro => pro.visit(this, context))
                this.type.set(ast.name, ast)
                break;
            case 'input':
                ast.properties.map(pro => pro.visit(this, context))
                this.input.set(ast.name, ast)
                break;
            default:

                break;
        }
        return ast.name;
    }
    visitQueryAst(ast: ast.QueryAst, context: any): any {
        return `type Query {\n\t${ast.properties.map(method => method.visit(this, context)).join(`\n\t`)}\n}\n`
    }
    visitMutationAst(ast: ast.MutationAst, context: any): any {
        return `type Mutation {\n\t${ast.properties.map(method => method.visit(this, context)).join(`\n\t`)}\n}\n`
    }
    visitSubscriptionAst(ast: ast.SubscriptionAst, context: any): any {
        return `type Subscription {\n\t${ast.properties.map(method => method.visit(this, context)).join(`\n\t`)}\n}\n`
    }
    visitInputAst(ast: ast.InputAst, context: any): any {
        return `input ${ast.name} {\n\t${ast.properties.map(property => property.visit(this, context)).join(`\n\t`)}}\n`
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
    visitPropertyAst(ast: ast.PropertyAst, context: 'input' | 'type'): any {
        return `${ast.name}:${ast.type.visit(this, `type`)}${ast.required ? `!` : ``}`;
    }
    visitArrayAst(ast: ast.ArrayAst, context: any): any {
        return `[${ast.type.visit(this, context)}${ast.required ? `!` : ``}]`
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
            inputString += `{\n\t${input.properties.map(pro => pro.visit(this, `create`)).join(`\n\t`)}\n}\n`
        });
        let typeString = ``;
        this.type.forEach((input) => {
            typeString += `type ${input.name} `;
            typeString += `{\n\t${input.properties.map(pro => pro.visit(this, `create`)).join(`\n\t`)}\n}\n`
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
