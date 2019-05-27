import { MagnusServer } from '../lib/index'
import { readFileSync } from 'fs-extra'
import { join } from 'path'

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
    const gpl = readFileSync(join(__dirname, 'test.graphql')).toString('utf8')
    await server.init(gpl);
    const listen = server.listen(9000);
    if (listen) listen.then(({ url }) => {
        console.log(`app start ${url}`)
    });
}
bootstrap();
