import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInputObjectType,
    GraphQLID
} from 'graphql';
import { Required } from '../definition';
import { resolve } from 'path';

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {
            type: Required(GraphQLID),
            resolve: (article) => {
                return article._id;
            }
        },
        username: {
            type: Required(GraphQLString)
        },
        email: {
            type: Required(GraphQLString)
        },
        avatar: {
            type: GraphQLString,
            resolve: (parent) => {
                return (
                    parent.avatar ||
                    'https://thesocietypages.org/socimages/files/2009/05/nopic_192.gif'
                );
            }
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
        id: {
            type: GraphQLID
        },
        username: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
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

export default UserType;
