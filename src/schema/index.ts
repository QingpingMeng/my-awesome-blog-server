import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import * as articleQueries from './queries/articles.query';
import * as usersQueries from './queries/users.query';
import * as commentMutations from './mutations/comments.mutations';
import * as articlesMutations from './mutations/articles.mutations';
import * as usersMutations from './mutations/users.mutations';

const query = new GraphQLObjectType({
    name: 'RootQuery',
    fields: () => ({
        ...articleQueries,
        ...usersQueries
    })
});

const mutation = new GraphQLObjectType({
    name: 'RootMutation',
    fields: () => ({
        ...commentMutations,
        ...articlesMutations,
        ...usersMutations
    })
});

const schema = new GraphQLSchema({
    query,
    mutation
});

export default schema;
