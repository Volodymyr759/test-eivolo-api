import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum, Min, MinLength, MaxLength } from 'class-validator';
import { PrefferedCommunicationWay } from '../prefCommunicationWayEnum';

export class CreateMessageDto {
    @ApiProperty({ type: String, required: true, minLength: 4, maxLength: 30 })
    @IsString({ message: 'Full name should be a string' })
    @MinLength(4, { message: 'Full name is too short. Minimal length is 4 characters' })
    @MaxLength(30, { message: 'Full name is too long. Maximal length is 30 characters' })
    readonly fullName: string;

    @ApiProperty({ type: String, required: true, minLength: 3, maxLength: 50 })
    @IsString()
    @MinLength(3, { message: 'Company name is too short. Minimal length is 3 characters' })
    @MaxLength(50, { message: 'Company name is too long. Maximal length is 50 characters' })
    readonly company: string;

    @ApiProperty({ type: String, required: true, enum: [PrefferedCommunicationWay.Email, PrefferedCommunicationWay.Phone] })
    @IsEnum(PrefferedCommunicationWay)
    readonly prefCommunication: PrefferedCommunicationWay;

    @ApiProperty({ type: String, required: true, minLength: 4, maxLength: 30 })
    @IsEmail()
    readonly email: string;

    @ApiProperty({ type: String, required: true, minLength: 4, maxLength: 20 })
    @IsString()
    @MinLength(4, { message: 'Company name is too short. Minimal length is 4 characters' })
    @MaxLength(20, { message: 'Company name is too long. Maximal length is 20 characters' })
    readonly phoneNumber: string;

    @ApiProperty({ type: String, required: true, minLength: 10, maxLength: 500 })
    @IsString()
    @MinLength(10, { message: 'Company name is too short. Minimal length is 10 characters' })
    @MaxLength(500, { message: 'Company name is too long. Maximal length is 500 characters' })
    readonly messageText: string;
}
