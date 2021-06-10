import { Injectable, Type } from '@nestjs/common';

@Injectable()
export class ServiceResult<T> {
    // Members
    httpStatus?: number = null;
    message: string = '';
    success: boolean = false;
    data?: T[];
}