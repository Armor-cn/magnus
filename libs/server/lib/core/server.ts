import { createConnection, Connection, ConnectionOptions } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import { DocumentNode } from 'graphql';
import { IResolvers } from 'graphql-tools';
export abstract class CoreServer {
    constructor(
        protected _options: ConnectionOptions,
        protected _connection?: Connection,
        protected _server?: ApolloServer
    ) { }

    async init() {
        this._connection = await createConnection(this._options);
        this._server = new ApolloServer({
            typeDefs: this.createTypeDefs(),
            resolvers: this.createResolvers(),
            playground: true
        });
    }
    listen(port: number) {
        if (this._server) {
            return this._server.listen(port)
        }
    }
    abstract createResolvers(): IResolvers;
    abstract createTypeDefs(): DocumentNode | Array<DocumentNode>;
}