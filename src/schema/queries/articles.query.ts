import { GraphQLString, GraphQLInt } from 'graphql';
import { List, IQueryConditionArg } from '../definition';
import ArticleType from '../types/article.type';
import { Article } from '../../models/articles.model';
import { InvalidParameter } from '../../errors/invalidParameter';

export const queryArticles = {
    type: List(ArticleType),
    args: {
        condition: {
            type: GraphQLString
        },
        limit: {
            type: GraphQLInt
        },
        offset: {
            type: GraphQLInt
        }
    },
    resolve: async (_: any, args?: IQueryConditionArg) => {
        let condition: any = {};
        let limit = 10;
        let offset = 0;
        if (args) {
            if (args.condition) {
                try {
                    condition = JSON.parse(args.condition);
                } catch {
                    throw new InvalidParameter('condition');
                }
            }

            if (args.limit) {
                limit = args.limit;
            }

            if (args.offset) {
                offset = args.offset;
            }
        }
        console.log(condition);
        return await Article.find(condition)
            .limit(limit)
            .skip(offset)
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
