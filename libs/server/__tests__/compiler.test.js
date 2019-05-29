"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compile_1 = require("../lib/core/compiler/compile");
const typeorm_1 = require("typeorm");
const entities_1 = __importDefault(require("./entities"));
async function bootstrap() {
    const connection = await typeorm_1.createConnection({
        type: 'postgres',
        host: 'localhost',
        username: 'prisma',
        password: 'prisma',
        database: 'prisma',
        port: 5432,
        entities: entities_1.default
    });
    const nodes = compile_1.compile(connection, entities_1.default);
}
bootstrap();
