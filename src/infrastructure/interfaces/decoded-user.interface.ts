import { Types } from 'mongoose';
import { Role } from '../enums/roles.enum';

export interface IUserProfile {
	roles: Role[];
	_id: Types.ObjectId;
	email: string;
	createdAt?: Date;
	updatedAt?: Date;
}
