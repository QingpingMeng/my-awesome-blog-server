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
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from './models/user.model';
import { authType } from './auth/jwt';

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(cors());
// app.options('*', cors()); // enable pre-flight request for DELETE request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(connectToDb);
app.use(passport.initialize());

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_SECRET,
            callbackURL: 'http://localhost:3000/auth/github/callback'
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: any,
            done: any
        ) => {
            const user = await User.findOne({ githubId: profile.id }).exec();
            if (!user) {
                let newUser = new User();
                newUser.githubId = profile.id;
                newUser.email = profile.emails[0].value;
                newUser.username = profile.username;
                newUser.avatar =
                    profile.photos &&
                    profile.photos[0] &&
                    profile.photos[0].value;
                try {
                    newUser = await newUser.save();
                    return done(undefined, newUser.toAuthJSON());
                } catch (err) {
                    return done(err);
                }
            } else {
                return done(undefined, user.toAuthJSON());
            }
        }
    )
);

app.get(
    '/auth/github',
    passport.authenticate('github', { scope: ['user:email'], session: false })
);
app.get(
    '/auth/github/callback',
    passport.authenticate('github', {
        session: false,
        failureRedirect: '/login'
    }),
    function(req, res) {
        res.redirect('/graphql');
    }
);

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
