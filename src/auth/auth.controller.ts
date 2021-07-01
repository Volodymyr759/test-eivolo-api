import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

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
}
