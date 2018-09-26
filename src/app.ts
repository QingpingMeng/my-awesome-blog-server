import express from 'express';
import cors from 'cors';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
import lusca from 'lusca';
import schema from './schema';
import graphqlHTTP from 'express-graphql';
import { UserError } from './errors/userError';
import { authType } from './auth/jwt';
import authRouter from './auth/authRoute';
import { connect } from 'mongoose';

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

app.use(function(req, res, next) {
    res.setHeader('X-PodName', process.env.POD_NAME);
    next();
  });

// connect to db
connect(
    process.env.MONGO_DB_URI || 'localhost:2017',
    { useNewUrlParser: true }
);

app.use(authRouter);

app.use(
    '/graphql',
    authType.optional,
    graphqlHTTP({
        schema: schema,
        graphiql: process.env.NODE_ENV === 'dev' ? true : false,
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
