import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import path from 'path';
import { resolvers } from './resolvers';

// Загружаем все GraphQL файлы
const typesArray = loadFilesSync(path.join(__dirname, 'typeDefs'), {
  extensions: ['graphql'],
});

// Объединяем все типы
const typeDefs = mergeTypeDefs(typesArray);

// Создаем исполняемую схему
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
}); 