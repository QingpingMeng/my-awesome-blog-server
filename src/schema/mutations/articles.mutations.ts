import ArticleType, { ArticleInputType } from '../types/article.type';
import { GraphQLString } from 'graphql';
import { Article, IArticleAttribute } from '../../models/articles.model';
import { updateObjectWith } from '../../utils/updateObjectWith';
import { User } from '../../models/user.model';
import { NotFoundError } from '../../errors/notFound';
import { Required } from '../definition';
import { CommentInputType } from '../types/comment.type';
import { ICommentAttributes, Comment } from '../../models/comment.model';
import { UnauthorizedError } from '../../errors/unauthorized';
import { ForbiddenError } from '../../errors/forbidden';

const allowedKeys = ['body', 'title', 'summary', 'jsonBody', 'isDraft'];

export interface IArticleInput {
    article: IArticleAttribute & { id?: string };
}

export const deleteArticle = {
    type: ArticleType,
    args: {
        slug: {
            type: Required(GraphQLString)
        }
    },
    resolve: async (_: any, args: { slug: string }, context?: any) => {
        if (!context || !context.userPayload) {
            throw new UnauthorizedError();
        }

        const article = await Article.findOne({ slug: args.slug })
            .populate('author')
            .exec();
        if (!article) {
            throw new NotFoundError('Article');
        }

        if (article.author.id !== context.userPayload.id) {
            throw new ForbiddenError();
        }

        return article.remove();
    }
};

export const updateArticle = {
    type: ArticleType,
    args: {
        article: { type: Required(ArticleInputType) }
    },
    resolve: async (_: any, args: IArticleInput, context?: any) => {
        if (!context || !context.userPayload) {
            throw new UnauthorizedError();
        }

        let article = await Article.findOne({ slug: args.article.slug })
            .populate('author')
            .exec();

        if (!article) {
            throw new NotFoundError('Article');
        }

        if (article.author.id !== context.userPayload.id) {
            throw new ForbiddenError();
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
    resolve: async (_: any, args: IArticleInput, context?: any) => {
        if (!context || !context.userPayload) {
            throw new UnauthorizedError();
        }

        let article = new Article();
        article = updateObjectWith(article, args.article, allowedKeys);
        const user = await User.findById(context.userPayload.id).exec();
        article.author = user;
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
    resolve: async (_: any, args: IAddCommentToArticleArgs, context?: any) => {
        if (!context || !context.userPayload) {
            throw new UnauthorizedError();
        }

        const [article, user] = await Promise.all([
            Article.findOne({ slug: args.slug })
                .populate('author')
                .exec(),
            User.findById(context.userPayload.id).exec()
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
