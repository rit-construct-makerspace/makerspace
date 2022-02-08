import { GraphQLDateTime } from 'graphql-iso-date';

const customScalarResolver = {
  DateTime: GraphQLDateTime
};

export default customScalarResolver;
