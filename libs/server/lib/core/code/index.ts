import { EntityMetadata } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { readFileSync } from 'fs-extra'
import { join } from 'path';
export class CodeQuery {
    constructor(public propertites: PropertyMethod[]) { }
}
export class Property {
    constructor(public name: string, public type: string, public required: boolean) { }
}
export class CodeInput {
    constructor(public name: string, public propertites: Property[]) { }
}
export class PropertyMethod {
    constructor(public name: string,
        public params: {
            [key: string]: {
                type: string,
                required: boolean
            }
        }, public result: string) { }
}
export class CodeMutation {
    constructor(public propertites: PropertyMethod[]) { }
}
export class CodeSubscription {
    constructor(public propertites: PropertyMethod[]) { }
}
export class CodeType {
    constructor(public name: string, public propertites: Property[]) { }
}
export class Code {
    query: Set<CodeQuery> = new Set();
    input: Set<CodeInput> = new Set();
    mutation: Set<CodeMutation> = new Set();
    subscription: Set<CodeSubscription> = new Set();
    type: Set<CodeType> = new Set();
    scalar: Set<string> = new Set();

    constructor(public meta: EntityMetadata) {
        this.addType(this.transformType());
        /**
         * 添加find conditions 到type
         */
        this.addFindConditions();
        /**
         * 添加find and count result
         */
        this.addFindAndCountResult();

        this.addFindManyOptions();

        this.addFindOneOptions();
        this.addQuery(this.transformQuery())
    }

    addFindOneOptions() {
        const propertities: Property[] = [];
        propertities.push(new Property('relations', '[String]', false));
        this.addType(new CodeType(`${this.meta.discriminatorValue}FindOneOptions`, propertities));
    }

    addFindManyOptions() {
        const propertities: Property[] = [];
        propertities.push(new Property('skip', 'Int', false));
        propertities.push(new Property('take', 'Int', false));
        this.addType(new CodeType(`${this.meta.discriminatorValue}FindManyOptions`, propertities));
    }

    /**
     * add find conditions
     */
    addFindConditions() {
        const propertities: Property[] = [];
        this.meta.columns.map((column: ColumnMetadata) => {
            const columnTyp: string = (column.type as any).name;
            propertities.push(new Property(column.databaseName, columnTyp, false));
        });
        this.addType(new CodeType(`${this.meta.discriminatorValue}FindConditions`, propertities));
    }

    /**
     * 获取条件名
     */
    getFindConditions() {
        return `${this.meta.discriminatorValue}FindConditions`
    }
    /**
     * find方法返回结果
     */
    getFindResult() {
        return `[${this.meta.discriminatorValue}]`
    }
    /**
     * findAndCount返回结果
     */
    getFindAndCountResult() {
        return `${this.meta.discriminatorValue}FindAndCountResult`
    }

    /**
     * 添加到type
     */
    addFindAndCountResult() {
        const propertities: Property[] = [];
        propertities.push(new Property('list', this.getFindResult(), true));
        propertities.push(new Property('count', 'Int', true));
        this.addType(new CodeType(`${this.getFindAndCountResult()}`, propertities));
    }

    addQuery(query: CodeQuery) {
        this.query.add(query)
    }

    createQuery() {
        let code = ``;
        this.query.forEach(query => {
            query.propertites.map(property => {
                const { name, params, result } = property;
                code += `\t${name}`;
                const paramsMap = Object.keys(params)
                if (paramsMap.length > 0) {
                    code += `(`
                    paramsMap.map(key => {
                        const type = params[key];
                        code += `${key}:${type.type}${type.required ? `!` : ``}`
                    });
                    code += `): ${result}!\n`
                } else {
                    code += `: ${result}!\n`
                }
            });
        });
        return code;
    }

    addInput(query: CodeInput) {
        this.input.add(query)
    }

    createInput() {
        let code = ``
        this.input.forEach(query => {
            const { name, propertites } = query;
            code += `input ${name}{\n`
            propertites.map(property => {
                code += `\t${property.name}: ${this.transformTypeName(property.type)}${property.required ? `!` : ''}\n`;
            });
            code += `}\n`;
        });
        code += ``;
        return code;
    }

    addMutation(query: CodeMutation) {
        this.mutation.add(query)
    }

    createMutation() {
        let code = ``
        this.mutation.forEach(query => {
            query.propertites.map(property => {
                const { name, params, result } = property;
                code += `\t${name}`;
                const paramsMap = Object.keys(params)
                if (paramsMap.length > 0) {
                    code += `(`
                    paramsMap.map(key => {
                        const type = params[key];
                        code += `${key}:${type.type}${type.type ? `!` : ``}`
                    });
                    code += `): ${result}!\n`
                } else {
                    code += `: ${result}!\n`
                }
            });
        });
        return code;
    }

    addSubscription(query: CodeSubscription) {
        this.subscription.add(query)
    }

    createSubscription() {
        let code = ``
        this.subscription.forEach(query => {
            query.propertites.map(property => {
                const { name, params, result } = property;
                code += `\t${name}`;
                const paramsMap = Object.keys(params)
                if (paramsMap.length > 0) {
                    code += `(`
                    paramsMap.map(key => {
                        const type = params[key];
                        code += `${key}:${type.type}${type.type ? `!` : ``}`
                    });
                    code += `): ${result}!\n`
                } else {
                    code += `: ${result}!\n`
                }
            });
        });
        return code;
    }

    addType(query: CodeType) {
        this.type.add(query)
    }

    createType() {
        let code = ``
        this.type.forEach(query => {
            const { name, propertites } = query;
            code += `type ${name}{\n`
            propertites.map(property => {
                code += `\t${property.name}: ${this.transformTypeName(property.type)}${property.required ? `!` : ''}\n`;
            });
            code += `}\n`;
        });
        code += ``;
        return code;
    }

    addScalar(name: string) {
        this.scalar.add(name)
    }

    createScalar() {
        let code = ``;
        this.scalar.forEach(scalar => {
            code += `scalar ${scalar}\n`
        })
        return code;
    }

    transformInput(entity: EntityMetadata) {
        const name: string = entity.name;
        const propertities: Property[] = [];
        entity.columns.map((column: ColumnMetadata) => {
            const columnTyp: string = (column.type as any).name;
            let required: boolean = false;
            if (!column.isNullable) {
                if (column.isGenerated || column.isCreateDate || column.isUpdateDate) {
                    required = false
                } else {
                    required = true;
                }
            }
            propertities.push(new Property(column.databaseName, columnTyp, required));
        });
        return new CodeInput(name, propertities);
    }

    transformMutation() {
        const propertites: PropertyMethod[] = [];
        return new CodeMutation(propertites);
    }
    /**
     * count 统计
     * find 查找
     * findAndCount 查找并统计
     * findByIds 根据ids查找
     * findOne 查找一个
     * findOneOrFail 查找一个或找不到
     * query 执行sql
     */
    transformQuery() {
        const propertites: PropertyMethod[] = [];
        propertites.push(new PropertyMethod('find', {
            where: {
                type: this.getFindConditions(),
                required: false
            }
        }, this.getFindResult()));
        propertites.push(new PropertyMethod('findAndCount', {
            where: {
                type: this.getFindConditions(),
                required: false
            }
        }, this.getFindAndCountResult()));
        propertites.push(new PropertyMethod('count', {
            where: {
                type: this.getFindConditions(),
                required: false
            }
        }, 'Int'));
        propertites.push(new PropertyMethod('findByIds', {
            where: {
                type: this.getFindConditions(),
                required: false
            }
        }, 'Int'));
        return new CodeQuery(propertites);
    }

    transformTypeName(name: string) {
        switch (name) {
            case 'Number':
            case 'number':
                return 'Int';
            default:
                return name;
        }
    }


    transformScalar(name: string) {
        return name;
    }

    transformSubscription() {
        const propertites: PropertyMethod[] = [];
        return new CodeSubscription(propertites);
    }

    transformType() {
        const entity: EntityMetadata = this.meta;
        const name: string = entity.name;
        const propertities: Property[] = [];
        entity.columns.map((column: ColumnMetadata) => {
            const columnTyp: string = (column.type as any).name;
            let required: boolean = false;
            if (!column.isNullable) {
                if (column.isGenerated || column.isCreateDate || column.isUpdateDate) {
                    required = false
                } else {
                    required = true;
                }
            }
            propertities.push(new Property(column.databaseName, columnTyp, required));
        });
        return new CodeType(name, propertities);
    }
}

export class CodeManager {
    scalar: string = ``;
    type: string = ``;
    input: string = ``;
    query: string = ``;
    mutation: string = ``;
    subscription: string = ``;

    constructor(public metadatas: EntityMetadata[]) {
        this.scalar += `${readFileSync(join(__dirname, 'scalar.graphql')).toString('utf8')}`;
        this.input += `${readFileSync(join(__dirname, 'input.graphql')).toString('utf8')}`;
        this.type += `${readFileSync(join(__dirname, 'type.graphql')).toString('utf8')}`;
        this.metadatas.map(meta => {
            const code = new Code(meta);
            this.query += code.createQuery();
            this.type += code.createType();
            this.scalar += code.createScalar();
            this.mutation += code.createMutation();
            this.subscription += code.createSubscription();
            this.input += code.createInput();
        });
    }

    create() {
        return `${this.scalar}
${this.type}
${this.input}
type Mutation {
${this.mutation}
}
type Query {
${this.query}
}
type Subscription {
${this.subscription}
}
`
    }
}
