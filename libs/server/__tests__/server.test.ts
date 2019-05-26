import { MagnusServer } from '../lib/index'
async function bootstrap() {
    const server = new MagnusServer({
        type: 'postgres',
        host: 'localhost',
        username: 'postgres',
        password: 'postgres',
        database: 'test_ci',
        port: 5432,
        entities: []
    });
    await server.init();
    const listen = server.listen(9000);
    if (listen) listen.then(({ url }) => {
        console.log(`app start ${url}`)
    })
}

bootstrap();