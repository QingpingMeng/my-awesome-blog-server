import { GraphQLString } from 'graphql';
import { List, IQueryConditionArg } from '../definition';
import ArticleType from '../types/article.type';
import { Article } from '../../models/articles.model';
import { InvalidParameter } from '../../errors/invalidParameter';

export const queryArticles = {
    type: List(ArticleType),
    args: {
        condition: {
            type: GraphQLString
        }
    },
    resolve: async (_: any, args?: IQueryConditionArg) => {
        let condition: any = {};
        if (args && args.condition) {
            try {
                condition = JSON.parse(args.condition);
            } catch {
                throw new InvalidParameter('condition');
            }
        }
        return await Article.find(condition)
            .sort({ createdAt: 'desc' })
            .exec();
    }
};

export const queryArticle = {
    type: ArticleType,
    args: {
        condition: {
            type: GraphQLString
        }
    },
    resolve: async (_: any, args: IQueryConditionArg) => {
        let condition: any = {};
        if (args.condition) {
            try {
                condition = JSON.parse(args.condition);
            } catch {
                throw new InvalidParameter('condition');
            }
        }
        return await Article.findOne(condition).exec();
    }
};
