import { GraphQLString } from 'graphql';
import CommentType from '../types/comment.type';
import { List } from '../definition';
export const dummyComments = [
    {
        id: '1',
        content: 'comment 1'
    },
    {
        id: '2',
        content: 'comment 2'
    }
];
export const commentsQuery = {
    type: List(CommentType),
    args: {
        id: {
            type: GraphQLString
        }
    },
    resolve: (_: any, args: any) => {
        return dummyComments.filter((comment) => comment.id === args.id);
    }
};
