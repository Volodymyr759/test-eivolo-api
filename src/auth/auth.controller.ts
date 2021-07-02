import { Body, Controller, Delete, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UserModel } from './user.model';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @HttpCode(201)
    @UsePipes(new ValidationPipe())
    async register(@Body() user: AuthDto) {
        return await this.authService.create(user);
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    async login(@Body() dto: AuthDto) {
        const user = await this.authService.validateUser(dto.login, dto.password);
        return this.authService.login(user.email);
    }

    @Delete(':email')
    @HttpCode(200)
    @ApiOperation({ summary: 'Delete user by email' })
    async deleteByEmail(@Param('email') email: string): Promise<UserModel> {
        return await this.authService.deleteByEmail(email);
    }
}
