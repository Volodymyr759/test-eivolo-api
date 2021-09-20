import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangeEmailDto {
    @ApiProperty({ type: String, required: true, minLength: 4, maxLength: 30 })
    @IsEmail()
    @MinLength(4, { message: 'Email is too short. Minimal length is 4 characters' })
    @MaxLength(30, { message: 'Email is too long. Maximal length is 30 characters' })
    oldEmail: string;

    @ApiProperty({ type: String, required: true, minLength: 4, maxLength: 30 })
    @IsEmail()
    @MinLength(4, { message: 'Email is too short. Minimal length is 4 characters' })
    @MaxLength(30, { message: 'Email is too long. Maximal length is 30 characters' })
    newEmail: string;

    @ApiProperty({ type: String, required: true, minLength: 6, maxLength: 10 })
    @IsString()
    @MinLength(6, { message: 'Password is too short. Minimal length is 6 characters' })
    @MaxLength(100, { message: 'Password is too long. Maximal length is 100 characters' })
    password: string;
}
