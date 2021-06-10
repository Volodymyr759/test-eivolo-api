import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';
import { Message } from './interfaces/message.interface';
import { ServiceResult } from './serviceResult';

@Controller('messages')
export class MessagesController {

    // Ctor
    constructor(private readonly messagesService: MessagesService) { }

    @Get()
    @ApiOperation({ summary: 'Get all messages' })
    findAll(): Promise<ServiceResult<Message>> {
        const messages = this.messagesService.findAll()
            .catch(
                () => { throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR); }
            );

        return messages;
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get message by id' })
    findById(@Param('id') id: string): Promise<ServiceResult<Message>> {

        if (String(id).trim().length === 0) {
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        }

        const message = this.messagesService.findById(id)
            .catch(
                () => { throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR); }
            );

        return message;
    }

    @Post()
    @ApiOperation({ summary: 'Create message' })
    createById(@Body() createMessageDto: CreateMessageDto): Promise<ServiceResult<Message>> {

        if (this.isEmpty(createMessageDto)) {
            throw new HttpException('No Content', HttpStatus.NO_CONTENT);
        }

        const message = this.messagesService.createById(createMessageDto)
            .catch(
                () => { throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR); }
            );

        return message;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete message by id' })
    deleteById(@Param('id') id: string): Promise<ServiceResult<Message>> {

        if (String(id).trim().length === 0) {
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        }

        const message = this.messagesService.deleteById(id)
            .catch(
                () => { throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR); }
            );

        return message;
    }

    @Put(':id')
    @ApiOperation({ summary: 'Replace old message by new instance, using id' })
    updateById(@Param('id') id: string, @Body() updateMessageDto: CreateMessageDto): Promise<ServiceResult<Message>> {

        if (String(id).trim().length === 0) {
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        }

        if (this.isEmpty(updateMessageDto)) {
            throw new HttpException('No Content', HttpStatus.NO_CONTENT);
        }

        const message = this.messagesService.updateById(id, updateMessageDto)
            .catch(
                () => { throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR); }
            );

        return message;
    }

    // Helpers
    private isEmpty(obj): boolean {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
}
