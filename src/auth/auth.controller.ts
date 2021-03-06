import {
    Body, Controller,
    Delete, Get,
    HttpCode, HttpException, HttpStatus, Param, Post, Put, Res, UseGuards, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { UserData } from '../infrastructure/decorators/user-data.decorator';
import { ACCESS_DENIED, BAD_REQUEST, NOT_FOUND_ERROR, UNAUTHORIZED } from '../infrastructure/constants';
import { Role } from '../infrastructure/enums/roles.enum';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserModel } from './user.model';
import { IJwt } from '../infrastructure/interfaces/jwt.interface';
import { RefreshToken } from '../infrastructure/interfaces/refresh-token.interface';
import { IUserProfile } from '../infrastructure/interfaces/decoded-user.interface';
import { UpdateUserDto } from './dto/update-user-dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @ApiOperation({ summary: 'Get all users', description: 'Returns users list' })
    async getAllUsers(@UserData() decodedUser: IUserProfile): Promise<UserModel[]> {
        if (!decodedUser) {
            throw new HttpException(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }
        if (!decodedUser.roles.includes(Role.Admin)) {
            throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
        }
        return await this.authService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @ApiOperation({ summary: 'Get user by id', description: 'Returns user' })
    async getUser(@UserData() decodedUser: IUserProfile, @Param('id') id: string): Promise<IUserProfile | null> {
        if (!decodedUser) {
            throw new HttpException(BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }
        const user = await this.authService.findById(id);
        if (!user) {
            throw new HttpException(NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
        }
        return decodedUser;
    }

    @Put(':id')
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Administrator can update users email and role, using id' })
    async updateById(@UserData() decodedUser: IUserProfile, @Param('id') id: string, @Body() userDto: UpdateUserDto) {
        if (!decodedUser) {
            throw new HttpException(BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }
        if (!decodedUser.roles.includes(Role.Admin)) {
            throw new HttpException(ACCESS_DENIED, HttpStatus.UNAUTHORIZED);
        }
        return await this.authService.updateById(id, userDto);
    }

    @Post('change-email')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Change user email', description: 'Returns confirmation of change email' })
    async changeEmail(@UserData() decodedUser: IUserProfile, @Body() changeEmailDto: ChangeEmailDto) {
        if (!decodedUser) {
            throw new HttpException(BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }
        const changedEmail = await this.authService.changeEmail(changeEmailDto);
        return changedEmail;
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Change user password', description: 'Returns confirmation of change password' })
    async changePassword(@UserData() decodedUser: IUserProfile, @Body() changePasswordDto: ChangePasswordDto) {
        if (!decodedUser) {
            throw new HttpException(BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }
        const changedPassword = await this.authService.changePassword(changePasswordDto);

        return changedPassword ? HttpStatus.OK : HttpStatus.EXPECTATION_FAILED;
    }

    @Post('forgot-password')
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Create new user password', description: 'Returns new user password' })
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        const createdPassword = await this.authService.forgotPassword(forgotPasswordDto);

        return createdPassword ? createdPassword : HttpStatus.EXPECTATION_FAILED;
    }

    @Post('login')
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Login user', description: 'Returns token with UserData' })
    async login(@Res({ passthrough: true }) response: Response, @Body() userDto: CreateUserDto) {
        const jwtObject = await this.authService.login(userDto);
        response.cookie('auth', JSON.stringify(jwtObject));
        return jwtObject;
    }

    @Post('refresh')
    @HttpCode(200)
    @ApiOperation({ summary: 'Refresh access token', description: 'Generates new jwt-object, using refresh_token from Authorization header' })
    async refresh(@Res({ passthrough: true }) response: Response, @Body() refreshToken: RefreshToken): Promise<IJwt> {
        const jwtObject = await this.authService.refresh(refreshToken.token);
        response.cookie('auth', JSON.stringify(jwtObject));
        return jwtObject;
    }

    @Post('register')
    @HttpCode(201)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Register user' })
    async register(@Body() userDto: CreateUserDto) {
        return await this.authService.create(userDto);
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
