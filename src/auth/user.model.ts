import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Role } from '../infrastructure/enums/roles.enum';

// tslint:disable-next-line: no-empty-interface
export interface UserModel extends Base { }

export class UserModel extends TimeStamps {
    @prop({ unique: true })
    email: string;

    @prop()
    passwordHash: string;

    @prop({ type: () => [Number] })
    roles: Role[];

    @prop()
    refreshToken: string;
}
