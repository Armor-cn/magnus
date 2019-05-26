import { CoreGraphql } from '../lib/core/graphql'
import { UserEntity } from './entities/user.entity'
import { writeFileSync } from 'fs-extra'
import { join } from 'path'
export async function bootstrap() {
    const graphql = new CoreGraphql({
        type: 'postgres',
        host: 'localhost',
        username: 'postgres',
        password: 'postgres',
        database: 'test_ci',
        port: 5432,
        entities: [
            UserEntity
        ]
    });
    await graphql.init();
    return graphql.createGraphql();
}

bootstrap().then(res => {
    writeFileSync(join(__dirname, 'test.graphql'), res);
    debugger;
});
