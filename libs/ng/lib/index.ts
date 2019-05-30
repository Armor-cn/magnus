import { NgModule, ModuleWithProviders, Injectable } from "@angular/core";
import ApolloClient, { PresetConfig, gql } from "apollo-boost";
export { gql }
@Injectable()
export class MagnusClient<TCache = any> extends ApolloClient<TCache> { }
@NgModule({})
export class MagnusClientModule {
    static create(cfg: PresetConfig): ModuleWithProviders {
        return {
            ngModule: MagnusClientModule,
            providers: [{
                provide: MagnusClient,
                useFactory: () => {
                    return new MagnusClient(cfg)
                },
                deps: []
            }]
        }
    }
}
