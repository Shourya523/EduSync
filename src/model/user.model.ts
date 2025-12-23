import mongoose, { Schema, Document } from 'mongoose'

export interface Message extends Document {
    content: string;
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface Users extends Document {
    username: string,
    email_id: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: Boolean,
    messages: Message[]
}
export interface Users extends Document {
    username: string,
    email_id: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
}
const UserSchema: Schema<Users> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email_id: {
        required: [true, "Username is required"],
        type: String,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    verifyCode: {
        type: String,
        required: [true, 'Verification code is required']
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verification code expiry is required']
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isAcceptingMessage:{
        type: Boolean,
        default: false
    },
    messages:[MessageSchema]
})
export const UserModel = 
(mongoose.models.Users as mongoose.Model<Users>) || 
mongoose.model<Users>('Users', UserSchema);
