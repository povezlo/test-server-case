import { readFileSync, existsSync } from 'fs';
import path from 'path';
import config from '../../../config';
import { Genre } from '../../../types/graphql';

function loadGenres(): Genre[] {
  const genresPath = path.join(config.storage.dataDir, 'genres.json');
  
  if (!existsSync(genresPath)) {
    return [];
  }
  
  const data = readFileSync(genresPath, 'utf-8');
  const genreNames = JSON.parse(data) as string[];
  
  // Преобразуем простой массив строк в объекты жанров
  return genreNames.map((name, index) => ({
    id: (index + 1).toString(),
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]/gi, '-'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

export const genreQueries = {
  genres: (): Genre[] => {
    return loadGenres();
  },

  genre: (_: unknown, { id }: { id: string }): Genre | null => {
    const genres = loadGenres();
    return genres.find(genre => genre.id === id) || null;
  },

  genreBySlug: (_: unknown, { slug }: { slug: string }): Genre | null => {
    const genres = loadGenres();
    return genres.find(genre => genre.slug === slug) || null;
  },
}; 