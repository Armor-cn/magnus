import { compile } from '../lib/core/compiler/compile';
import { createConnection } from 'typeorm';
import entities from './entities';
async function bootstrap() {
    const connection = await createConnection({
        type: 'postgres',
        host: 'localhost',
        username: 'prisma',
        password: 'prisma',
        database: 'prisma',
        port: 5432,
        entities: entities
    });
    const nodes = compile(connection, entities);
}

bootstrap();
