import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

// tslint:disable-next-line: no-empty-interface
export interface UpdateUserDto extends Base { }
export class UpdateUserDto extends TimeStamps {
    @ApiProperty({ type: String, required: true, minLength: 4, maxLength: 30 })
    @IsEmail()
    @MinLength(4, { message: 'Login is too short. Minimal length is 4 characters' })
    @MaxLength(30, { message: 'Login is too long. Maximal length is 30 characters' })
    email: string;

    @ApiProperty({ type: [Number], required: true })
    roles: number[];
}
