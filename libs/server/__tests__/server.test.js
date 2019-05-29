"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../lib/core/server");
const entities_1 = __importDefault(require("./entities"));
async function bootstrap() {
    const server = new server_1.CoreServer({
        type: 'postgres',
        host: 'localhost',
        username: 'prisma',
        password: 'prisma',
        database: 'prisma',
        port: 5432,
        entities: entities_1.default,
        synchronize: true
    });
    await server.init();
}
bootstrap();
