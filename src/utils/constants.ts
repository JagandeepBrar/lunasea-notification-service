export const MESSAGE = {
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  NO_ID_SUPPLIED: 'No ID Supplied',
  NO_DEVICES_FOUND: 'No Devices Found',
  OK: 'OK',
  USER_NOT_FOUND: 'Invalid User ID',
};

export const REDIS = {
  EXPIRE: {
    MODE: 'EX', // Seconds
    TTL: 60 * 60 * 12, // 12 Hours
  },
  KEY_PREFIX: 'LUNA',
};

export const THE_MOVIE_DB = {
  API: {
    BASE_URL: 'https://api.themoviedb.org/3/',
  },
  IMAGE: {
    BASE_URL: 'https://image.tmdb.org/t/p/',
    SIZE: 'w780',
  },
};
