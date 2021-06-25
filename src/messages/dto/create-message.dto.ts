import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum, Min } from 'class-validator';
import { PrefferedCommunicationWay } from '../prefCommunicationWayEnum';

export class CreateMessageDto {
    @ApiProperty({
        type: String,
        required: true,
        minLength: 4,
        maxLength: 30,
     })
     @IsString()
    readonly fullName: string;

    @ApiProperty({
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    })
    @IsString()
    readonly company: string;

    @ApiProperty({
        type: String,
        required: true,
        enum: [PrefferedCommunicationWay.Email, PrefferedCommunicationWay.Phone],
    })
    @IsEnum(PrefferedCommunicationWay)
    readonly prefCommunication: PrefferedCommunicationWay;

    @ApiProperty({
        type: String,
        required: true,
        minLength: 4,
        maxLength: 30,
    })
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20,
    })
    @IsString()
    readonly phoneNumber: string;

    @ApiProperty({
        type: String,
        required: true,
        minLength: 10,
        maxLength: 500,
    })
    @IsString()
    readonly messageText: string;
}
