export class ServiceResult<T> {
    httpStatus: number;
    message: string;
    success: boolean;
    data: T[];
    constructor(httpStatus: number, message: string, success: boolean, data: T[]) {
        this.httpStatus = httpStatus;
        this.message = message;
        this.success = success;
        this.data = data;
    }
}