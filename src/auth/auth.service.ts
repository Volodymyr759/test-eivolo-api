import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from 'nestjs-typegoose';
import { genSalt, hash, compare } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from './user.model';
import {
    ALREADY_REGISTERED_ERROR,
    FORBIDDEN,
    JWT_EXPIRATION_TIME, JWT_EXPIRATION_TIME_FOR_REFRESH,
    JWT_SECRET,
    NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR,
} from '../infrastructure/constants';
import { Role } from '../infrastructure/enums/roles.enum';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UpdateUserDto } from './dto/update-user-dto';
import { IUserProfile } from 'src/infrastructure/interfaces/decoded-user.interface';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

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
        const refreshToken = await this.jwtService.signAsync({ email: userDto.login }, { expiresIn: JWT_EXPIRATION_TIME_FOR_REFRESH });
        const newUser = new this.userModel({
            email: userDto.login,
            passwordHash: await hash(userDto.password, await genSalt()),
            roles: [Role.User],
            refreshToken,
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

    async findById(id: string) {
        const userFromDb = await this.userModel.findOne({ _id: id }).exec();
        const userProfile: IUserProfile = {
            roles: userFromDb!.roles,
            _id: userFromDb!._id,
            email: userFromDb!.email,
            createdAt: userFromDb!.createdAt,
            updatedAt: userFromDb!.updatedAt,
        };
        return userProfile;
    }

    async changeEmail(changedEmail: ChangeEmailDto) {
        const userFromDb = await this.find(changedEmail.oldEmail);
        if (!userFromDb) {
            throw new HttpException(NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
        }

        const isPasswordCorrect = await compare(changedEmail.password, userFromDb.passwordHash);
        if (!isPasswordCorrect) {
            throw new HttpException(WRONG_PASSWORD_ERROR, HttpStatus.BAD_REQUEST);
        }
        userFromDb.email = changedEmail.newEmail;
        await this.userModel.findByIdAndUpdate(userFromDb.id, userFromDb, { new: true }).exec();
        return userFromDb.email;
    }

    async changePassword(changePasswordDto: ChangePasswordDto) {
        const userFromDb = await this.find(changePasswordDto.email);
        if (!userFromDb) {
            throw new HttpException(NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
        }

        const isPasswordCorrect = await compare(changePasswordDto.oldPassword, userFromDb.passwordHash);
        if (!isPasswordCorrect) {
            throw new HttpException(WRONG_PASSWORD_ERROR, HttpStatus.BAD_REQUEST);
        }
        userFromDb.passwordHash = await hash(changePasswordDto.newPassword, await genSalt());
        await this.userModel.findByIdAndUpdate(userFromDb.id, userFromDb, { new: true }).exec();

        return true;
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
        const userProfile: IUserProfile = {
            roles: userFromDb.roles,
            _id: userFromDb._id,
            email: userFromDb.email,
            createdAt: userFromDb.createdAt,
            updatedAt: userFromDb.updatedAt,
        };

        const token = await this.jwtService.signAsync(userProfile, { expiresIn: JWT_EXPIRATION_TIME });

        return {
            access_token: token,
            expires_in: JWT_EXPIRATION_TIME,
            token_type: 'bearer',
            refresh_token: userFromDb.refreshToken,
            email: userFromDb.email,
            roles: userFromDb.roles,
            userId: userFromDb._id,
        };
    }

    async refresh(refreshToken: string) {
        try {
            const decodedEmail = this.jwtService.verify(refreshToken, { secret: JWT_SECRET }).email;
            const userFromDb = await this.find(decodedEmail);
            if (!userFromDb) {
                throw new HttpException(NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
            }
            if (decodedEmail !== userFromDb.email) {
                throw new HttpException(FORBIDDEN, HttpStatus.FORBIDDEN);
            }
            const userProfile: IUserProfile = {
                roles: userFromDb.roles,
                _id: userFromDb._id,
                email: userFromDb.email,
                createdAt: userFromDb.createdAt,
                updatedAt: userFromDb.updatedAt,
            };
            userFromDb.refreshToken = await this.jwtService.signAsync({ email: userFromDb.email }, { expiresIn: JWT_EXPIRATION_TIME_FOR_REFRESH });
            await this.userModel.findByIdAndUpdate(userFromDb.id, userFromDb, { new: true }).exec();

            const token = await this.jwtService.signAsync(userProfile, { expiresIn: JWT_EXPIRATION_TIME });
            return {
                access_token: token,
                expires_in: JWT_EXPIRATION_TIME,
                token_type: 'bearer',
                refresh_token: userFromDb.refreshToken,
                email: userFromDb.email,
                roles: userFromDb.roles,
                userId: userFromDb._id,
            };
        } catch (e) {
            throw new Error('Something went wrong :' + e);
        }
    }

    async updateById(id: string, user: UpdateUserDto) {
        const userFromDb = await this.findById(id);
        if (!userFromDb) {
            throw new NotFoundException(NOT_FOUND_ERROR);
        }

        userFromDb.email = user.email;
        userFromDb.updatedAt = new Date();
        userFromDb.roles = user.roles;

        return await this.userModel.findByIdAndUpdate(id, userFromDb, { new: true }).exec();
    }
}
