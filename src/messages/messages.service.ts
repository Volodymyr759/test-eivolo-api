import { Injectable } from '@nestjs/common';
import { Message } from './interfaces/message.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MessagesService {
    constructor(@InjectModel('Message') private readonly messageModel: Model<Message>) {}

    async findAll(): Promise<Message[]> {
        return await this.messageModel.find();
  }

    async findOne(id: string): Promise<Message> {
        return await this.messageModel.findOne({ _id: id });
  }

    async create(message: Message): Promise<Message> {
        const newMessage = new this.messageModel(message);
        return await newMessage.save();
  }

    async delete(id: string): Promise<Message> {
        return await this.messageModel.findByIdAndRemove(id);
  }

    async update(id: string, message: Message): Promise<Message> {
        return await this.messageModel.findByIdAndUpdate(id, message, { new: true });
  }
}
