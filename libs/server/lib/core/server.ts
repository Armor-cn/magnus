import { createConnection, Connection, ConnectionOptions, ObjectType } from 'typeorm';
import { ApolloServer, gql } from 'apollo-server';
import { DocumentNode } from 'graphql';
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
            typeDefs: this.createTypeDefs(def),
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
        let options = {};
        if (this._options.entities) {
            this._options.entities.map(type => {
                if (typeof type === 'string') {
                    // path
                } else if (typeof type === 'function') {
                    options = {
                        ...options,
                        ...this.createMutationByEntity(type)
                    }
                } else {
                    // schema
                }
            })
        }
        return options;
    }
    createQuery() {
        let options = {};
        if (this._options.entities) {
            this._options.entities.map(type => {
                if (typeof type === 'string') {
                    // path
                } else if (typeof type === 'function') {
                    options = {
                        ...options,
                        ...this.createQueryByEntity(type)
                    }
                } else {
                    // schema
                }
            })
        }
        return options;
    }
    createSubscription() {
        let options = {};
        if (this._options.entities) {
            this._options.entities.map(type => {
                if (typeof type === 'string') {
                    // path
                } else if (typeof type === 'function') {
                    options = {
                        ...options,
                        ...this.createSubscriptionByEntity(type)
                    }
                } else {
                    // schema
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
            KeyValue: {
                parseValue(value: string) {
                    return JSON.parse(value);
                },
                serialize(value: any) {
                    return JSON.stringify(value)
                }
            }
        }
    }
    createTypeDefs(graphql: string): DocumentNode | Array<DocumentNode> {
        return gql`${graphql}`;
    }
}