import express from 'express';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
import lusca from 'lusca';
import dotenv from 'dotenv';
import schema from './schema';
import graphqlHTTP from 'express-graphql';
import { connectToDb } from './utils/db';
import { UserError } from './errors/userError';

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: '.env.example' });

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(connectToDb);

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        graphiql: true,
        formatError(err) {
            const userError = err.originalError as UserError;
            return {
                message: err.message,
                code: err.originalError && userError && userError.code, // <--
                locations: err.locations,
                isUserError: err.originalError && userError && userError.isUserError,
                path: err.path
            };
        }
    })
);

export default app;
