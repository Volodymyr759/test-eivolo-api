import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceResult<T> {
    // Members
    httpStatus?: number;
    message: string;
    success: boolean;
    data?: T[];

    // Ctor
    constructor() {
        this.httpStatus = null;
        this.message = "";
        this.success = false;
        this.data = null;
    }
}