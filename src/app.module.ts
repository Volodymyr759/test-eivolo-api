import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsController } from './items/items.controller';
import { ItemsService } from './items/items.service';
import { ItemsModule } from './items/items.module';
import { MessagesController } from './messages/messages.controller';
import { MessagesModule } from './messages/messages.module';
import { MessagesService } from './messages/messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config/keys';

@Module({
    imports: [ItemsModule, MessagesModule, MongooseModule.forRoot(config.mongoUri)],
    controllers: [AppController, ItemsController, MessagesController],
    providers: [AppService, ItemsService, MessagesService],
})
export class AppModule {}
