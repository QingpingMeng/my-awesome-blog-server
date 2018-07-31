import { GraphQLInt, GraphQLString } from 'graphql';
import { List } from '../definition';
import userType from '../types/user.type';
const dummyUsers = [
   {
       id: 1,
       username: 'user01'
   }
];
export const users = {
    type: List(userType),
    args: {
        id: {
            type: GraphQLString
        }
    },
    resolve: (_: any, args: any, context: any, info: any) => {
        return dummyUsers;
    }
};
