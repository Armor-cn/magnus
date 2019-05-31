## Client 客户端


### 安装
```
yarn add @notadd/magnus-client
```

### 使用

```ts
import { MagnusClientModule } from '@notadd/magnus-client'
import { MagnusClientModule as NotaddMagnusClient } from '@notadd/magnus-client';
import { Module, DynamicModule } from '@nestjs/common';
import { join } from 'path';
@Module({
    imports: [
         NotaddMagnusClient.create({
             // 扫描文件根据Controller/Resolver等自动生成graphql和proto配置文件
            inputGolb: join(__dirname, '**/*.ts'),
            // 生成的配置文件保存目录
            outputPath: __dirname,
            apollo: {
                uri: uri,
                fetch: require('node-fetch')
            }
        })
    ]
})
export class AppModule {}

@Injectable()
export class Demo{
    constructor(public client: MagnusClient){}

    getData(){
        return this.client.query({
            ...
        })
    }
}
```