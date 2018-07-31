import { Mongoose, connect } from 'mongoose';
import {
    Handler,
    Request
} from '../../node_modules/@types/express-serve-static-core';

const dbUri = 'mongodb://server:server01@ds159631.mlab.com:59631/blog-dev';

export interface RequestWithDb extends Request {
    db: Mongoose;
}

export const connectToDb: Handler = async (req: RequestWithDb, res, next) => {
    try {
        const db = await connect(dbUri,  { useNewUrlParser: true });
        console.log('Db connected...');
        req.db = db;
        next();
    } catch (err) {
        console.log('database connection fails', err);
        next(err);
    }
};
