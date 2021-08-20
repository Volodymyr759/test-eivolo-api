import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';
import { MessageModel } from './message.model';
import { CreateMessageDto } from './dto/create-message.dto';
import { NOT_FOUND_ERROR } from '../infrastructure/constants';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(MessageModel) private readonly messageModel: ModelType<MessageModel>) { }

    async findAll(): Promise<MessageModel[]> {
        return await this.messageModel.find({}).exec();
    }

    async findById(id: string) {
        return await this.messageModel.findOne({ _id: id }).exec();
    }

    async create(message: CreateMessageDto) {
        const newMessage = new this.messageModel({ id: '', ...message });
        return await newMessage.save();
    }

    async deleteById(id: string) {
        const messageToDelete = await this.findById(id);
        if (!messageToDelete) {
            throw new NotFoundException(NOT_FOUND_ERROR);
        }
        return await this.messageModel.findByIdAndRemove(id);
    }

    async updateById(id: string, message: CreateMessageDto) {
        const messageFromDb = await this.findById(id);
        if (!messageFromDb) {
            throw new NotFoundException(NOT_FOUND_ERROR);
        }
        const messageToUpdate = new this.messageModel({ id: '', ...message });
        await this.messageModel.findByIdAndUpdate(id, messageToUpdate);
        return await this.findById(id);
    }
}
