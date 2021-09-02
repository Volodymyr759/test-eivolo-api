import { createParamDecorator, ExecutionContext, Options } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from '../constants';

export const UserData = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const jwtService = new JwtService({ secret: JWT_SECRET });
        const token = request.headers.authorization.split(' ')[1];
        const decodedUser = jwtService.verify(token, { secret: JWT_SECRET });
        return decodedUser;
    },
);
