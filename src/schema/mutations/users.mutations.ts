import UserType, { UserInputType } from '../types/user.type';
import { User, IUserAttributes } from '../../models/user.model';
import { updateObjectWith } from '../../utils/updateObjectWith';

const allowedKeys = ['email', 'username', 'avatar'];

export const createUser = {
    type: UserType,
    args: {
        user: { type: UserInputType }
    },
    resolve: async (_: any, args: { user: IUserAttributes }) => {
        let user = new User();
        user = updateObjectWith(user, args.user, allowedKeys);
        return await user.save();
    }
};
