import { Models } from './';
import { TheMovieDB } from '../../api';
import { Notifications } from '../../utils';

const title = (profile: string, body: string): string =>
  Notifications.generateTitle('Radarr', profile, body);
const moduleKey = 'radarr';

/**
 * Construct a Notifications.Payload based on a download event.
 */
export const download = async (
  data: Models.DownloadEventType,
  profile: string,
): Promise<Notifications.Payload> => {
  const quality = data.movieFile?.quality ? data.movieFile.quality : 'Unknown Quality';
  const body = data.isUpgrade ? `Upgraded (${quality})` : `Downloaded (${quality})`;
  const image = data.movie?.tmdbId ? await TheMovieDB.getMoviePoster(data.movie.tmdbId) : undefined;
  return <Notifications.Payload>{
    title: title(profile, data.movie?.title ?? 'Unknown Movie'),
    body: body,
    image: image,
    data: {
      module: moduleKey,
      profile: profile,
      event: data.eventType,
      id: data.movie?.id?.toString() ?? '-1',
    },
  };
};

/**
 * Construct a Notifications.Payload based on a grab event.
 */
export const grab = async (
  data: Models.GrabEventType,
  profile: string,
): Promise<Notifications.Payload> => {
  const body1 = `Grabbed (${data.release?.quality ?? 'Unknown Quality'})`;
  const body2 = data?.release?.releaseTitle ?? 'Unknown Release';
  const image = data.movie?.tmdbId ? await TheMovieDB.getMoviePoster(data.movie.tmdbId) : undefined;
  return <Notifications.Payload>{
    title: title(profile, data.movie?.title ?? 'Unknown Movie'),
    body: [body1, body2].join('\n'),
    image: image,
    data: {
      module: moduleKey,
      profile: profile,
      event: data.eventType,
      id: data.movie?.id?.toString() ?? '-1',
    },
  };
};

/**
 * Construct a Notifications.Payload based on a health event.
 */
export const health = async (
  data: Models.HealthEventType,
  profile: string,
): Promise<Notifications.Payload> => {
  return <Notifications.Payload>{
    title: title(profile, 'Health Check'),
    body: data.message ?? 'Unknown Message',
    data: {
      module: moduleKey,
      profile: profile,
      event: data.eventType,
    },
  };
};

/**
 * Construct a Notifications.Payload based on a movie delete event.
 */
export const movieDelete = async (
  data: Models.MovieDeleteEventType,
  profile: string,
): Promise<Notifications.Payload> => {
  const image = data.movie?.tmdbId ? await TheMovieDB.getMoviePoster(data.movie.tmdbId) : undefined;
  return <Notifications.Payload>{
    title: title(profile, data.movie?.title ?? 'Unknown Movie'),
    body: `Movie Deleted ${data.deletedFiles ? '(With Files)' : ''}`.trim(),
    image: image,
    data: {
      module: moduleKey,
      profile: profile,
      event: data.eventType,
      id: data.movie?.id?.toString() ?? '-1',
    },
  };
};

/**
 * Construct a Notifications.Payload based on a movie file delete event.
 */
export const movieFileDelete = async (
  data: Models.MovieDeleteEventType,
  profile: string,
): Promise<Notifications.Payload> => {
  const image = data.movie?.tmdbId ? await TheMovieDB.getMoviePoster(data.movie.tmdbId) : undefined;
  return <Notifications.Payload>{
    title: title(profile, data.movie?.title ?? 'Unknown Movie'),
    body: 'Movie File Deleted',
    image: image,
    data: {
      module: moduleKey,
      profile: profile,
      event: data.eventType,
      id: data.movie?.id?.toString() ?? '-1',
    },
  };
};

/**
 * Construct a Notifications.Payload based on a rename event.
 */
export const rename = async (
  data: Models.RenameEventType,
  profile: string,
): Promise<Notifications.Payload> => {
  const image = data.movie?.tmdbId ? await TheMovieDB.getMoviePoster(data.movie.tmdbId) : undefined;
  return <Notifications.Payload>{
    title: title(profile, data.movie?.title ?? 'Unknown Movie'),
    body: 'Files Renamed',
    image: image,
    data: {
      module: moduleKey,
      profile: profile,
      event: data.eventType,
      id: data.movie?.id?.toString() ?? '-1',
    },
  };
};

/**
 * Construct a Notifications.Payload based on a test event.
 */
export const test = async (
  data: Models.TestEventType,
  profile: string,
): Promise<Notifications.Payload> => {
  return <Notifications.Payload>{
    title: title(profile, 'Connection Test'),
    body: 'LunaSea is ready for Radarr notifications!',
    data: {
      module: moduleKey,
      profile: profile,
      event: data.eventType,
    },
  };
};
