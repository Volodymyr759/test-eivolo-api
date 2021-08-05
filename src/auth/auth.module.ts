import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModel } from './user.model';
import { AuthService } from './auth.service';
import { ServiceResult } from '../infrastructure/serviceResult';
import { getJwtConfig } from '../configs/jwt.config';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: { collection: 'User' },
      },
    ]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ServiceResult, JwtStrategy],
})

export class AuthModule { }
