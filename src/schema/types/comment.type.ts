import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInputObjectType,
    GraphQLID,
} from 'graphql';
import { Required } from '../definition';
import UserType, { UserInputType } from './user.type';

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
        id: {
            type: Required(GraphQLID)
        },
        content: {
            type: GraphQLString
        },
        author: {
            type: UserType
        }
    })
});

export const CommentInputType = new GraphQLInputObjectType({
    name: 'CommentInput',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        content: {
            type: GraphQLString
        },
        author: {
            type: UserInputType
        }
    })
});

export default CommentType;
