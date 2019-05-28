import { createConnection, Connection, ConnectionOptions, ObjectType } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { compile } from './compiler/compile'
import { IResolvers } from 'graphql-tools';
import { Resolver } from './compiler/resolver'
export class CoreServer {
    resolver: Resolver<any>[] = [];
    constructor(
        protected _options: ConnectionOptions,
        protected _connection?: Connection,
        protected _server?: ApolloServer
    ) { }

    async init(): Promise<ApolloServer> {
        this._connection = await createConnection(this._options);
        const metadatas = this._connection.entityMetadatas;
        metadatas.map(meta => {
            if (this._connection) {
                const res = this._connection.getRepository(meta.target)
                this.resolver.push(new Resolver(res, meta.name))
            }
        });
        const config = {
            typeDefs: compile(this._connection),
            resolvers: {
                ...this.createResolvers()
            },
            playground: true,
        };
        this._server = new ApolloServer(config);
        return this._server;
    }

    listen(port: number) {
        if (this._server) {
            return this._server.listen(port)
        }
    }

    createMutation() {
        const options: any = {};
        this.resolver.map(res => {
            options[`${res.name}`] = (...args: any[]) => {
                return res.getMutation()
            }
        });
        return options;
    }
    createQuery() {
        const options: any = {};
        this.resolver.map(res => {
            options[`${res.name}`] = () => res.getQuery()
        });
        return options;
    }
    createSubscription() {
        const options: any = {};
        this.resolver.map(res => {
            options[`${res.name}`] = () => res.getSubscribtion()
        });
        return options;
    }
    createResolvers(): IResolvers {
        return {
            Query: this.createQuery(),
            Mutation: this.createMutation(),
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