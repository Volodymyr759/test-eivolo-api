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
import { ACCESS_DENIED, FORBIDDEN, BAD_REQUEST, NOT_FOUND_ERROR, UNAUTHORIZED } from '../infrastructure/constants';
import { IUserProfile } from '../infrastructure/interfaces/decoded-user.interface';
import { Role } from '../infrastructure/enums/roles.enum';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Get()
    @HttpCode(200)
    @ApiOperation({ summary: 'Get all messages, allows access for users with admin role' })
    async findAll(@UserData() decodedUser: IUserProfile): Promise<MessageModel[]> {
        if (!decodedUser) {
            throw new HttpException(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }
        if (!decodedUser.roles.includes(Role.Admin)) {
            throw new HttpException(FORBIDDEN, HttpStatus.FORBIDDEN);
        }
        return await this.messagesService.findAll();
    }

    @Get(':id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Get message by id, allows access for users with admin role' })
    async findById(@UserData() decodedUser: IUserProfile, @Param('id') id: string): Promise<MessageModel> {
        if (!decodedUser) {
            throw new HttpException(BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }
        if (!decodedUser.roles.includes(Role.Admin)) {
            throw new HttpException(ACCESS_DENIED, HttpStatus.UNAUTHORIZED);
        }

        const message = await this.messagesService.findById(id);
        if (!message) {
            throw new HttpException(NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
        }
        return message;
    }

    @Post()
    @HttpCode(201)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Create message, allows access for registered users' })
    async create(@UserData() decodedUser: IUserProfile, @Body() createMessageDto: CreateMessageDto) {
        if (!decodedUser) {
            throw new HttpException(ACCESS_DENIED, HttpStatus.UNAUTHORIZED);
        }
        return await this.messagesService.create(createMessageDto);
    }

    @Delete(':id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Delete message by id, allows access for users with admin role' })
    async deleteById(@UserData() decodedUser: IUserProfile, @Param('id') id: string) {
        if (!decodedUser) {
            throw new HttpException(BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }
        if (!decodedUser.roles.includes(Role.Admin)) {
            throw new HttpException(ACCESS_DENIED, HttpStatus.UNAUTHORIZED);
        }
        return await this.messagesService.deleteById(id);
    }

    @Put(':id')
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Replace old message by new instance, using id, allows access for users with admin role' })
    async updateById(@UserData() decodedUser: IUserProfile, @Param('id') id: string, @Body() updateMessageDto: CreateMessageDto) {
        if (!decodedUser) {
            throw new HttpException(BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }
        if (!decodedUser.roles.includes(Role.Admin)) {
            throw new HttpException(ACCESS_DENIED, HttpStatus.UNAUTHORIZED);
        }
        return await this.messagesService.updateById(id, updateMessageDto);
    }
}
