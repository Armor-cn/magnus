import { Module, DynamicModule, Injectable } from "@nestjs/common";
import ApolloClient, { PresetConfig, gql } from "apollo-boost";

export { gql }

@Injectable()
export class MagnusClient<TCache = any> extends ApolloClient<TCache> { }

@Module({})
export class MagnusClientModule {
    static create(cfg: PresetConfig): DynamicModule {
        return {
            module: MagnusClientModule,
            providers: [{
                provide: MagnusClient,
                useFactory: () => {
                    return new MagnusClient(cfg)
                }
            }]
        }
    }
}
