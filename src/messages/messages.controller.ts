import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';
import { MessageModel } from './message.model';
import { ServiceResult } from '../infrastructure/serviceResult';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Get()
    @ApiOperation({ summary: 'Get all messages' })
    findAll(): Promise<ServiceResult<MessageModel>> {
        return this.messagesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get message by id' })
    findById(@Param('id') id: string): Promise<ServiceResult<MessageModel>> {
        if (String(id).trim().length === 0) {
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        }
        return this.messagesService.findById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create message' })
    create(@Body() createMessageDto: CreateMessageDto): Promise<ServiceResult<MessageModel>> {
        return this.messagesService.create(createMessageDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete message by id' })
    deleteById(@Param('id') id: string): Promise<ServiceResult<MessageModel>> {
        if (String(id).trim().length === 0) {
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        }
        return this.messagesService.deleteById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Replace old message by new instance, using id' })
    updateById(@Param('id') id: string, @Body() updateMessageDto: CreateMessageDto): Promise<ServiceResult<MessageModel>> {
        if (String(id).trim().length === 0) {
            throw new HttpException(`Bad Request`, HttpStatus.BAD_REQUEST);
        }
        return this.messagesService.updateById(id, updateMessageDto);
    }
}
