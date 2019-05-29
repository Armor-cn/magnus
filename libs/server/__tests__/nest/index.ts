import { Module, Inject } from '@nestjs/Common'
import { HttpAdapterHost } from '@nestjs/core'
import { MagnusServerModule, MAGNUS_TYPEORM_OPTIONS, MAGNUS_CONFIG, NagnusConfig, ConnectionOptions } from '../../lib/index';
import { User, Post } from '../entities/user.entity';
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
            entities: [
                User,
                Post
            ]
        }, {})
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
