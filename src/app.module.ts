import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config/keys';

@Module({
    imports: [MessagesModule, MongooseModule.forRoot(config.mongoUri)],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
