import { Body, Controller, Delete, HttpCode, HttpException, HttpStatus, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from './user.model';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @HttpCode(201)
    @UsePipes(new ValidationPipe())
    async register(@Body() userDto: CreateUserDto) {
        return await this.authService.create(userDto);
    }

    @Post('login')
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    async login(@Body() userDto: CreateUserDto) {
        return await this.authService.login(userDto);
    }

    @Delete(':email')
    @HttpCode(200)
    @ApiOperation({ summary: 'Delete user by email' })
    async deleteByEmail(@Param('email') email: string): Promise<UserModel> {
        return await this.authService.deleteByEmail(email);
    }
}
