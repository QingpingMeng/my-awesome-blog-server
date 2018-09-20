import jwt from 'express-jwt';
import { Request } from 'express-serve-static-core';

function getTokenFromHeader(req: Request) {
    if (
        (req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Token') ||
        (req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Bearer')
    ) {
        return req.headers.authorization.split(' ')[1];
    }

    return undefined;
}

export const authType = {
    required: jwt({
        secret: process.env.PRIVATE_SECRET || 'thisasecret',
        userProperty: 'userPayload'
    }),
    optional: jwt({
        secret: process.env.PRIVATE_SECRET || 'thisasecret',
        userProperty: 'userPayload',
        credentialsRequired: false,
        getToken: getTokenFromHeader
    })
};
