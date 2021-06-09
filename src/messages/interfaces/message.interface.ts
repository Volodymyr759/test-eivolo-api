import { PrefferedCommunicationWay } from '../../infrastructure/enums/prefCommunicationWayEnum'

export interface Message {
    id?: string;
    fullName: string;
    company: string;
    prefCommunication: PrefferedCommunicationWay;
    email: string;
    phoneNumber: string;
    messageText: string;
}
