import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { UserModel } from './user.model';
import { genSaltSync, hashSync } from 'bcryptjs';
import { ALREADY_REGISTERED_ERROR, USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('UserModel') private readonly userModel: Model<UserModel>,
        private readonly jwtService: JwtService) { }

    async create(user: AuthDto) {
        const userFromDb = await this.find(user.login);
        if (userFromDb) {
            throw new BadRequestException(ALREADY_REGISTERED_ERROR);
        }
        const newUser = new this.userModel({
            email: user.login,
            passwordHash: hashSync(user.password, genSaltSync()),
        });
        return await newUser.save();
    }

    async find(email: string): Promise<UserModel> {
        return await this.userModel.findOne({ email }).exec();
    }

    async login(email: string) {
        const payload = { email };
        return {
            access_token: await this.jwtService.signAsync(payload, { expiresIn: 1800 }), // expires time - in seconds
        };
    }

    async validateUser(email: string, password: string): Promise<Pick<UserModel, 'email'>> {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
        }
        const isPasswordCorrect = await compare(password, user.passwordHash);
        if (!isPasswordCorrect) {
            throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
        }
        return { email: user.email };
    }
}
