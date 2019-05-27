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
        this.addSubscriptionWhere();
        this.addQuery(this.transformQuery())
        this.addMutation(this.transformMutation())
        this.addSubscription(this.transformSubscription())
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
        propertities.push(new Property('relations', `[String!]`, false));
        propertities.push(new Property('join', `JoinOptions`, false));
        propertities.push(new Property('where', `${this.meta.discriminatorValue}FindConditions`, false));
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

    addSubscriptionPayload() {
        const propertities: Property[] = [];
        propertities.push(new Property('mutation', `MutationType`, true));
        propertities.push(new Property('node', `${this.meta.name}`, false));
        propertities.push(new Property('updatedFields', `[String!]`, false));
        propertities.push(new Property('previousValues', `${this.meta.name}`, false));
        this.addType(new CodeType(`${this.meta.name}SubscriptionPayload`, propertities));
    }

    addSubscriptionWhere() {
        this.addWhereInput();
        this.addSubscriptionPayload();
        const propertities: Property[] = [];
        propertities.push(new Property(`mutation_in`, 'MutationType', false))
        propertities.push(new Property(`updatedFields_contains`, 'String', false))
        propertities.push(new Property(`updatedFields_contains_every`, '[String!]', false))
        propertities.push(new Property(`updatedFields_contains_some`, '[String!]', false))
        propertities.push(new Property(`node`, `${this.meta.name}WhereInput`, false))
        propertities.push(new Property(`AND`, `${this.meta.name}SubscriptionWhere`, false))
        propertities.push(new Property(`OR`, `${this.meta.name}SubscriptionWhere`, false))
        propertities.push(new Property(`NOT`, `${this.meta.name}SubscriptionWhere`, false))
        this.addInput(new CodeInput(`${this.meta.name}SubscriptionWhere`, propertities));
    }

    addWhereInput() {
        const propertities: Property[] = [];
        this.meta.columns.map(column => {
            const columnTyp: string = this.transformTypeName((column.type as any).name)
            propertities.push(new Property(`${column.databaseName}`, columnTyp, false));
            propertities.push(new Property(`${column.databaseName}_not`, columnTyp, false));
            propertities.push(new Property(`${column.databaseName}_in`, `[${columnTyp}!]`, false));
            propertities.push(new Property(`${column.databaseName}_not_in`, `[${columnTyp}!]`, false));
            propertities.push(new Property(`${column.databaseName}_lt`, columnTyp, false));
            propertities.push(new Property(`${column.databaseName}_lte`, columnTyp, false));
            propertities.push(new Property(`${column.databaseName}_gt`, columnTyp, false));
            propertities.push(new Property(`${column.databaseName}_gte`, columnTyp, false));
            propertities.push(new Property(`${column.databaseName}_contains`, columnTyp, false));
            propertities.push(new Property(`${column.databaseName}_not_contains`, columnTyp, false));
            propertities.push(new Property(`${column.databaseName}_starts_with`, columnTyp, false));
            propertities.push(new Property(`${column.databaseName}_not_starts_with`, columnTyp, false));
            propertities.push(new Property(`${column.databaseName}_ends_with`, columnTyp, false));
            propertities.push(new Property(`${column.databaseName}_not_ends_with`, columnTyp, false));
        })
        this.addInput(new CodeInput(`${this.meta.name}WhereInput`, propertities));
    }

    addQuery(query: CodeQuery) {
        this.query.add(query)
    }
    getQuery() {
        return `${this.meta.name}Query`
    }
    createQuery() {
        let code = `type ${this.meta.name}Query {\n`;
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
        code += `}\n`;
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

    getMutation() {
        return `${this.meta.name}Mutation`
    }
    createMutation() {
        let code = `input ${this.meta.name}Mutation{\n`
        this.mutation.forEach(query => {
            query.propertites.map(property => {
                const { name, params, result } = property;
                code += `\t${name}`;
                const paramsMap = Object.keys(params)
                if (paramsMap.length > 0) {
                    code += `(`
                    paramsMap.map((key, index) => {
                        const type = params[key];
                        code += `${key}:${type.type}${type.required ? `!` : ``}`
                        if (index !== paramsMap.length - 1) {
                            code += `,`
                        }
                    });
                    code += `): ${result}!\n`
                } else {
                    code += `: ${result}!\n`
                }
            });
        });
        code += `}\n`;
        return code;
    }

    addSubscription(query: CodeSubscription) {
        this.subscription.add(query)
    }

    getSubscription() {
        return `${this.meta.name}Subscription`
    }
    createSubscription() {
        let code = `input ${this.meta.name}Subscription{\n`
        this.subscription.forEach(query => {
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
        code += `}\n`
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

    /**
     * save
     * remove
     * insert
     * update
     * delete
     */
    getSaveEntity() {
        return `[${this.meta.name}]`
    }
    getRemoveEntity() {
        return this.meta.name
    }
    transformMutation() {
        const propertites: PropertyMethod[] = [];
        propertites.push(new PropertyMethod('save', {
            entities: {
                type: this.getSaveEntity(),
                required: true
            },
            options: {
                type: 'SaveOptions',
                required: false
            }
        }, this.getSaveEntity()));
        propertites.push(new PropertyMethod('remove', {
            entities: {
                type: this.getRemoveEntity(),
                required: true
            },
            options: {
                type: 'RemoveOptions',
                required: false
            }
        }, this.getRemoveEntity()));
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
        propertites.push(new PropertyMethod('watch', {
            where: {
                type: `${this.meta.name}SubscriptionWhere`,
                required: true
            }
        }, `${this.meta.name}SubscriptionPayload`))
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
            this.query += `\t${meta.name}: ${code.getQuery()}\n`;
            this.type += code.createType();
            this.type += code.createQuery();
            this.type += code.createMutation();
            this.type += code.createSubscription();
            this.scalar += code.createScalar();
            this.mutation += `\t${meta.name}: ${code.getMutation()}\n`;
            this.subscription += `\t${meta.name}: ${code.getSubscription()}\n`;
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
