import { PrefferedCommunicationWay } from '../prefCommunicationWayEnum'
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
    @ApiProperty({
        type: String,
        required: true,
        minLength: 4,
        maxLength: 30 })
    readonly fullName: string;

    @ApiProperty({
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    })
    readonly company: string;

    @ApiProperty({
        type: String,
        required: true,
        enum: [PrefferedCommunicationWay.Email, PrefferedCommunicationWay.Phone]
    })
    readonly prefCommunication: PrefferedCommunicationWay;

    @ApiProperty({
        type: String,
        required: true,
        minLength: 4,
        maxLength: 30
    })
    readonly email: string;

    @ApiProperty({
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20
    })
    readonly phoneNumber: string;

    @ApiProperty({
        type: String,
        required: true,
        minLength: 10,
        maxLength: 500
    })
    readonly messageText: string;
}
