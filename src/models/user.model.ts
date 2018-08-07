import { Document, Schema, Model, model } from 'mongoose';
import * as jwt from 'jsonwebtoken';

export interface IUserAttributes {
    username: string;
    email: string;
    avatar: string;
    githubId: string;
}

export interface IUserModel extends IUserAttributes, Document {
    toAuthJSON: () => IUserAttributes & { token: string };
}

export const UserDBSchema = new Schema(
    {
        username: {
            type: String,
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
        avatar: String,
        githubId: {
            type: String,
            index: true
        }
    },
    { timestamps: true }
);

UserDBSchema.pre('validate', function(this: IUserModel, next) {
    if (!this.avatar) {
        this.avatar =
            'https://thesocietypages.org/socimages/files/2009/05/nopic_192.gif';
    }

    next();
});

UserDBSchema.methods.generateJWT = function(): string {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
        {
            id: this._id,
            username: this.username,
            exp: parseInt(exp.getTime() / 1000 + '', 10)
        },
        process.env.PRIVATE_SECRET
    );
};

UserDBSchema.methods.toAuthJSON = function(): IUserAttributes & {
    token: string;
} {
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT(),
        avatar: this.avatar,
        githubId: this.githubId
    };
};

export const User: Model<IUserModel> = model<IUserModel>('User', UserDBSchema);
