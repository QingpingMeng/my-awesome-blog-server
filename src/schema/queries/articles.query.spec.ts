import { Article, IArticleAttribute } from '../../models/articles.model';
import { connect, Mongoose } from 'mongoose';
import MongodbMemoryServer from 'mongodb-memory-server';
import { queryArticles, queryArticle } from '../queries/articles.query';
// import { UserError } from '../../errors/userError';
import {
    createArticle,
    addCommentToArticle
} from '../mutations/articles.mutations';
import { createUser } from '../mutations/users.mutations';

let mongod: MongodbMemoryServer;
let db: Mongoose;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

const exampleArticle = {
    title: 'test title',
    summary: 'test body',
    body: 'test summary'
};

const exampleComment = {
    body: 'comment'
};

const exampleUser = {
    username: 'testing',
    email: 'test@example.com',
    avatar: 'avatar'
};

describe('Articles querst tests', () => {
    beforeAll(async () => {
        console.log('before all');
        mongod = new MongodbMemoryServer();
        const uri = await mongod.getConnectionString();
        console.log(uri);
        db = await connect(uri);
    });

    afterAll(async () => {
        await Promise.all([db.connection.close(), mongod.stop]);
    });

    beforeEach(async () => {
        await db.connection.dropDatabase();
    });

    it('should query all articles', async () => {
        // arrange
        const [obj1, obj2] = await Promise.all([
            createArticle.resolve(undefined, {
                article: exampleArticle
            }),
            createArticle.resolve(undefined, {
                article: exampleArticle
            })
        ]);

        // action
        const articles = await queryArticles.resolve(undefined);

        // asert
        expect(articles.length).toBe(2);
    });

    it('should find one article', async () => {
        // arrange
        const user = await createUser.resolve(undefined, {
            user: exampleUser
        });
        const obj1 = await createArticle.resolve(undefined, {
            article: exampleArticle
        });

        const comment = await addCommentToArticle.resolve(undefined, {
            slug: obj1.slug,
            comment: exampleComment
        });

        // action
        const article = await queryArticle.resolve(undefined, {
            condition: JSON.stringify({ slug: obj1.slug })
        });

        // asert
        expect(article.body).toEqual(exampleArticle.body);
        expect(article.comments.length).toBe(1);
    });
});
