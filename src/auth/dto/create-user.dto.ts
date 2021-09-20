import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ type: String, required: true, minLength: 4, maxLength: 30 })
    @IsEmail()
    @MinLength(4, { message: 'Login is too short. Minimal length is 4 characters' })
    @MaxLength(30, { message: 'Login is too long. Maximal length is 30 characters' })
    login: string;

    @ApiProperty({ type: String, required: true, minLength: 6, maxLength: 10 })
    @IsString()
    @MinLength(6, { message: 'Password is too short. Minimal length is 6 characters' })
    @MaxLength(10, { message: 'Password is too long. Maximal length is 10 characters' })
    password: string;
}
