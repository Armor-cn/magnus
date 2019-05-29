"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compile_1 = require("../lib/core/compiler/compile");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
async function bootstrap() {
    const connection = await typeorm_1.createConnection({
        type: 'postgres',
        host: 'localhost',
        username: 'prisma',
        password: 'prisma',
        database: 'prisma',
        port: 5432,
        entities: [
            user_entity_1.User,
            user_entity_1.Post
        ]
    });
    const nodes = compile_1.compile(connection);
    debugger;
}
bootstrap();
