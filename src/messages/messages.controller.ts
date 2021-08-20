import {
    Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus,
    Param, Post, Put,
    UseGuards, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';
import { MessageModel } from './message.model';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserData } from '../infrastructure/decorators/user-data.decorator';
import { ACCESS_DENIED, NOT_FOUND_ERROR } from '../infrastructure/constants';
import { Role, UserModel } from '../auth/user.model';

@Controller('messages')
// @UseGuards(JwtAuthGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Get()
    @HttpCode(200)
    @ApiOperation({ summary: 'Get all messages' })
    async findAll(@UserData() userFromRequest: { user: UserModel }): Promise<MessageModel[]> {
        if (!userFromRequest.user.roles.includes(Role.Admin)) {
            throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
        }
        return await this.messagesService.findAll();
    }

    @Get(':id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Get message by id' })
    async findById(@Param('id') id: string): Promise<MessageModel> {
        const message = await this.messagesService.findById(id);
        if (!message) {
            throw new HttpException(NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
        }
        return message;
    }

    @Post()
    @HttpCode(201)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Create message' })
    async create(@Body() createMessageDto: CreateMessageDto): Promise<MessageModel> {
        return await this.messagesService.create(createMessageDto);
    }

    @Delete(':id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Delete message by id' })
    async deleteById(@Param('id') id: string): Promise<MessageModel> {
        return await this.messagesService.deleteById(id);
    }

    @Put(':id')
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Replace old message by new instance, using id' })
    async updateById(@Param('id') id: string, @Body() updateMessageDto: CreateMessageDto): Promise<MessageModel> {
        return await this.messagesService.updateById(id, updateMessageDto);
    }
}
