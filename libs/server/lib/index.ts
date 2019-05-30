import { Module, Inject, OnModuleInit } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { CoreServer } from './core/server'
import { ConnectionOptions } from 'typeorm';
export const MAGNUS_TYPEORM_OPTIONS = 'MAGNUS_TYPEORM_OPTIONS';
export const MAGNUS_CONFIG = 'MAGNUS_CONFIG';
export { ConnectionOptions }
export interface NagnusConfig {
    path?: string;
    cors?: boolean;
    bodyParserConfig?: boolean;
    installSubscriptionHandlers?: boolean;
}
@Module({
    providers: [],
    exports: []
})
export class MagnusServerModule implements OnModuleInit {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        @Inject(MAGNUS_TYPEORM_OPTIONS) private readonly options: ConnectionOptions,
        @Inject(MAGNUS_CONFIG) private readonly config: NagnusConfig
    ) { }
    static forRoot(options: ConnectionOptions, config: NagnusConfig = {}) {
        return {
            module: MagnusServerModule,
            providers: [
                {
                    provide: MAGNUS_TYPEORM_OPTIONS,
                    useValue: options,
                },
                {
                    provide: MAGNUS_CONFIG,
                    useValue: config
                }
            ]
        }
    }
    async onModuleInit() {
        await this.create(this.httpAdapterHost, this.options, this.config)
    }
    async create(httpAdapterHost: HttpAdapterHost, options: ConnectionOptions, config: NagnusConfig) {
        if (!httpAdapterHost) {
            return;
        }
        const httpAdapter = httpAdapterHost.httpAdapter;
        if (!httpAdapter) {
            return;
        }
        const app = httpAdapter.getInstance();
        const server = new CoreServer(options);
        const apolloServer = await server.init();
        (apolloServer.applyMiddleware as any)({
            app,
            path: config.path ? config.path : `/`,
            cors: !!config.cors,
            bodyParserConfig: config.bodyParserConfig
        });
        if (!!config.installSubscriptionHandlers) {
            apolloServer.installSubscriptionHandlers(
                httpAdapter.getHttpServer(),
            );
        }
        return;
    }
}
