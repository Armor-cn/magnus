import { CoreGraphql } from '../lib/core/graphql'
import { User } from './entities/user.entity'
import { writeFileSync } from 'fs-extra'
import { join } from 'path'
export async function bootstrap() {
    const graphql = new CoreGraphql({
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
    await graphql.init();
    return graphql.createGraphql();
}

bootstrap().then(res => {
    writeFileSync(join(__dirname, 'test.graphql'), res);
    debugger;
});
