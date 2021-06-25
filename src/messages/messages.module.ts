import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { ServiceResult } from '../infrastructure/serviceResult';
import { TypegooseModule } from 'nestjs-typegoose';
import { MessageModel } from './message.model';

@Module({
    imports: [
        TypegooseModule.forFeature([
          {
            typegooseClass: MessageModel,
            schemaOptions: { collection: 'messages' },
          },
        ]),
      ],
    controllers: [MessagesController],
    providers: [MessagesService, ServiceResult],
})
export class MessagesModule {}
