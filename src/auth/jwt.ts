import jwt from 'express-jwt';

export const authType = {
    required: jwt({
        secret: process.env.PRIVATE_SECRET,
        userProperty: 'userPayload',
    }),
    optional: jwt({
        secret: process.env.PRIVATE_SECRET,
        userProperty: 'userPayload',
        credentialsRequired: false
    })
};
