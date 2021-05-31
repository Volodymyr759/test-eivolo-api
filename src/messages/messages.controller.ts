import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';
import { Message } from './interfaces/message.interface';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Get()
    findAll(): Promise<Message[]> {
        return this.messagesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id): Promise<Message> {
        return this.messagesService.findOne(id);
    }

    @Post()
    create(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
        return this.messagesService.create(createMessageDto);
    }

    @Delete(':id')
    delete(@Param('id') id): Promise<Message> {
        return this.messagesService.delete(id);
    }

    @Put(':id')
    update(@Body() updateMessageDto: CreateMessageDto, @Param('id') id): Promise<Message> {
        return this.messagesService.update(id, updateMessageDto);
    }
}
