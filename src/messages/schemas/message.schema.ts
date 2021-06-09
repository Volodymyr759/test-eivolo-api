import * as mongoose from 'mongoose';
import PrefferedCommunicationWay from '../prefCommunicationWayEnum'

export const MessageSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 30
    },
    company: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    prefCommunication: {
        type: String,
        required: true,
        enum: [PrefferedCommunicationWay.Email, PrefferedCommunicationWay.Phone]
    },
    email: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 30
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 20
    },
    messageText: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500
    },
});
