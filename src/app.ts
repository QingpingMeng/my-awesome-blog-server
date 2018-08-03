import express from 'express';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
import lusca from 'lusca';
import dotenv from 'dotenv';
import schema from './schema';
import graphqlHTTP from 'express-graphql';
import { connectToDb } from './utils/db';
import { UserError } from './errors/userError';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import session from 'express-session';

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
app.use(passport.initialize());
app.use(passport.session());
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    })
);

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
    done(undefined, user);
});

passport.deserializeUser(function(obj, done) {
    done(undefined, obj);
});

passport.use(
    new GitHubStrategy(
        {
            clientID: 'clientid',
            clientSecret: 'clientsecret',
            callbackURL: 'http://localhost:3000/auth/github/callback'
        },
        (
            accessToken: string,
            refreshToken: string,
            profile: any,
            done: any
        ) => {
            console.log(accessToken, refreshToken);
            console.log('Profile', profile);
            return done(undefined, profile);
        }
    )
);

app.use(
    '/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
);
app.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        console.log(req.isAuthenticated());
        res.redirect('/graphiql');
    }
);

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
                isUserError:
                    err.originalError && userError && userError.isUserError,
                path: err.path
            };
        }
    })
);

export default app;
