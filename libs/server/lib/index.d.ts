import { OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConnectionOptions } from 'typeorm';
export declare const MAGNUS_TYPEORM_OPTIONS = "MAGNUS_TYPEORM_OPTIONS";
export declare const MAGNUS_CONFIG = "MAGNUS_CONFIG";
export { ConnectionOptions };
export interface NagnusConfig {
    path?: string;
    cors?: boolean;
    bodyParserConfig?: boolean;
    installSubscriptionHandlers?: boolean;
}
export declare class MagnusServerModule implements OnModuleInit {
    private readonly httpAdapterHost;
    private readonly options;
    private readonly config;
    constructor(httpAdapterHost: HttpAdapterHost, options: ConnectionOptions, config: NagnusConfig);
    static forRoot(options: ConnectionOptions, config: NagnusConfig): {
        module: typeof MagnusServerModule;
        providers: ({
            provide: string;
            useValue: ConnectionOptions;
        } | {
            provide: string;
            useValue: NagnusConfig;
        })[];
    };
    onModuleInit(): Promise<void>;
    create(httpAdapterHost: HttpAdapterHost, options: ConnectionOptions, config: NagnusConfig): Promise<void>;
}
