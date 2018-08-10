import dotenv from 'dotenv';
// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: '.env.test' });

import express from 'express';
import cors from 'cors';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
import lusca from 'lusca';
import schema from './schema';
import graphqlHTTP from 'express-graphql';
import { connectToDb } from './utils/db';
import { UserError } from './errors/userError';
import { authType } from './auth/jwt';
import authRouter from './auth/authRoute';

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(cors());
app.options('*', cors()); // enable pre-flight request for DELETE request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(connectToDb);

app.use(authRouter);

app.use(
    '/graphql',
    authType.optional,
    graphqlHTTP({
        schema: schema,
        graphiql: true,
        formatError(err) {
            const userError = err.originalError as UserError;
            return {
                message: err.message,
                code: err.originalError && userError && userError.code,
                locations: err.locations,
                isUserError:
                    err.originalError && userError && userError.isUserError,
                path: err.path
            };
        }
    })
);

export default app;
