"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var MagnusServerModule_1;
"use strict";
const common_1 = require("@nestjs/common");
const server_1 = require("./core/server");
exports.MAGNUS_TYPEORM_OPTIONS = 'MAGNUS_TYPEORM_OPTIONS';
exports.MAGNUS_CONFIG = 'MAGNUS_CONFIG';
let MagnusServerModule = MagnusServerModule_1 = class MagnusServerModule {
    constructor(httpAdapterHost, options, config) {
        this.httpAdapterHost = httpAdapterHost;
        this.options = options;
        this.config = config;
    }
    static forRoot(options) {
        return {
            module: MagnusServerModule_1,
            providers: [
                {
                    provide: exports.MAGNUS_TYPEORM_OPTIONS,
                    useValue: options,
                }
            ]
        };
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
        const server = new server_1.CoreServer(this.options);
        const apolloServer = await server.init();
        apolloServer.applyMiddleware({
            app,
            path: this.config.path ? this.config.path : `/`,
            cors: !!this.config.cors,
            bodyParserConfig: this.config.bodyParserConfig
        });
        if (!!this.config.installSubscriptionHandlers) {
            apolloServer.installSubscriptionHandlers(httpAdapter.getHttpServer());
        }
    }
};
MagnusServerModule = MagnusServerModule_1 = __decorate([
    common_1.Module({
        providers: [],
        exports: []
    }),
    __param(1, common_1.Inject(exports.MAGNUS_TYPEORM_OPTIONS)),
    __param(2, common_1.Inject(exports.MAGNUS_CONFIG)),
    __metadata("design:paramtypes", [Object, Object, Object])
], MagnusServerModule);
exports.MagnusServerModule = MagnusServerModule;
