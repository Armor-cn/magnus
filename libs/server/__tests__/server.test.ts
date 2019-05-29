import { CoreServer } from '../lib/core/server'
import { User, Post } from './entities/user.entity'
async function bootstrap() {
    const server = new CoreServer({
        type: 'postgres',
        host: 'localhost',
        username: 'prisma',
        password: 'prisma',
        database: 'prisma',
        port: 5432,
        entities: [
            User,
            Post
        ],
        synchronize: true
    });
    await server.init();
    const listen = server.listen(9000);
    if (listen) listen.then(({ url }) => {
        console.log(`app start ${url}`)
    });
}
bootstrap();
