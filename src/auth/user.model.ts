import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { IsEmail } from 'class-validator';

// tslint:disable-next-line: no-empty-interface
export interface UserModel extends Base { }

export class UserModel extends TimeStamps {
    @prop({ unique: true })
    email: string;

    @prop()
    passwordHash: string;
}
