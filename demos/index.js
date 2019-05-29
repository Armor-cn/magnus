"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Common_1 = require("@nestjs/Common");
const magnus_1 = require("@notadd/magnus");
const typeorm_1 = __importDefault(require("./typeorm"));
const core_1 = require("@nestjs/core");
let AppModule = class AppModule {
};
AppModule = __decorate([
    Common_1.Module({
        imports: [
            magnus_1.MagnusServerModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                username: 'prisma',
                password: 'prisma',
                database: 'prisma',
                port: 5432,
                entities: typeorm_1.default,
                synchronize: true
            }, {})
        ],
        providers: []
    })
], AppModule);
exports.AppModule = AppModule;
async function bootstrap() {
    const app = await core_1.NestFactory.create(AppModule);
    return app.listen(9000, () => {
        console.log(`nest bootstrap with magnus`);
    });
}
bootstrap();
