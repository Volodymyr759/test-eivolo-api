import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from './user.model';
import { ALREADY_REGISTERED_ERROR, JWT_EXPIRATION_TIME, NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '../infrastructure/constants';
import { Role } from '../infrastructure/enums/roles.enum';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
        private readonly jwtService: JwtService) { }

    async create(userDto: CreateUserDto) {
        const userFromDb = await this.find(userDto.login);
        if (userFromDb) {
            throw new BadRequestException(ALREADY_REGISTERED_ERROR);
        }
        const newUser = new this.userModel({
            email: userDto.login,
            passwordHash: await hash(userDto.password, await genSalt()),
            roles: [Role.User],
            refreshToken: this.makeRefreshToken(30),
        });
        return await newUser.save();
    }

    async deleteByEmail(email: string) {
        const userToDelete = await this.find(email);
        if (!userToDelete) {
            throw new NotFoundException(NOT_FOUND_ERROR);
        }
        return await this.userModel.findByIdAndRemove(userToDelete._id);
    }

    async findAll(): Promise<UserModel[]> {
        return await this.userModel.find({}).exec();
    }

    async find(email: string) {
        return await this.userModel.findOne({ email }).exec();
    }

    async login(userDto: CreateUserDto) {
        const userFromDb = await this.find(userDto.login);
        if (!userFromDb) {
            throw new HttpException(NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
        }

        const isPasswordCorrect = await compare(userDto.password, userFromDb.passwordHash);
        if (!isPasswordCorrect) {
            throw new HttpException(WRONG_PASSWORD_ERROR, HttpStatus.BAD_REQUEST);
        }

        const token = await this.jwtService.signAsync({ user: userFromDb }, { expiresIn: JWT_EXPIRATION_TIME });

        return {
            access_token: token,
            expires_in: JWT_EXPIRATION_TIME,
            token_type: 'bearer',
            refresh_token: userFromDb.refreshToken,
            email: userFromDb.email,
        };
    }

    makeRefreshToken(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
