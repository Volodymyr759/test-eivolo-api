import { Exclude, Expose } from 'class-transformer';

export abstract class BaseEntity {
    @Exclude()
    public _id?: string;

    @Expose()
    get id(): string {
        return this._id;
    }
}