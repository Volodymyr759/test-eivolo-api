import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesController } from './messages/messages.controller';
import { MessagesModule } from './messages/messages.module';
import { MessagesService } from './messages/messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config/keys';

@Module({
    imports: [MessagesModule, MongooseModule.forRoot(config.mongoUri)],
    controllers: [AppController, MessagesController],
    providers: [AppService, MessagesService],
})
export class AppModule { }
