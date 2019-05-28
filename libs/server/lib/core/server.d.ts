import { Connection, ConnectionOptions } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import { IResolvers } from 'graphql-tools';
import { Resolver } from './compiler/resolver';
export declare class CoreServer {
    protected _options: ConnectionOptions;
    protected _connection?: Connection | undefined;
    protected _server?: ApolloServer | undefined;
    resolver: Resolver<any>[];
    constructor(_options: ConnectionOptions, _connection?: Connection | undefined, _server?: ApolloServer | undefined);
    init(): Promise<ApolloServer>;
    listen(port: number): Promise<import("apollo-server").ServerInfo> | undefined;
    createMutation(): any;
    createQuery(): any;
    createSubscription(): any;
    createResolvers(): IResolvers;
}
