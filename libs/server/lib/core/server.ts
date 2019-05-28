import { createConnection, Connection, ConnectionOptions, ObjectType } from 'typeorm';
import { ApolloServer, gql } from 'apollo-server';
import { DocumentNode, GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { compile } from './compiler/compile'
import { IResolvers } from 'graphql-tools';
export abstract class CoreServer {

    constructor(
        protected _options: ConnectionOptions,
        protected _connection?: Connection,
        protected _server?: ApolloServer
    ) { }

    async init(def: string) {
        this._connection = await createConnection(this._options);
        this._server = new ApolloServer({
            typeDefs: compile(this._connection),
            resolvers: {
                ...this.createResolvers()
            },
            playground: true,
        });
    }
    
    listen(port: number) {
        if (this._server) {
            return this._server.listen(port)
        }
    }

    createMutation() {
        const options: any = {};
        if (this._connection) {
            const metadatas = this._connection.entityMetadatas;
            metadatas.map(meta => {
                if (typeof meta.target === 'function') {
                    options[`${meta.name}`] = this.createMutationByEntity(meta.target)
                }
            })
        }
        return options;
    }
    createQuery() {
        const options: any = {};
        if (this._connection) {
            const metadatas = this._connection.entityMetadatas;
            metadatas.map(meta => {
                if (typeof meta.target === 'function') {
                    options[`${meta.name}`] = this.createQueryByEntity(meta.target)
                }
            })
        }
        return options;
    }
    createSubscription() {
        const options: any = {};
        if (this._connection) {
            const metadatas = this._connection.entityMetadatas;
            metadatas.map(meta => {
                if (typeof meta.target === 'function') {
                    options[`${meta.name}`] = this.createSubscriptionByEntity(meta.target)
                }
            })
        }
        return options;
    }
    abstract createMutationByEntity(entity: ObjectType<any>): object | undefined;
    abstract createQueryByEntity(entity: ObjectType<any>): object | undefined;
    abstract createSubscriptionByEntity(entity: ObjectType<any>): object | undefined;
    createResolvers(): IResolvers {
        return {
            Query: this.createQuery(),
            Mutation: this.createMutation(),
            KeyString: new GraphQLScalarType({
                name: 'KeyString',
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
    createTypeDefs(graphql: string): DocumentNode | Array<DocumentNode> {
        return gql`${graphql}`;
    }
}