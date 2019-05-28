"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../lib/core/server");
const user_entity_1 = require("./entities/user.entity");
async function bootstrap() {
    const server = new server_1.CoreServer({
        type: 'postgres',
        host: 'localhost',
        username: 'prisma',
        password: 'prisma',
        database: 'prisma',
        port: 5432,
        entities: [
            user_entity_1.User
        ],
        synchronize: true
    });
    await server.init();
    const listen = server.listen(9000);
    if (listen)
        listen.then(({ url }) => {
            console.log(`app start ${url}`);
        });
}
bootstrap();
