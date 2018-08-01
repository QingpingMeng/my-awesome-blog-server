import ArticleType, { ArticleInputType } from '../types/article.type';
import { GraphQLID } from 'graphql';
import { Article, IArticleAttribute } from '../../models/articles.model';
import { updateObjectWith } from '../../utils/updateObjectWith';
import { User } from '../../models/user.model';

const allowedKeys = ['body', 'title', 'summary'];

interface IArticleInput {
    article: IArticleAttribute & { id?: string };
}

export const deleteArticle = {
    type: ArticleType,
    args: {
        id: {
            type: GraphQLID
        }
    },
    resolve: async (_: any, args: { id: string }) => {
        return await Article.findByIdAndRemove(args.id);
    }
};

export const updateArticle = {
    type: ArticleType,
    args: {
        article: { type: ArticleInputType }
    },
    resolve: async (_: any, args: IArticleInput) => {
        let article = await Article.findById(args.article.id).exec();
        article = updateObjectWith(article, args.article, allowedKeys);
        return await article.save();
    }
};

export const createArticle = {
    type: ArticleType,
    args: {
        article: { type: ArticleInputType }
    },
    resolve: async(_: any, args: IArticleInput) => {
        let article = new Article();
        article = updateObjectWith(article, args.article, allowedKeys);
        const users = await User.find().exec();
        article.author = users[0];
        return await article.save();
    }
};
