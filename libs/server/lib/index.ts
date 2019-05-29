import { Module, HttpAdapterHost, Inject } from '@nestjs/common'
import { CoreServer } from './core/server'
import { ConnectionOptions } from 'typeorm';
export const MAGNUS_TYPEORM_OPTIONS = 'MAGNUS_TYPEORM_OPTIONS';
export const MAGNUS_CONFIG = 'MAGNUS_CONFIG';
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
export class MagnusServerModule {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        @Inject(MAGNUS_TYPEORM_OPTIONS) private readonly options: ConnectionOptions,
        @Inject(MAGNUS_CONFIG) private readonly config: NagnusConfig,
    ) { }

    static forRoot(options: ConnectionOptions, config: NagnusConfig) {
        return {
            module: MagnusServerModule,
            providers: [
                {
                    provide: MAGNUS_TYPEORM_OPTIONS,
                    useValue: options,
                },
                {
                    provide: MAGNUS_CONFIG,
                    useValue: config,
                },
            ]
        }
    }

    async onModuleInit() {
        if (!this.httpAdapterHost) {
            return;
        }
        const httpAdapter = this.httpAdapterHost.httpAdapter;
        if (!httpAdapter) {
            return;
        }
        const app = httpAdapter.getInstance();
        const server = new CoreServer(this.options);
        const apolloServer = await server.init();
        (apolloServer.applyMiddleware as any)({
            app,
            path: this.config.path ? this.config.path : `/`,
            cors: !!this.config.cors,
            bodyParserConfig: this.config.bodyParserConfig
        });
        if (!!this.config.installSubscriptionHandlers) {
            apolloServer.installSubscriptionHandlers(
                httpAdapter.getHttpServer(),
            );
        }
    }
}
