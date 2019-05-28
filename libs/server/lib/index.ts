import { Module } from '@nestjs/common'
import { ApolloServer } from 'apollo-server'
@Module({
    providers: [],
    exports: []
})
export class MagnusServerModule {
    protected apolloServer: ApolloServer;
    constructor() { }
}
