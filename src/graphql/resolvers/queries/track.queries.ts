import { readdirSync, readFileSync, existsSync } from 'fs';
import path from 'path';
import config from '../../../config';
import { 
  Genre, 
  Track, 
  TracksFilterInput, 
  TracksSortInput, 
  PaginationInput, 
  TracksInput, 
  PageInfo, 
  TracksConnection 
} from '../../../types/graphql';

function loadGenres(): Genre[] {
  const genresPath = path.join(config.storage.dataDir, 'genres.json');
  
  if (!existsSync(genresPath)) {
    return [];
  }
  
  const data = readFileSync(genresPath, 'utf-8');
  return JSON.parse(data);
}

function loadTracks(): Track[] {
  const tracksDir = path.join(config.storage.dataDir, 'tracks');
  
  if (!existsSync(tracksDir)) {
    return [];
  }
  
  const files = readdirSync(tracksDir).filter(file => file.endsWith('.json'));
  const tracks: Track[] = [];
  
  for (const file of files) {
    const filePath = path.join(tracksDir, file);
    const data = readFileSync(filePath, 'utf-8');
    const track = JSON.parse(data);
    
    // Преобразуем старый формат в новый, если необходимо
    const convertedTrack: Track = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album,
      genres: Array.isArray(track.genres) ? track.genres : [track.genreId || 'unknown'],
      slug: track.slug,
      coverImage: track.coverImage,
      audioFile: track.audioFile || track.filePath,
      createdAt: track.createdAt,
      updatedAt: track.updatedAt,
    };
    
    tracks.push(convertedTrack);
  }
  
  return tracks;
}

export const trackQueries = {
  tracks: (_: unknown, { input }: { input?: TracksInput }): TracksConnection => {
    const tracks = loadTracks();
    
    let filteredTracks = tracks;
    
    // Применяем фильтры
    if (input?.filter?.genre) {
      filteredTracks = filteredTracks.filter(track => 
        track.genres.includes(input.filter!.genre!)
      );
    }
    
    if (input?.filter?.artist) {
      const artistLower = input.filter.artist.toLowerCase();
      filteredTracks = filteredTracks.filter(track => 
        track.artist.toLowerCase().includes(artistLower)
      );
    }
    
    if (input?.filter?.search) {
      const searchLower = input.filter.search.toLowerCase();
      filteredTracks = filteredTracks.filter(track => 
        track.title.toLowerCase().includes(searchLower) ||
        track.artist.toLowerCase().includes(searchLower) ||
        (track.album?.toLowerCase().includes(searchLower)) ||
        track.genres.some(genre => genre.toLowerCase().includes(searchLower))
      );
    }
    
    // Применяем сортировку
    const sortField = input?.sort?.field || 'CREATED_AT';
    const sortOrder = input?.sort?.order || 'DESC';
    
    filteredTracks.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'TITLE':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'ARTIST':
          aValue = a.artist;
          bValue = b.artist;
          break;
        case 'ALBUM':
          aValue = a.album || '';
          bValue = b.album || '';
          break;
        case 'UPDATED_AT':
          aValue = a.updatedAt;
          bValue = b.updatedAt;
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }
      
      if (typeof aValue === 'string') {
        return sortOrder === 'ASC' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'ASC' ? aValue - bValue : bValue - aValue;
      }
    });
    
    const total = filteredTracks.length;
    const page = input?.pagination?.page || 1;
    const limit = input?.pagination?.limit || 10;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    
    // Применяем пагинацию
    const paginatedTracks = filteredTracks.slice(offset, offset + limit);
    
    return {
      data: paginatedTracks,
      pageInfo: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  },

  track: (_: unknown, { id }: { id: string }): Track | null => {
    const tracks = loadTracks();
    return tracks.find(t => t.id === id) || null;
  },

  trackBySlug: (_: unknown, { slug }: { slug: string }): Track | null => {
    const tracks = loadTracks();
    return tracks.find(t => t.slug === slug) || null;
  },
}; 