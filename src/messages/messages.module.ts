import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessageSchema } from './schemas/message.schema';
import { ServiceResult } from './ServiceResult';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }])],
    controllers: [MessagesController],
    providers: [MessagesService, ServiceResult],
})
export class MessagesModule {}
