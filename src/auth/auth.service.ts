import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { Role, UserModel } from './user.model';
import { ALREADY_REGISTERED_ERROR, NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '../infrastructure/constants';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: Model<UserModel>,
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
        });
        return await newUser.save();
    }

    async deleteByEmail(email: string): Promise<UserModel> {
        const userToDelete = await this.find(email);
        if (!userToDelete) {
            throw new NotFoundException(NOT_FOUND_ERROR);
        }
        return await this.userModel.findByIdAndRemove(userToDelete._id);
    }

    async findAll(): Promise<UserModel[]> {
        return await this.userModel.find({}).exec();
    }

    async find(email: string): Promise<UserModel> {
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

        const payload = { user: userFromDb };
        return {
            access_token: await this.jwtService.signAsync(payload, { expiresIn: 1800 }), // expires time - in seconds
        };
    }
}
