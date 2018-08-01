import { IUserModel } from './user.model';
import { Document, model, Schema, Model } from 'mongoose';
import { IArticleModel } from './articles.model';

export interface ICommentAttributes {
    body: string;
    author: IUserModel;
    article: IArticleModel;
}

export const CommentDBSchema = new Schema(
    {
        body: String,
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        article: { type: Schema.Types.ObjectId, ref: 'Article' }
    },
    { timestamps: true }
);

export interface ICommentModel extends ICommentAttributes, Document {}

export const Comment: Model<ICommentModel> = model('Comment', CommentDBSchema);
