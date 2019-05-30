import { Module } from '@nestjs/common'
import { MagnusServerModule } from '../../lib/index';
import entities from '../entities';
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
