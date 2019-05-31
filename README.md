# magnus

> dota 半人猛犸，干掉 prisma 中的反人类设计

<div style="background-color: #fff;text-align:center;">
<img src="./flow.svg">
</div>


### 使用方式：

```
import { Module } from '@nestjs/Common'
import { MagnusServerModule } from '@notadd/magnus';
import entities from './typeorm';
import { NestFactory } from '@nestjs/core';
@Module({
    imports: [
        MagnusServerModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            username: 'prisma',
            password: 'prisma',
            database: 'prisma',
            port: 5432,
            entities: entities,
            synchronize: true
        })
    ],
    providers: []
})
export class AppModule { }
async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    return app.listen(9000, () => {
        console.log(`nest bootstrap with magnus`)
    });
}
bootstrap();
```


DEMO： https://github.com/notadd/magnus/tree/master/demos/server
