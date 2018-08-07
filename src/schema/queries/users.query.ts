import { GraphQLString } from 'graphql';
import { List } from '../definition';
import userType from '../types/user.type';
import { RequestWithDb } from '../../utils/db';
import { User } from '../../models/user.model';

export const userById = {
    type: userType,
    args: {
        id: {
            type: GraphQLString
        }
    },
    resolve: (_: any, { id }: { id: string }) => {
        return User.findOne(id).exec();
    }
};

export const currentUser = {
    type: userType,
    resolve: (_: any, args?: any, context?: any) => {
        if (context && context.userPayload) {
            return User.findOne(context.userPayload.id).exec();
        }

        return undefined;
    }
};
