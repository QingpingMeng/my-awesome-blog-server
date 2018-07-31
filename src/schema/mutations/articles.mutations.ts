import ArticleType, { ArticleInputType } from '../types/article.type';
import { GraphQLID } from '../../../node_modules/@types/graphql';
import { dummyPosts } from '../queries/articles.query';

export const deleteArticle = {
    type: ArticleType,
    args: {
        id: {
            type: GraphQLID
        }
    },
    resolve: (_: any, args: any) => {
        const result = dummyPosts[0];
        return result;
    }
};

export const updateArticle = {
    type: ArticleType,
    args: {
        article: { type: ArticleInputType }
    },
    resolve: (_: any, args: any) => {
        const result = dummyPosts[0];
        return result;
    }
};

export const CreateArticle = {
    type: ArticleType,
    args: {
        article: { type: ArticleInputType }
    },
    resolve: (_: any, args: any) => {
        const result = dummyPosts[0];
        return result;
    }
};
