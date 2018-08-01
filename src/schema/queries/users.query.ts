import { GraphQLString } from 'graphql';
import { List } from '../definition';
import userType from '../types/user.type';
import { RequestWithDb } from '../../utils/db';
import { User } from '../../models/user.model';

export const listUsers = {
    type: List(userType),
    args: {
        query: {
            type: GraphQLString
        }
    },
    resolve:  (_: any, args: any) => {
       return User.find().exec();
    }
};

export const userById = {
    type: userType,
    args: {
        id: {
            type: GraphQLString
        }
    },
    resolve:  (_: any, {id}: {id: string}) => {
        const user =  User.findOne(id).exec();
    }
};
