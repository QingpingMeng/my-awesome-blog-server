import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { commentsQuery as comments } from './queries/comments.query';
import { articles } from './queries/articles.query';
import { users } from './queries/users.query';
import * as commentMutations from './mutations/comments.mutations';
import * as articlesMutations from './mutations/comments.mutations';

const query = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        comments,
        articles,
        users
    }
});

const mutation = new GraphQLObjectType({
    name: 'RootMutation',
    fields: () => ({
        ...commentMutations,
        ...articlesMutations
    })
});

const schema = new GraphQLSchema({
    query,
    mutation
});

export default schema;
