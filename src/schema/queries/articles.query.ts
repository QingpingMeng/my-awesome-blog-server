import { GraphQLString } from 'graphql';
import { List } from '../definition';
import ArticleType from '../types/article.type';
import { Article } from '../../models/articles.model';

export const listArticles = {
    type: List(ArticleType),
    args: {
        id: {
            type: GraphQLString
        }
    },
    resolve: async (_: any, args: any) => {
        return await Article.find().exec();
    }
};
