import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageModel } from './message.model';
import { ServiceResult } from '../infrastructure/serviceResult';
import { CreateMessageDto } from './dto/create-message.dto';
import { MESSAGE_NOT_FOUND_ERROR } from './message.constants';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel('MessageModel') private readonly messageModel: Model<MessageModel>,
        private serviceResult: ServiceResult<MessageModel>) { }

    async findAll(): Promise<MessageModel[]> {
        return await this.messageModel.find({}).exec();
    }

    async findById(id: string): Promise<MessageModel> {
        return await this.messageModel.findOne({ _id: id }).exec();
    }

    async create(message: CreateMessageDto): Promise<MessageModel> {
        const newMessage = new this.messageModel({ id: '', ...message });
        return await newMessage.save();
    }

    async deleteById(id: string): Promise<MessageModel> {
        const messageToDelete = await this.findById(id);
        if (!messageToDelete) {
            throw new NotFoundException(MESSAGE_NOT_FOUND_ERROR);
        }
        return await this.messageModel.findByIdAndRemove(id);
    }

    async updateById(id: string, message: CreateMessageDto): Promise<MessageModel> {
        const messageFromDb = await this.findById(id);
        if (!messageFromDb) {
            throw new NotFoundException(MESSAGE_NOT_FOUND_ERROR);
        }
        const messageToUpdate = new this.messageModel({ id: '', ...message });
        return await this.messageModel.findByIdAndUpdate(id, messageToUpdate);
    }
}
