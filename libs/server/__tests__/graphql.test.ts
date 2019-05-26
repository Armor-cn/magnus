import { CoreGraphql } from '../lib/core/graphql'
import { UserEntity } from './entities/user.entity'
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
    console.log(res)
    debugger;
})