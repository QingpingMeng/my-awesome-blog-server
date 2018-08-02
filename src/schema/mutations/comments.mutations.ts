import { GraphQLString } from 'graphql';
import CommentType, { CommentInputType }  from '../types/comment.type';

export const deleteComment = {
    type: CommentType,
    args: {
        id: {
            type: GraphQLString
        }
    },
    resolve: (_: any, args: any) => {
    }
};

export const createComment = {
    type: CommentType,
    args: {
        comment: {
            type: CommentInputType
        }
    },
    resolve: () => {
    }
};

export const updateComment = {
    type: CommentType,
    args: {
        id: {
            type: GraphQLString
        }
    },
    resolve: (_: any, args: any) => {
    }
};
