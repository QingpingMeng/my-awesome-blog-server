import {
    GraphQLList, GraphQLNonNull, GraphQLType,
} from 'graphql';

export function List(type: GraphQLType) {
    return new GraphQLList(type);
}

export function Required(type: GraphQLType) {
    return new GraphQLNonNull(type);
}

export type IQueryConditionArg = {
    condition?: string;
};