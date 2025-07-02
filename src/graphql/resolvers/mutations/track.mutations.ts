import { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import path from 'path';
import config from '../../../config';
import { createSlug } from '../../../utils/slug';
import { Track, TrackCreateInput, TrackUpdateInput, BulkDeleteResponse } from '../../../types/graphql';

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

function loadTrack(id: string): Track | null {
  const trackPath = path.join(config.storage.dataDir, 'tracks', `${id}.json`);
  
  if (!existsSync(trackPath)) {
    return null;
  }
  
  const data = readFileSync(trackPath, 'utf-8');
  const track = JSON.parse(data);
  
  // Преобразуем старый формат в новый, если необходимо
  return {
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
}

function saveTrack(track: Track): void {
  const trackPath = path.join(config.storage.dataDir, 'tracks', `${track.id}.json`);
  writeFileSync(trackPath, JSON.stringify(track, null, 2));
}

function deleteTrackFile(id: string): void {
  const trackPath = path.join(config.storage.dataDir, 'tracks', `${id}.json`);
  if (existsSync(trackPath)) {
    unlinkSync(trackPath);
  }
}

export const trackMutations = {
  createTrack: (_: unknown, { input }: { input: TrackCreateInput }): Track => {
    const now = new Date().toISOString();
    const id = Date.now().toString();
    const slug = createSlug(`${input.artist} ${input.title}`);
    
    const track: Track = {
      id,
      title: input.title,
      artist: input.artist,
      album: input.album,
      genres: input.genres,
      slug,
      coverImage: input.coverImage,
      audioFile: undefined,
      createdAt: now,
      updatedAt: now,
    };
    
    saveTrack(track);
    return track;
  },

  updateTrack: (_: unknown, { id, input }: { id: string; input: TrackUpdateInput }): Track => {
    const track = loadTrack(id);
    if (!track) {
      throw new Error(`Track with id ${id} not found`);
    }
    
    const updatedTrack: Track = {
      ...track,
      title: input.title ?? track.title,
      artist: input.artist ?? track.artist,
      album: input.album !== undefined ? input.album : track.album,
      genres: input.genres ?? track.genres,
      coverImage: input.coverImage !== undefined ? input.coverImage : track.coverImage,
      updatedAt: new Date().toISOString(),
    };
    
    // Обновляем slug, если изменились artist или title
    if (input.title || input.artist) {
      updatedTrack.slug = createSlug(`${updatedTrack.artist} ${updatedTrack.title}`);
    }
    
    saveTrack(updatedTrack);
    return updatedTrack;
  },

  deleteTrack: (_: unknown, { id }: { id: string }): boolean => {
    const track = loadTrack(id);
    if (!track) {
      throw new Error(`Track with id ${id} not found`);
    }
    
    deleteTrackFile(id);
    return true;
  },

  deleteTracks: (_: unknown, { ids }: { ids: string[] }): BulkDeleteResponse => {
    const successIds: string[] = [];
    const failedIds: string[] = [];
    const errors: Array<{ message: string; code?: string; field?: string; }> = [];
    
    for (const id of ids) {
      try {
        const track = loadTrack(id);
        if (!track) {
          failedIds.push(id);
          errors.push({ message: `Track with id ${id} not found`, code: 'TRACK_NOT_FOUND', field: 'id' });
          continue;
        }
        
        deleteTrackFile(id);
        successIds.push(id);
      } catch (error) {
        failedIds.push(id);
        errors.push({ 
          message: `Failed to delete track ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`, 
          code: 'DELETE_FAILED', 
          field: 'id' 
        });
      }
    }
    
    return {
      success: failedIds.length === 0,
      successIds,
      failedIds,
      errors,
    };
  },

  uploadTrackFile: (_: unknown, { id, file }: { id: string; file: any }): Track => {
    const track = loadTrack(id);
    if (!track) {
      throw new Error(`Track with id ${id} not found`);
    }
    
    // Простая заглушка для демонстрации
    // В реальном приложении здесь будет логика сохранения файла
    const audioFileName = `${id}_audio.mp3`;
    
    const updatedTrack: Track = {
      ...track,
      audioFile: `${audioFileName}`,
      updatedAt: new Date().toISOString(),
    };
    
    saveTrack(updatedTrack);
    return updatedTrack;
  },

  deleteTrackFile: (_: unknown, { id }: { id: string }): Track => {
    const track = loadTrack(id);
    if (!track) {
      throw new Error(`Track with id ${id} not found`);
    }
    
    const updatedTrack: Track = {
      ...track,
      audioFile: undefined,
      updatedAt: new Date().toISOString(),
    };
    
    saveTrack(updatedTrack);
    return updatedTrack;
  },
}; 