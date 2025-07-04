import { genreQueries } from './queries/genre.queries';
import { trackQueries } from './queries/track.queries';
import { trackMutations } from './mutations/track.mutations';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { trackSubscriptions } from './subscriptions/track.subscriptions';

export const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    ...genreQueries,
    ...trackQueries,
  },
  Mutation: {
    ...trackMutations,
  },
  Subscription: {
    ...trackSubscriptions,
  },
}; 