import PrefferedCommunicationWay from '../prefCommunicationWayEnum'

export class CreateMessageDto {
    readonly fullName: string;
    readonly company: string;
    readonly prefCommunication: PrefferedCommunicationWay;
    readonly email: string;
    readonly phoneNumber: string;
    readonly messageText: string;
}
