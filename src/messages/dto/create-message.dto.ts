import prefCommunicationWayEnum from '../prefCommunicationWayEnum'

export class CreateMessageDto {
    readonly fullName: string;
    readonly company: string;
    readonly prefCommunication: prefCommunicationWayEnum;
    readonly email: string;
    readonly phoneNumber: string;
    readonly messageText: string;
}
