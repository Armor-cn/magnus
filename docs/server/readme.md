## Server 服务端

### 安装
```
yarn add @notadd/magnus
```

### 使用

```ts
import { MagnusServerModule } from '@notadd/magnus'
@Module({
    imports: [
        MagnusServerModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            username: 'prisma',
            password: 'prisma',
            database: 'prisma',
            port: 5432,
            entities: entities, // 根据entities自动生成相应graphql接口
            synchronize: true
        })
    ],
    providers: []
})
export class AppModule { }
```