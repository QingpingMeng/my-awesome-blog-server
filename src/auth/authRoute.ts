import express from 'express';
import axios from 'axios';
import { User } from '../models/user.model';

const authRouter = express.Router();

interface GithubProfile {
    id: string;
    emails: { value: string }[];
    photos: { value: string }[];
    username: string;
}

authRouter.post('/signin', async (req, res, next) => {
    const github_code = req.body.code;
    console.log(req);
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
        const { data: profile } = await axios.get<GithubProfile>(
            'https://api.github.com/user',
            {
                headers: {
                    Authorization: `token ${response.data.access_token}`
                }
            }
        );

        const user = await User.findOne({ githubId: profile.id }).exec();
        if (!user) {
            let newUser = new User();
            newUser.githubId = profile.id;
            newUser.email = profile.emails[0].value;
            newUser.username = profile.username;
            newUser.avatar =
                profile.photos && profile.photos[0] && profile.photos[0].value;
            try {
                newUser = await newUser.save();
                res.json(newUser.toAuthJSON());
            } catch (err) {
                res.status(401).end();
            }
        } else {
            res.json(user.toAuthJSON());
        }
    } catch {
        console.log('catch');
        res.status(401).end();
    }
});

export default authRouter;
