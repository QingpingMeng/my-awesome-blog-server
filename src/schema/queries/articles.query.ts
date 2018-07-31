import { GraphQLInt, GraphQLString } from 'graphql';
import { List } from '../definition';
import ArticleType from '../types/article.type';
export const dummyPosts = [
   {
       id: 1,
       title: 'hello world!',
       author:  {
        id: 1,
        username: 'user01'
    }
   }
];
export const articles = {
    type: List(ArticleType),
    args: {
        id: {
            type: GraphQLString
        }
    },
    resolve: (_: any, args: any) => {
        return dummyPosts;
    }
};
