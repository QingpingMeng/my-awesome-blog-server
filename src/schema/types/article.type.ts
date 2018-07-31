import { GraphQLObjectType, GraphQLString, GraphQLInputObjectType, GraphQLID } from 'graphql';
import { Required, List } from '../definition';
import UserType, { UserInputType } from './user.type';
import CommentType, { CommentInputType } from './comment.type';

const ArticleType = new GraphQLObjectType({
    name: 'Article',
    fields: () => ({
        id: {
            type: Required(GraphQLID)
        },
        title: {
            type: Required(GraphQLString)
        },
        summary: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        },
        author: {
            type: Required(UserType)
        },
        comments: {
            type: List(CommentType)
        }
    })
});

export const ArticleInputType = new GraphQLInputObjectType({
    name: 'Article',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        title: {
            type: GraphQLString
        },
        summary: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        },
        author: {
            type: UserInputType
        },
        comments: {
            type: List(CommentInputType)
        }
    })
});

export default ArticleType;
