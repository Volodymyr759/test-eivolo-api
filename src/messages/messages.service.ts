import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageModel } from './message.model';
import { ServiceResult } from '../infrastructure/serviceResult';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel('MessageModel') private readonly messageModel: Model<MessageModel>,
        private serviceResult: ServiceResult<MessageModel> ) { }

    async findAll(): Promise<ServiceResult<MessageModel>> {
        try {
            const messagesFromServer = await this.messageModel.find({}).exec();
            this.serviceResult.setAsSuccess(messagesFromServer);
        } catch (e) {
            const errorMessage = new HttpException('No Content', HttpStatus.NO_CONTENT);
            this.serviceResult.setAsFailure(errorMessage.getResponse().toString());
        }
        return this.serviceResult;
    }

    async findById(id: string): Promise<ServiceResult<MessageModel>> {
        try {
            const messageFromServer = await this.messageModel.find({ _id: id }).exec();
            this.serviceResult.setAsSuccess(messageFromServer);
        } catch (e) {
            const errorMessage = new HttpException('Not Found', HttpStatus.NOT_FOUND);
            this.serviceResult.setAsFailure(errorMessage.getResponse().toString());
        }
        return this.serviceResult;
    }

    async create(message: CreateMessageDto): Promise<ServiceResult<MessageModel>> {
        const newMessage = new this.messageModel({ id: '', ...message });
        try {
            const messageToBeCreated = await newMessage.save();
            this.serviceResult.setAsSuccess([messageToBeCreated]);
        } catch (e) {
            const errorMessage = new HttpException(`${e}`, HttpStatus.BAD_REQUEST);
            this.serviceResult.setAsFailure(errorMessage.getResponse().toString());
        }
        return this.serviceResult;
    }

    async deleteById(id: string): Promise<ServiceResult<MessageModel>> {
        await this.findById(id);
        if (!this.serviceResult.success) {
            const errorMessage = new HttpException('Not Found', HttpStatus.NOT_FOUND);
            this.serviceResult.setAsFailure(errorMessage.getResponse().toString());
            return this.serviceResult;
        }
        try {
            const messageDeleted = await this.messageModel.findByIdAndRemove(id);
            this.serviceResult.setAsSuccess([messageDeleted]);
        } catch (e) {
            const errorMessage = new HttpException(`${e}`, HttpStatus.BAD_REQUEST);
            this.serviceResult.setAsFailure(errorMessage.getResponse().toString());
        }
        return this.serviceResult;
    }

    async updateById(id: string, message: CreateMessageDto): Promise<ServiceResult<MessageModel>> {
        await this.findById(id);
        if (!this.serviceResult.success) {
            const errorMessage = new HttpException('Not Found', HttpStatus.NOT_FOUND);
            this.serviceResult.setAsFailure(errorMessage.getResponse().toString());
            return this.serviceResult;
        }
        const messageToUpdate = new this.messageModel({ id: '', ...message });
        try {
            const messageUpdated = await this.messageModel.findByIdAndUpdate(id, messageToUpdate);
            this.serviceResult.setAsSuccess([messageUpdated]);
        } catch (e) {
            const errorMessage = new HttpException(`${e}`, HttpStatus.BAD_REQUEST);
            this.serviceResult.setAsFailure(errorMessage.getResponse().toString());
        }
        return this.serviceResult;
    }
}
