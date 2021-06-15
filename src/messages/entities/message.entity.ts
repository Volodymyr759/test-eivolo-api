import { PrefferedCommunicationWay } from '../prefCommunicationWayEnum'
import { BaseEntity} from '../../infrastructure/base.entity'

export class Message extends BaseEntity {
    public _id?: string;
    public get id(): string {
        return this._id;
    }
    fullName: string;
    company: string;
    prefCommunication: PrefferedCommunicationWay;
    email: string;
    phoneNumber: string;
    messageText: string;
}
