import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceResult<T> {
    message: string = '';
    success: boolean = false;
    data?: T[] = [];

    setAsSuccess(data: T[]) {
        this.data = data;
        this.message = 'success';
        this.success = true;
    }

    setAsFailure(message: string) {
        this.data = [];
        this.message = message;
        this.success = false;
    }
}
