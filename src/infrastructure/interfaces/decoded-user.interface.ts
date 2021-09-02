import { Role } from '../enums/roles.enum';

export interface DecodedUser {
	user: {
		roles: Role[];
		_id: string;
		email: string;
		passwordHash: string;
		createdAt: Date;
		updatedAt: Date;
		__v: number;
		refreshToken: string;
	};
	iat: number;
	exp: number;
}
