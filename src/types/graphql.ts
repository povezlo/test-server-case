export interface Genre {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  slug: string;
  coverImage?: string;
  audioFile?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TracksFilterInput {
  search?: string;
  genre?: string;
  artist?: string;
}

export interface TracksSortInput {
  field?: 'TITLE' | 'ARTIST' | 'ALBUM' | 'CREATED_AT' | 'UPDATED_AT';
  order?: 'ASC' | 'DESC';
}

export interface PaginationInput {
  page?: number;
  limit?: number;
}

export interface TracksInput {
  filter?: TracksFilterInput;
  sort?: TracksSortInput;
  pagination?: PaginationInput;
}

export interface PageInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TracksConnection {
  data: Track[];
  pageInfo: PageInfo;
}

export interface TrackCreateInput {
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  coverImage?: string;
}

export interface TrackUpdateInput {
  title?: string;
  artist?: string;
  album?: string;
  genres?: string[];
  coverImage?: string;
}

export interface BulkDeleteResponse {
  success: boolean;
  successIds: string[];
  failedIds: string[];
  errors: Array<{ message: string; code?: string; field?: string; }>;
} 