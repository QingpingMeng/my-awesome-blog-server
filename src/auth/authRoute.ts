import express from 'express';
import axios from 'axios';
import { User } from '../models/user.model';

const authRouter = express.Router();

interface GithubProfile {
    id: string;
    email: string;
    avatar_url: string;
    name: string;
}

authRouter.post('/signin', async (req, res, next) => {
    console.log('sign in started');
    const github_code = req.body.code;
    try {
        const response = await axios.post(
            `https://github.com/login/oauth/access_token?client_id=${
                process.env.GITHUB_CLIENT_ID
            }&client_secret=${process.env.GITHUB_SECRET}&code=${github_code}`,
            undefined,
            {
                headers: {
                    Accept: 'application/json'
                }
            }
        );
        console.log('github response received');
        const { data: profile } = await axios.get<GithubProfile>(
            'https://api.github.com/user',
            {
                headers: {
                    Authorization: `token ${response.data.access_token}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            }
        );
        console.log('github profile received', profile);

        if (profile.email != 'missing1989@gmail.com') {
            res.status(403).send('User not allowed');
        }

        const user = await User.findOne({ githubId: profile.id }).exec();
        console.log('user find completed', user);
        if (!user) {
            let newUser = new User();
            newUser.githubId = profile.id;
            newUser.email = profile.email;
            newUser.username = profile.name;
            newUser.avatar = profile.avatar_url;
            try {
                newUser = await newUser.save();
                console.log('new user registered');
                res.json(newUser.toAuthJSON());
            } catch (err) {
                console.log('new user registration failed');
                res.status(401).end();
            }
        } else {
            console.log('sign in completed');
            res.json(user.toAuthJSON());
        }
    } catch (err) {
        console.log('sign in failed', err);
        res.status(401).end();
    }
});

export default authRouter;
