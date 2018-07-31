import express from 'express';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
import lusca from 'lusca';
import dotenv from 'dotenv';
import schema from './schema';
import graphqlHTTP from 'express-graphql';
import { connectToDb } from './utils/db';

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
        schema:  schema,
        graphiql: true
    })
);

export default app;
