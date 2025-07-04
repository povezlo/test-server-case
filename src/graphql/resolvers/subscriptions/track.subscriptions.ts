import { FastifyInstance } from 'fastify';
import * as db from '../../../utils/db';
import { Track } from '../../../types';

interface ActiveTrackPayload {
  activeTrack: {
    id: string;
    title: string;
    artist: string;
    audioFile?: string;
  } | null;
}

let activeTrack: ActiveTrackPayload['activeTrack'] = null;

async function getRandomTrack(server: FastifyInstance): Promise<ActiveTrackPayload['activeTrack']> {
  try {
    const { tracks } = await db.getTracks({});
    
    const tracksWithAudio = tracks.filter((track: Track) => track.audioFile && track.audioFile.trim() !== '');
    
    if (tracksWithAudio.length === 0) {
      console.log('No tracks with audio files found');
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * tracksWithAudio.length);
    const track = tracksWithAudio[randomIndex];
    
    return {
      id: track.id,
      title: track.title,
      artist: track.artist,
      audioFile: track.audioFile
    };
  } catch (error) {
    console.error('Error getting random track:', error);
    return null;
  }
}

export function startActiveTrackInterval(server: FastifyInstance) {
  const changeActiveTrack = async () => {
    try {
      activeTrack = await getRandomTrack(server);
      
      server.graphql.pubsub.publish({
        topic: 'ACTIVE_TRACK_CHANGED',
        payload: { activeTrack }
      });
      
      console.log('Active track changed to:', activeTrack?.title || 'null');
    } catch (error) {
      console.error('Error in active track interval:', error);
    }
    
    setTimeout(changeActiveTrack, Math.floor(Math.random() * 10000) + 10000);
  };
  
  setTimeout(changeActiveTrack, 10000);
}

export const trackSubscriptions = {
  activeTrack: {
    subscribe: async (_: any, __: any, { pubsub }: any) => {
      return await pubsub.subscribe('ACTIVE_TRACK_CHANGED');
    }
  }
}; 