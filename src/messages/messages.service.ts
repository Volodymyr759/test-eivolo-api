import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './entities/message.entity';
import { ServiceResult } from '../infrastructure/serviceResult';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
    // Ctor
    constructor(
        @InjectModel('Message') private readonly messageModel: Model<Message>,
        private serviceResult: ServiceResult<Message>
    ) { }

    async findAll(): Promise<ServiceResult<Message>> {
        try {
            const messagesFromServer = await this.messageModel.find({}).exec();
            const messages = messagesFromServer.map((mes) => {
                let messageAsParam = mes.toObject();
                messageAsParam._id = mes.toObject()._id.toString();
                return new Message(messageAsParam);
            })
            this.serviceResult.setAsSuccess(messages);
        }
        catch (e) {
            const errorMessage = new HttpException('No Content', HttpStatus.NO_CONTENT);
            this.serviceResult.setAsFailure(errorMessage.getResponse().toString());
        }
        return this.serviceResult;
    }

    async findById(id: string): Promise<ServiceResult<Message>> {
        try {
            const messageFromServer = await this.messageModel.find({ _id: id }).exec();
            let messageAsParam = messageFromServer[0].toObject();
            messageAsParam._id = id;
            this.serviceResult.setAsSuccess([new Message(messageAsParam)]);
        }
        catch (e) {
            const errorMessage = new HttpException('Not Found', HttpStatus.NOT_FOUND);
            this.serviceResult.setAsFailure(errorMessage.getResponse().toString());
        }
        return this.serviceResult;
    }

    async create(message: CreateMessageDto): Promise<ServiceResult<Message>> {
        const newMessage = new this.messageModel({ id: '', ...message });
        try {
            const messageToBeCreated = await newMessage.save();
            let messageAsParam = messageToBeCreated.toObject();
            messageAsParam._id = messageToBeCreated.toObject()._id.toString();
            this.serviceResult.setAsSuccess([new Message(messageAsParam)]);
        }
        catch (e) {
            const errorMessage = new HttpException(`${e}`, HttpStatus.BAD_REQUEST);
            this.serviceResult.setAsFailure(errorMessage.getResponse().toString());
        }
        return this.serviceResult;
    }

    async deleteById(id: string): Promise<ServiceResult<Message>> {
        await this.findById(id);
        if (!this.serviceResult.success) {
            const errorMessage = new HttpException('Not Found', HttpStatus.NOT_FOUND);
            this.serviceResult.setAsFailure(errorMessage.getResponse().toString());
            return this.serviceResult;
        }
        try {
            const messageDeleted = await this.messageModel.findByIdAndRemove(id);
            let messageAsParam = messageDeleted.toObject();
            messageAsParam._id = id;
            this.serviceResult.setAsSuccess([new Message(messageAsParam)]);
        }
        catch (e) {
            const errorMessage = new HttpException(`${e}`, HttpStatus.BAD_REQUEST);
            this.serviceResult.setAsFailure(errorMessage.getResponse().toString());
        }
        return this.serviceResult;
    }

    async updateById(id: string, message: CreateMessageDto): Promise<ServiceResult<Message>> {
        await this.findById(id);
        if (!this.serviceResult.success) {
            const errorMessage = new HttpException('Not Found', HttpStatus.NOT_FOUND);
            this.serviceResult.setAsFailure(errorMessage.getResponse().toString());
            return this.serviceResult;
        }
        const messageToUpdate = new this.messageModel({ id: '', ...message });
        try {
            await this.messageModel.findByIdAndUpdate(id, messageToUpdate);
            this.serviceResult.setAsSuccess([new Message(messageToUpdate)]);
        }
        catch (e) {
            const errorMessage = new HttpException(`{e}`, HttpStatus.BAD_REQUEST);
            this.serviceResult.setAsFailure(errorMessage.getResponse().toString());
        }
        return this.serviceResult;
    }
}
