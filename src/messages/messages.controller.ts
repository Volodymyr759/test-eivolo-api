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
import { Message } from './entities/message.entity';
import { ServiceResult } from '../infrastructure/serviceResult';

@Controller('messages')
export class MessagesController {
    // Ctor
    constructor(private readonly messagesService: MessagesService) { }

    @Get()
    @ApiOperation({ summary: 'Get all messages' })
    findAll(): Promise<ServiceResult<Message>> {
        return this.messagesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get message by id' })
    findById(@Param('id') id: string): Promise<ServiceResult<Message>> {
        if (String(id).trim().length === 0) {
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        }
        return this.messagesService.findById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create message' })
    create(@Body() createMessageDto: CreateMessageDto): Promise<ServiceResult<Message>> {

        if (this.isEmpty(createMessageDto)) {
            throw new HttpException('No Content', HttpStatus.NO_CONTENT);
        }
        return this.messagesService.create({ id: '', ...createMessageDto });
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete message by id' })
    deleteById(@Param('id') id: string): Promise<ServiceResult<Message>> {

        if (String(id).trim().length === 0) {
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        }
        return this.messagesService.deleteById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Replace old message by new instance, using id' })
    updateById(@Param('id') id: string, @Body() updateMessageDto: CreateMessageDto): Promise<ServiceResult<Message>> {

        if (String(id).trim().length === 0) {
            throw new HttpException(`Bad Request`, HttpStatus.BAD_REQUEST);
        }
        if (this.isEmpty(updateMessageDto)) {
            throw new HttpException('No Content', HttpStatus.NO_CONTENT);
        }
        return this.messagesService.updateById(id, { id: '', ...updateMessageDto });
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
