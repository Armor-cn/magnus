import { createConnection, Connection, ConnectionOptions, EntityMetadata } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { compile } from './compiler/compile'
import { IResolvers } from 'graphql-tools';
import { Resolver } from './compiler/resolver'
import { lowerFirst, upperFirst } from 'lodash';

export class CoreServer {
    resolver: Resolver<any>[] = [];
    constructor(
        protected _options: ConnectionOptions,
        protected _connection?: Connection,
        protected _server?: ApolloServer
    ) { }

    async init(): Promise<ApolloServer> {
        this._connection = await createConnection(this._options);
        const entities = this._options.entities || [];
        entities.map(entity => {
            if (this._connection) {
                const meta: EntityMetadata = this._connection.getMetadata(entity);
                const res = this._connection.getRepository(meta.target)
                this.resolver.push(new Resolver(res, meta, this._connection))
            }
        });
        const resolvers = this.createResolvers();
        const config = {
            typeDefs: compile(this._connection, this._options.entities as any),
            resolvers,
            playground: true,
        };
        this._server = new ApolloServer(config);
        return this._server;
    }

    createMutation() {
        const options: any = {};
        this.resolver.map(res => {
            const mutation: any = res.getMutation();
            options[`${res.meta.name}`] = () => mutation;
            Object.keys(mutation).map(key => {
                options[`${lowerFirst(res.meta.name)}${upperFirst(key)}`] = mutation[`${key}`];
            });
        });
        return options;
    }
    createQuery() {
        const options: any = {};
        this.resolver.map(res => {
            const query: any = res.getQuery();
            options[`${res.meta.name}`] = query;
            Object.keys(query).map(key => {
                options[`${lowerFirst(res.meta.name)}${upperFirst(key)}`] = query[`${key}`];
            });
        });
        return options;
    }
    createSubscription() {
        const options: any = {};
        this.resolver.map(res => {
            const query: any = res.getSubscribtion();
            options[`${res.meta.name}`] = () => query;
            Object.keys(query).map(key => {
                options[`${lowerFirst(res.meta.name)}${upperFirst(key)}`] = query[`${key}`];
            });
        });
        return options;
    }
    createResolvers(): IResolvers {
        return {
            Query: this.createQuery(),
            Mutation: this.createMutation(),
            Subscription: this.createSubscription(),
            ObjectLiteral: new GraphQLScalarType({
                name: 'ObjectLiteral',
                parseValue(value: string) {
                    return JSON.parse(value);
                },
                serialize(value: any) {
                    return JSON.stringify(value)
                },
                parseLiteral(ast) {
                    if (ast.kind === Kind.STRING) {
                        return JSON.parse(ast.value);
                    }
                    return null;
                }
            }),
            Date: new GraphQLScalarType({
                name: 'Date',
                parseValue(value: string) {
                    return new Date(value);
                },
                serialize(value: Date) {
                    return value.getTime()
                },
                parseLiteral(ast) {
                    if (ast.kind === Kind.STRING) {
                        return new Date(ast.value);
                    }
                    return null;
                }
            })
        }
    }
}