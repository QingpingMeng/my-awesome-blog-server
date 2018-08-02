import { GraphQLString } from 'graphql';
import CommentType from '../types/comment.type';
import { List } from '../definition';
import { Comment } from '../../models/comment.model';

export const commentsQuery = {
    type: List(CommentType),
    args: {
        id: {
            type: GraphQLString
        }
    },
    resolve: (_: any, args: any) => {
        return Comment.find().exec();
    }
};
