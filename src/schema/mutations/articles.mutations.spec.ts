import {
    createArticle,
    updateArticle,
    IArticleInput,
    deleteArticle,
    addCommentToArticle
} from './articles.mutations';
import { Article, IArticleAttribute } from '../../models/articles.model';
import { connect, Mongoose } from 'mongoose';
import MongodbMemoryServer from 'mongodb-memory-server';
import { queryArticles } from '../queries/articles.query';
import { UserError } from '../../errors/userError';
import { createUser } from './users.mutations';
import { IUserModel } from '../../models/user.model';

let mongod: MongodbMemoryServer;
let db: Mongoose;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

const exampleUser = {
    username: 'testing',
    email: 'test@example.com',
    avatar: 'avatar',
    githubId: 'github'
};

const exampleArticle = {
    title: 'test title',
    summary: 'test body',
    jsonBody : 'json boyd',
    body: 'test summary'
};

const exampleComment = {
    body: 'comment'
};

let userTest: IUserModel;
let context: {
    userPayload: {
        id: string;
    };
};

describe('Articles mutation test', () => {
    beforeAll(async () => {
        mongod = new MongodbMemoryServer();
        const uri = await mongod.getConnectionString();
        db = await connect(uri);
    });

    afterAll(async () => {
        await Promise.all([db.connection.close(), mongod.stop]);
    });

    beforeEach(async () => {
        await db.connection.dropDatabase();
        userTest = await createUser.resolve(undefined, { user: exampleUser });
        context = {
            userPayload: {
                id: userTest.id
            }
        };
    });

    it('should create an article', async () => {
        // arrange
        const article = {
            title: 'test title',
            summary: 'test body',
            body: 'test summary',
            jsonBody: 'jsonBody'
        };

        // action
        const obj = await createArticle.resolve(
            undefined,
            {
                article: article
            },
            { userPayload: { id: userTest.id }, context }
        );

        // assert
        expect(obj.summary).toEqual(article.summary);
        expect(obj.body).toEqual(article.body);
        expect(obj.title).toEqual(article.title);
        expect(obj.id).not.toBeNull();
        expect(obj.slug).not.toBeNull();
    });

    it('should update an article', async () => {
        // arange
        const article = {
            title: 'test title',
            summary: 'test body',
            body: 'test summary',
            jsonBody: 'test josn body'
        };
        const obj = await createArticle.resolve(
            undefined,
            {
                article: article
            },
            context
        );

        const updatedArticle: IArticleInput = {
            article: {
                title: 'title after',
                summary: 'summary after',
                body: 'body after',
                jsonBody: 'jsonBody after',
                slug: obj.slug
            }
        };

        const exsitingArticle = await updateArticle.resolve(
            undefined,
            updatedArticle,
            context
        );
        expect(exsitingArticle.title).toEqual('title after');
        expect(exsitingArticle.summary).toEqual('summary after');
        expect(exsitingArticle.body).toEqual('body after');
        expect(exsitingArticle.id).not.toEqual('whatever');
    });

    it('should delete an article', async () => {
        const article = {
            title: 'test title',
            summary: 'test body',
            body: 'test summary',
            jsonBody: 'json body'
        };
        const obj = await createArticle.resolve(
            undefined,
            {
                article: article
            },
            context
        );

        const result = await deleteArticle.resolve(
            undefined,
            { slug: obj.slug },
            context
        );
        expect(result.id).toEqual(obj.id);

        const articles = await queryArticles.resolve(undefined, undefined);
        expect(articles.length).toBe(0);
    });

    it('should not delete non-exist artilce', async () => {
        try {
            await deleteArticle.resolve(undefined, { slug: 'test' }, context);
            fail('UserError expected but not found');
        } catch (err) {
            const userErr = err as UserError;
            expect(userErr.code).toBe(404);
            expect(userErr.isUserError).toBe(true);
        }
    });

    it('should not update non-exist artilce', async () => {
        try {
            await updateArticle.resolve(
                undefined,
                {
                    article: {
                        title: 'title after',
                        summary: 'summary after',
                        body: 'body after',
                        jsonBody: 'jsonBody',
                        id: '1234'
                    }
                },
                context
            );
            fail('UserError expected but not found');
        } catch (err) {
            const userErr = err as UserError;
            expect(userErr.code).toBe(404);
            expect(userErr.isUserError).toBe(true);
        }
    });

    it('should add comment to article', async () => {
        // arrange
        const [_, article] = await Promise.all([
            createUser.resolve(undefined, { user: exampleUser }),
            createArticle.resolve(
                undefined,
                { article: exampleArticle },
                context
            )
        ]);

        // action
        const result = await addCommentToArticle.resolve(
            undefined,
            {
                slug: article.slug,
                comment: exampleComment
            },
            context
        );

        // assert
        expect(result.body).toEqual(exampleComment.body);
    });
});
