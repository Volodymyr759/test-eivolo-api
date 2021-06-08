import { Injectable } from '@nestjs/common';
import { Message } from './interfaces/message.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common'
import { ServiceResult } from '../infrastructure/ServiceResult';
//import { resolveAny } from 'dns';

@Injectable()
export class MessagesService {
    // Private members
    private serviceResult = new ServiceResult<Message>(null, '', false, null);

    // Ctor
    constructor(@InjectModel('Message') private readonly messageModel: Model<Message>) { }

    async findAll(): Promise<ServiceResult<Message>> {
        await this.messageModel.find()
            .then(
                result => { this.setResult(HttpStatus.OK, 'Ok', true, result); }
            )
            .catch(
                () => {
                    const errorMessage = new HttpException('No Content', HttpStatus.NO_CONTENT);
                    this.setResult(HttpStatus.NO_CONTENT, errorMessage.getResponse().toString(), false, null);
                }
            );

        return this.serviceResult;
    }

    async findById(id: string): Promise<ServiceResult<Message>> {
        await this.messageModel.find({ _id: id })
            .then(
                result => { this.setResult(HttpStatus.OK, 'Ok', true, result); }
            )
            .catch(
                () => {
                    const errorMessage = new HttpException('Not Found', HttpStatus.NOT_FOUND);
                    this.setResult(HttpStatus.NOT_FOUND, errorMessage.getResponse().toString(), false, null);
                }
            );

        return this.serviceResult;
    }

    async createById(message: Message): Promise<ServiceResult<Message>> {
        const newMessage = new this.messageModel(message);
        await newMessage.save()
            .then(
                result => {
                    let data = [{ result }]
                    this.setResult(HttpStatus.CREATED, 'Created', true, data);
                }
            )
            .catch(
                result => {
                    const errorMessage = new HttpException(`${result}`, HttpStatus.BAD_REQUEST);
                    this.setResult(HttpStatus.BAD_REQUEST, errorMessage.getResponse().toString(), false, null);
                }
            );

        return this.serviceResult;
    }

    async deleteById(id: string): Promise<ServiceResult<Message>> {
        await this.messageModel.find({ _id: id })
            .catch(
                () => {
                    const errorMessage = new HttpException('Not Found', HttpStatus.NOT_FOUND);
                    this.setResult(HttpStatus.NOT_FOUND, errorMessage.getResponse().toString(), false, null);
                }
            );

        await this.messageModel.findByIdAndRemove(id)
            .then(
                result => {
                    let data = [{ result }]
                    this.setResult(HttpStatus.OK, 'Ok', true, data);
                }
            );

        return this.serviceResult;
    }

    async updateById(id: string, message: Message): Promise<ServiceResult<Message>> {
        await this.messageModel.find({ _id: id })
            .catch(
                () => {
                    const errorMessage = new HttpException('Not Found', HttpStatus.NOT_FOUND);
                    this.setResult(HttpStatus.NOT_FOUND, errorMessage.getResponse().toString(), false, null);
                }
            );

        await this.messageModel.findOneAndReplace({ _id: id }, message, { new: true })
            .then(
                result => {
                    let data = [{ result }]
                    this.setResult(HttpStatus.OK, 'Ok', true, data);
                }
            )
            .catch(
                result => {
                    const errorMessage = new HttpException(`${result}`, HttpStatus.BAD_REQUEST);
                    this.setResult(HttpStatus.BAD_REQUEST, errorMessage.getResponse().toString(), false, null);
                }
            );

        return this.serviceResult;
    }

    // Helpers
    private setResult(httpStatus, message, success, data) {
        this.serviceResult.httpStatus = httpStatus;
        this.serviceResult.message = message;
        this.serviceResult.success = success;
        this.serviceResult.data = data;
    }
}
