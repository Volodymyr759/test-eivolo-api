import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { MessagesModule } from '../messages/messages.module';
import { getMongoConfig } from '../infrastructure/configs/mongo.config';
import { FilesModule } from 'src/files/files.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MessagesModule,
        TypegooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getMongoConfig,
        }),
        AuthModule,
        FilesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule { }
