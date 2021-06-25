import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { PrefferedCommunicationWay } from './prefCommunicationWayEnum';

// tslint:disable-next-line: no-empty-interface
export interface MessageModel extends Base { }

export class MessageModel extends TimeStamps {
    @prop()
    fullName: string;

    @prop()
    company: string;

    @prop()
    prefCommunication: PrefferedCommunicationWay;

    @prop()
    email: string;

    @prop()
    phoneNumber: string;

    @prop()
    messageText: string;
}
