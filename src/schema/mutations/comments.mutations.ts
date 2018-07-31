import { GraphQLString } from 'graphql';
import CommentType, { CommentInputType }  from '../types/comment.type';
import { dummyComments } from '../queries/comments.query';
import ArticleType from '../types/article.type';

export const deleteComment = {
    type: CommentType,
    args: {
        id: {
            type: GraphQLString
        }
    },
    resolve: (_: any, args: any) => {
        const result = dummyComments[0];
        dummyComments.splice(0, 1);
        return result;
    }
};

export const createComment = {
    type: ArticleType,
    args: {
        comment: {
            type: CommentInputType
        }
    },
    resolve: () => {
        const result = dummyComments[0];
        dummyComments.splice(0, 1);
        return result;
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
        const result = dummyComments[0];
        result.content = 'new conent';
        return result;
    }
};
