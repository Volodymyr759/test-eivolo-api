import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
    name: String,
    fullName: String,
    company: String,
    prefCommunication: String,
    email: String,
    phoneNumber: String,
    messageText: String,
});
