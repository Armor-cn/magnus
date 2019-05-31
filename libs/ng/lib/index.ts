import { NgModule, ModuleWithProviders, Injectable } from "@angular/core";
import ApolloClient, { PresetConfig, gql } from "apollo-boost";
export { gql }
@Injectable()
export class MagnusNg<TCache = any> extends ApolloClient<TCache> { }
@NgModule({})
export class MagnusNgModule {
    static create(cfg: PresetConfig): ModuleWithProviders {
        return {
            ngModule: MagnusNgModule,
            providers: [{
                provide: MagnusNg,
                useFactory: () => {
                    return new MagnusNg(cfg)
                },
                deps: []
            }]
        }
    }
}
