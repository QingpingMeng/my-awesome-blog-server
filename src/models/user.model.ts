import { Document, Schema, Model, model } from 'mongoose';

export interface IUserAttributes {
    username: string;
    email: string;
    avatar: string;
}

export interface IUserModel extends IUserAttributes, Document {}

export const IUserDBSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    image: String,
}, {timestamps: true});

export const User: Model<IUserModel> = model<IUserModel>('User', IUserDBSchema);