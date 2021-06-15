import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { ServiceResult } from '../infrastructure/serviceResult';


@Injectable()
export class MessagesService {
    // Ctor
    constructor(
        @InjectModel('Message') private readonly messageModel: Model<Message>,
        private serviceResult: ServiceResult<Message>
    ) { }

    async findAll(): Promise<ServiceResult<Message>> {
        try {
            const messages = await this.messageModel.find();
            this.setResult(HttpStatus.OK, 'Ok', true, this.mapMessageDocumentToDto(messages))
        }
        catch (e) {
            const errorMessage = new HttpException('No Content', HttpStatus.NO_CONTENT);
            this.setResult(HttpStatus.NO_CONTENT, errorMessage.getResponse().toString(), false, null);
        }

        return this.serviceResult;
    }

    async findById(id: string): Promise<ServiceResult<Message>> {
        try {
            const message = await this.messageModel.find({ _id: id });
            this.setResult(HttpStatus.OK, 'Ok', true, this.mapMessageDocumentToDto(message));
        }
        catch (e) {
            const errorMessage = new HttpException('Not Found', HttpStatus.NOT_FOUND);
            this.setResult(HttpStatus.NOT_FOUND, errorMessage.getResponse().toString(), false, null);
        }

        return this.serviceResult;
    }

    async create(message: Message): Promise<ServiceResult<Message>> {
        const newMessage = new this.messageModel(message);
        try {
            const messageToBeCreated = await newMessage.save();
            this.setResult(HttpStatus.CREATED, 'Created', true, this.mapMessageDocumentToDto([messageToBeCreated]));
        }
        catch (e) {
            const errorMessage = new HttpException(`${e}`, HttpStatus.BAD_REQUEST);
            this.setResult(HttpStatus.BAD_REQUEST, errorMessage.getResponse().toString(), false, null);
        }
        return this.serviceResult;
    }

    async deleteById(id: string): Promise<ServiceResult<Message>> {
        await this.findById(id);
        if (!this.serviceResult.success) {
            const errorMessage = new HttpException('Not Found', HttpStatus.NOT_FOUND);
            this.setResult(HttpStatus.NOT_FOUND, errorMessage.getResponse().toString(), false, null);
            return this.serviceResult;
        }

        try {
            const messageDeleted = await this.messageModel.findByIdAndRemove(id);
            this.setResult(HttpStatus.OK, 'Ok', true, this.mapMessageDocumentToDto([messageDeleted]));
        }
        catch (e) {
            const errorMessage = new HttpException(`${e}`, HttpStatus.BAD_REQUEST);
            this.setResult(HttpStatus.BAD_REQUEST, errorMessage.getResponse().toString(), false, null);
        }

        return this.serviceResult;
    }

    async updateById(id: string, message: Message): Promise<ServiceResult<Message>> {
        await this.findById(id);
        if (!this.serviceResult.success) {
            const errorMessage = new HttpException('Not Found', HttpStatus.NOT_FOUND);
            this.setResult(HttpStatus.NOT_FOUND, errorMessage.getResponse().toString(), false, null);
            return this.serviceResult;
        }

        try {
            const updatedMessage = await this.messageModel.findByIdAndUpdate(id, message);
            this.setResult(HttpStatus.OK, 'Ok', true, this.mapMessageDocumentToDto([message]));
        }
        catch (e) {
            const errorMessage = new HttpException(`{e}`, HttpStatus.BAD_REQUEST);
            this.setResult(HttpStatus.BAD_REQUEST, errorMessage.getResponse().toString(), false, null);
        }

        return this.serviceResult;
    }

    // Helpers
    private setResult(httpStatus, message, success, data) {
        this.serviceResult.httpStatus = httpStatus;
        this.serviceResult.message = message;
        this.serviceResult.success = success;
        this.serviceResult.data = data;
    }

    private mapMessageDocumentToDto(messages: any[]) {
        const messagesDto = messages.map(
            function (message) {
                return {
                    "id": message._id,
                    "fullName": message.fullName,
                    "company": message.company,
                    "prefCommunication": message.prefCommunication,
                    "email": message.email,
                    "phoneNumber": message.phoneNumber,
                    "messageText": message.messageText
                };
            }
        );
        return messagesDto;
    }
}
