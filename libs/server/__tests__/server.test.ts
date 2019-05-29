import { CoreServer } from '../lib/core/server'
import entities from './entities';

async function bootstrap() {
    const server = new CoreServer({
        type: 'postgres',
        host: 'localhost',
        username: 'prisma',
        password: 'prisma',
        database: 'prisma',
        port: 5432,
        entities: entities,
        synchronize: true
    });
    await server.init();
}
bootstrap();
