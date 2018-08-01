import { createArticle } from './articles.mutations';
import { Article } from '../../models/articles.model';
import { connect, Mongoose } from 'mongoose';
import MongodbMemoryServer from 'mongodb-memory-server';

const dbUri = 'mongodb://server:server01@ds159631.mlab.com:59631/blog-dev';

let mongod: MongodbMemoryServer;
let db: Mongoose;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('Articles mutation test', () => {
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

    it('should create an article', async () => {
        const article = new Article();
        article.title = 'test title';
        article.body = 'test body';
        article.summary = 'test summary';
        const obj = await createArticle.resolve(undefined, {
            article: article
        });
        expect(obj.summary).toEqual(article.summary);
    });
});
