import { Module, DynamicModule, Injectable, OnModuleInit, Inject } from "@nestjs/common";
import { PresetConfig, gql } from "apollo-boost";
export { gql }
export { getConfig } from './config';
import ApolloClient from 'apollo-boost/lib/index'
export interface MagnusConfig {
    inputGolb: string;
    outputPath: string;
    apollo: PresetConfig
}
export const MAGNUS_CONFIG = `MAGNUS_CONFIG`;

@Injectable()
export class MagnusClient<TCache = any> extends ApolloClient<TCache> { }
import { bootstrap } from './tools/index';

@Module({})
export class MagnusClientModule implements OnModuleInit {
    constructor(@Inject(MAGNUS_CONFIG) private readonly config: MagnusConfig) { }
    static create(cfg: MagnusConfig): DynamicModule {
        return {
            module: MagnusClientModule,
            providers: [{
                provide: MAGNUS_CONFIG,
                useValue: cfg
            }, {
                provide: MagnusClient,
                useFactory: () => {
                    return new MagnusClient(cfg.apollo)
                }
            }]
        }
    }
    async onModuleInit() {
        await bootstrap(this.config.inputGolb, this.config.outputPath);
    }
}

export * from './tools/index';