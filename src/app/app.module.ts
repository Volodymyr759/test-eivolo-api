import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { MessagesModule } from '../messages/messages.module';
import { getMongoConfig } from '../infrastructure/configs/mongo.config';
<<<<<<< HEAD
=======
import { FilesModule } from 'src/files/files.module';
>>>>>>> c37648c52bc8271640c73c7b0045a87f05803f5c

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
<<<<<<< HEAD
=======
        FilesModule,
>>>>>>> c37648c52bc8271640c73c7b0045a87f05803f5c
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule { }
