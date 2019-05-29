import { Connection, ConnectionOptions } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { IResolvers } from 'graphql-tools';
import { Resolver } from './compiler/resolver';
export declare class CoreServer {
    protected _options: ConnectionOptions;
    protected _connection?: Connection | undefined;
    protected _server?: ApolloServer | undefined;
    resolver: Resolver<any>[];
    constructor(_options: ConnectionOptions, _connection?: Connection | undefined, _server?: ApolloServer | undefined);
    init(): Promise<ApolloServer>;
    createMutation(): any;
    createQuery(): any;
    createSubscription(): any;
    createResolvers(): IResolvers;
}
