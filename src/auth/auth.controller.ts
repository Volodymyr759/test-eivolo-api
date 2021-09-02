import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserData } from '../infrastructure/decorators/user-data.decorator';
import { ACCESS_DENIED } from '../infrastructure/constants';
import { Role } from '../infrastructure/enums/roles.enum';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserModel } from './user.model';
import { DecodedUser } from '../infrastructure/interfaces/decoded-user.interface';
import { IJwt } from 'src/infrastructure/interfaces/jwt.interface';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @ApiOperation({ summary: 'Get all users', description: 'Returns users list' })
    async getAllUsers(@UserData() userFromRequest: { user: UserModel }): Promise<UserModel[]> {
        if (!userFromRequest.user.roles.includes(Role.Admin)) {
            throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
        }
        return await this.authService.findAll();
    }

    @Post('register')
    @HttpCode(201)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Register user' })
    async register(@Body() userDto: CreateUserDto) {
        return await this.authService.create(userDto);
    }

    @Post('login')
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Login user', description: 'Returns token with UserData' })
    async login(@Body() userDto: CreateUserDto) {
        return await this.authService.login(userDto);
    }

    @Post('refresh')
    @HttpCode(201)
    @ApiOperation({ summary: 'Refresh access token', description: 'Generates new jwt-object, using refresh_token from Authorization header' })
    async refresh(@UserData() decodedUser: DecodedUser): Promise<IJwt> {
        return await this.authService.refresh(decodedUser);
    }

    @Delete(':email')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @ApiOperation({ summary: 'Delete user by email' })
    async deleteByEmail(@Param('email') email: string, @UserData() userFromRequest: { user: UserModel }) {
        if (!userFromRequest.user.roles.includes(Role.Admin)) {
            throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
        }
        return await this.authService.deleteByEmail(email);
    }
}
