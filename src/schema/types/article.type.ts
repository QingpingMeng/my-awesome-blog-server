import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInputObjectType,
    GraphQLID,
    GraphQLBoolean
} from 'graphql';
import { Required, List } from '../definition';
import UserType, { UserInputType } from './user.type';
import CommentType, { CommentInputType } from './comment.type';
import { IArticleModel } from '../../models/articles.model';
import truncate from 'truncate-html';

const ArticleType = new GraphQLObjectType({
    name: 'Article',
    fields: () => ({
        slug: {
            type: Required(GraphQLString)
        },
        id: {
            type: Required(GraphQLID)
        },
        title: {
            type: Required(GraphQLString)
        },
        summary: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        },
        previewBody: {
            type: GraphQLString,
            resolve: (article: IArticleModel) => {
                return truncate(article.body, 100, {
                    byWords: true,
                });
            }
        },
        jsonBody: {
            type: GraphQLString
        },
        author: {
            type: Required(UserType),
            resolve: async (article: IArticleModel) => {
                const populatedArticle = await article
                .populate('author').execPopulate();
                return populatedArticle.author;
            }
        },
        createdAt: {
            type: GraphQLString
        },
        updatedAt: {
            type: GraphQLString
        },
        isDraft: {
            type: GraphQLBoolean
        },
        comments: {
            type: List(CommentType),
            resolve: async (article: IArticleModel) => {
                const populatedArticle = await article
                    .populate({
                        path: 'comments',
                        populate: {
                            path: 'author'
                        },
                        options: {
                            sort: {
                                createdAt: 'desc'
                            }
                        }
                    })
                    .execPopulate();
                return populatedArticle.comments;
            }
        }
    })
});

export const ArticleInputType = new GraphQLInputObjectType({
    name: 'ArticleInput',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        slug: {
            type: GraphQLID
        },
        title: {
            type: GraphQLString
        },
        summary: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        },
        jsonBody: {
            type: GraphQLString
        },
        isDraft: {
            type: GraphQLBoolean
        },
        author: {
            type: UserInputType
        },
        comments: {
            type: List(CommentInputType)
        }
    })
});

export default ArticleType;
