import ArticleType, { ArticleInputType } from '../types/article.type';
import { GraphQLID, GraphQLString } from 'graphql';
import { Article, IArticleAttribute } from '../../models/articles.model';
import { updateObjectWith } from '../../utils/updateObjectWith';
import { User } from '../../models/user.model';
import { NotFoundError } from '../../errors/notFound';
import { Required } from '../definition';
import { CommentInputType } from '../types/comment.type';
import { ICommentAttributes, Comment } from '../../models/comment.model';
import { UnauthorizedError } from '../../errors/unauthorized';
import { Request } from 'express';

const allowedKeys = ['body', 'title', 'summary'];

export interface IArticleInput {
    article: IArticleAttribute & { id?: string };
}

export const deleteArticle = {
    type: ArticleType,
    args: {
        id: {
            type: Required(GraphQLID)
        }
    },
    resolve: async (_: any, args: { id: string }) => {
        try {
            return await Article.findByIdAndRemove(args.id);
        } catch {
            throw new NotFoundError('Article');
        }
    }
};

export const updateArticle = {
    type: ArticleType,
    args: {
        article: { type: Required(ArticleInputType) }
    },
    resolve: async (_: any, args: IArticleInput) => {
        let article;
        try {
            article = await Article.findById(args.article.id).exec();
        } catch {
            throw new NotFoundError('Article');
        }

        try {
            article = updateObjectWith(article, args.article, allowedKeys);
            return await article.save();
        } catch {
            throw new Error('Update article fails');
        }
    }
};

export const createArticle = {
    type: ArticleType,
    args: {
        article: { type: Required(ArticleInputType) }
    },
    resolve: async (_: any, args: IArticleInput, context?: Request) => {
        context && console.log(context.isAuthenticated());
        let article = new Article();
        article = updateObjectWith(article, args.article, allowedKeys);
        const users = await User.find().exec();
        article.author = users[0];
        return await article.save();
    }
};

interface IAddCommentToArticleArgs {
    slug: string;
    comment: ICommentAttributes;
}

export const addCommentToArticle = {
    type: ArticleType,
    args: {
        comment: {
            type: Required(CommentInputType)
        },
        slug: {
            type: Required(GraphQLString)
        }
    },
    resolve: async (_: any, args: IAddCommentToArticleArgs) => {
        const [article, user] = await Promise.all([
            Article.findOne({ slug: args.slug })
                .populate('author')
                .exec(),
            User.findOne().exec()
        ]);

        if (!article) {
            throw new NotFoundError('Article');
        }

        if (!user) {
            throw new UnauthorizedError();
        }

        try {
            let commentModel = new Comment();
            commentModel.article = article;
            commentModel.author = user;
            commentModel.body = args.comment.body;

            commentModel = await commentModel.save();

            article.comments.push(commentModel);
            await article.save();
            return commentModel;
        } catch (error) {
            throw error;
        }
    }
};
