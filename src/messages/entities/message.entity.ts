import { Exclude } from 'class-transformer';
import { PrefferedCommunicationWay } from '../prefCommunicationWayEnum'
import { BaseEntity } from '../../infrastructure/base.entity'

export class Message extends BaseEntity {
    fullName: string;

    @Exclude()
    company: string;

    prefCommunication: PrefferedCommunicationWay;
    email: string;
    phoneNumber: string;
    messageText: string;

    constructor(partial: Partial<Message>) {
        super()
        Object.assign(this, partial);
    }
}
