import { compile } from '../lib/core/compiler/compile';
import { createConnection } from 'typeorm';
import { User } from './entities/user.entity';
async function bootstrap() {
    const connection = await createConnection({
        type: 'postgres',
        host: 'localhost',
        username: 'prisma',
        password: 'prisma',
        database: 'prisma',
        port: 5432,
        entities: [
            User
        ]
    });
    const nodes = compile(connection);
    debugger;
}

bootstrap();
