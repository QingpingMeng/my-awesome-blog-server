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
import { IUserModel } from '../../models/user.model';
import { UserError } from '../../errors/userError';

let mongod: MongodbMemoryServer;
let db: Mongoose;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

const exampleArticle = {
    title: 'test title',
    summary: 'test body',
    body: 'test summary',
    isDraft: false,
    jsonBody: '{}'
};

const exampleComment = {
    body: 'comment'
};

const exampleUser = {
    username: 'testing',
    email: 'test@example.com',
    avatar: 'avatar',
    githubId: 'github'
};

let userTest: IUserModel;
let context: {
    userPayload: {
        id: string;
    };
};

describe('Articles querst tests', () => {
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

    it('should query all articles', async () => {
        // arrange
        const [obj1, obj2] = await Promise.all([
            createArticle.resolve(
                undefined,
                {
                    article: exampleArticle
                },
                context
            ),
            createArticle.resolve(
                undefined,
                {
                    article: exampleArticle
                },
                context
            )
        ]);

        // action
        const articles = await queryArticles.resolve(undefined);

        // asert
        expect(articles.length).toBe(2);
    });

    it('should find one article', async () => {
        // arrange
        const obj1 = await createArticle.resolve(
            undefined,
            {
                article: exampleArticle
            },
            context
        );

        const comment = await addCommentToArticle.resolve(
            undefined,
            {
                slug: obj1.slug,
                comment: exampleComment
            },
            context
        );

        // action
        const article = await queryArticle.resolve(
            undefined,
            {
                condition: JSON.stringify({ slug: obj1.slug })
            },
            undefined
        );

        // assert
        expect(article.body).toEqual(exampleArticle.body);
        expect(article.comments.length).toBe(1);
    });

    it('should not return draft to unauthorized user', async () => {
        // arrange
        const draft = { ...exampleArticle, isDraft: true };
        const obj1 = await createArticle.resolve(
            undefined,
            {
                article: draft
            },
            context
        );

        // action
        try {
            const article = await queryArticle.resolve(
                undefined,
                {
                    condition: JSON.stringify({ slug: obj1.slug })
                },
                undefined
            );
            fail('Should throw UnauthorizedError');
        } catch (err) {
            // assert
            const userError = err as UserError;
            expect(userError.code).toBe(401);
            expect(userError.isUserError).toBe(true);
        }
    });

    it('should not return draft to non author', async () => {
        // arrange
        const draft = { ...exampleArticle, isDraft: true };
        const obj1 = await createArticle.resolve(
            undefined,
            {
                article: draft
            },
            context
        );

        // action
        try {
            const article = await queryArticle.resolve(
                undefined,
                {
                    condition: JSON.stringify({ slug: obj1.slug })
                },
                {
                    userPayload: {
                        id: '123'
                    }
                }
            );
            fail('Should throw ForbiddenError');
        } catch (err) {
            // assert
            const userError = err as UserError;
            expect(userError.code).toBe(403);
            expect(userError.isUserError).toBe(true);
        }
    });
});
