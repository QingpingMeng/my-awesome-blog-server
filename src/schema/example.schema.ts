// schema.js
import { GraphQLObjectType, GraphQLSchema, GraphQLInt } from 'graphql';

const count = 0;

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            count: {
                type: GraphQLInt,
                resolve: function() {
                    return count;
                }
            }
        }
    })
});

export default schema;
