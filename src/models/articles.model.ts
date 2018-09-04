import { ICommentModel } from './comment.model';
import { IUserModel } from './user.model';
import { Document, Schema, Model, model } from 'mongoose';
import slug from 'slug';

export interface IArticleAttribute {
    slug?: string;
    title: string;
    summary?: string;
    body: string;
    jsonBody: string;
    comments?: ICommentModel[] & { remove: (id: string) => void };
    author?: IUserModel;
}

export interface IArticleModel extends IArticleAttribute, Document {
    slugify: () => string;
}

export const ArticleDBSchema = new Schema(
    {
        slug: { type: String, lowercase: true, unique: true },
        title: String,
        summary: String,
        body: String,
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        author: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
);

ArticleDBSchema.pre('validate', function(this: IArticleModel, next) {
    if (!this.slug) {
        this.slugify();
    }

    next();
});

ArticleDBSchema.methods.slugify = function() {
    this.slug =
        slug(this.title) +
        '-' +
        ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
};

export const Article: Model<IArticleModel> = model<IArticleModel>(
    'Article',
    ArticleDBSchema
);
