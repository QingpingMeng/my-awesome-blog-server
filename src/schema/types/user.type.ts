import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInputObjectType,
    GraphQLID
} from 'graphql';
import { Required } from '../definition';

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {
            type: Required(GraphQLID),
            resolve: (article) => {
                return article._id;
            }
        },
        githubId: {
            type: Required(GraphQLID),
        },
        username: {
            type: Required(GraphQLString)
        },
        email: {
            type: Required(GraphQLString)
        },
        avatar: {
            type: GraphQLString
        },
        isGuestUser: {
            type: GraphQLBoolean
        },
        isBlogOwner: {
            type: GraphQLBoolean
        }
    })
});

export const UserInputType = new GraphQLInputObjectType({
    name: 'UserInput',
    fields: () => ({
        username: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        avatar: {
            type: GraphQLString
        },
        githubId: {
            type: GraphQLID,
        },
        isGuestUser: {
            type: GraphQLBoolean
        },
        isBlogOwner: {
            type: GraphQLBoolean
        }
    })
});

export default UserType;
