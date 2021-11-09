import { Models } from './';
import { TheMovieDB } from '../../api';
import { Logger, Notifications } from '../../utils';

const title = (profile: string, body: string): string =>
  Notifications.title('Overseerr', profile, body);

/**
 * Construct a Notifications.Payload based on a media approved event.
 */
export const mediaApproved = async (
  data: Models.RequestProperties,
  profile: string,
): Promise<Notifications.Payload> => {
  const body1 = data.subject;
  let body2 = '';
  if (data.username) body2 = `\nOriginally Requested by ${data.username}`;
  if (data.request?.requestedBy_username)
    body2 = `\nOriginally Requested by ${data.request?.requestedBy_username}`;
  const image =
    data.media?.media_type === Models.MediaType.MOVIE
      ? await getMovieImageURL(data)
      : await getSeriesImageURL(data);
  return <Notifications.Payload>{
    title: title(
      profile,
      `${data.media?.media_type === Models.MediaType.MOVIE ? 'Movie' : 'Series'} Approved`,
    ),
    body: [body1, body2].join(''),
    image: image,
  };
};

/**
 * Construct a Notifications.Payload based on a media auto approved event.
 */
export const mediaAutoApproved = async (
  data: Models.RequestProperties,
  profile: string,
): Promise<Notifications.Payload> => {
  const body1 = data.subject;
  let body2 = '';
  if (data.username) body2 = `\nOriginally Requested by ${data.username}`;
  if (data.request?.requestedBy_username)
    body2 = `\nOriginally Requested by ${data.request?.requestedBy_username}`;
  const image =
    data.media?.media_type === Models.MediaType.MOVIE
      ? await getMovieImageURL(data)
      : await getSeriesImageURL(data);
  return <Notifications.Payload>{
    title: title(
      profile,
      `${data.media?.media_type === Models.MediaType.MOVIE ? 'Movie' : 'Series'} Auto Approved`,
    ),
    body: [body1, body2].join(''),
    image: image,
  };
};

/**
 * Construct a Notifications.Payload based on a media available event.
 */
export const mediaAvailable = async (
  data: Models.RequestProperties,
  profile: string,
): Promise<Notifications.Payload> => {
  const body1 = data.subject;
  let body2 = '';
  if (data.username) body2 = `\nOriginally Requested by ${data.username}`;
  if (data.request?.requestedBy_username)
    body2 = `\nOriginally Requested by ${data.request?.requestedBy_username}`;
  const image =
    data.media?.media_type === Models.MediaType.MOVIE
      ? await getMovieImageURL(data)
      : await getSeriesImageURL(data);
  return <Notifications.Payload>{
    title: title(
      profile,
      `${data.media?.media_type === Models.MediaType.MOVIE ? 'Movie' : 'Series'} Available`,
    ),
    body: [body1, body2].join(''),
    image: image,
  };
};

/**
 * Construct a Notifications.Payload based on a media declined event.
 */
export const mediaDeclined = async (
  data: Models.RequestProperties,
  profile: string,
): Promise<Notifications.Payload> => {
  const body1 = data.subject;
  let body2 = '';
  if (data.username) body2 = `\nOriginally Requested by ${data.username}`;
  if (data.request?.requestedBy_username)
    body2 = `\nOriginally Requested by ${data.request?.requestedBy_username}`;
  const image =
    data.media?.media_type === Models.MediaType.MOVIE
      ? await getMovieImageURL(data)
      : await getSeriesImageURL(data);
  return <Notifications.Payload>{
    title: title(
      profile,
      `${data.media?.media_type === Models.MediaType.MOVIE ? 'Movie' : 'Series'} Declined`,
    ),
    body: [body1, body2].join(''),
    image: image,
  };
};

/**
 * Construct a Notifications.Payload based on a media failed event.
 */
export const mediaFailed = async (
  data: Models.RequestProperties,
  profile: string,
): Promise<Notifications.Payload> => {
  const body1 = data.subject;
  let body2 = '';
  if (data.username) body2 = `\nOriginally Requested by ${data.username}`;
  if (data.request?.requestedBy_username)
    body2 = `\nOriginally Requested by ${data.request?.requestedBy_username}`;
  const image =
    data.media?.media_type === Models.MediaType.MOVIE
      ? await getMovieImageURL(data)
      : await getSeriesImageURL(data);
  return <Notifications.Payload>{
    title: title(
      profile,
      `${data.media?.media_type === Models.MediaType.MOVIE ? 'Movie' : 'Series'} Failed`,
    ),
    body: [body1, body2].join(''),
    image: image,
  };
};

/**
 * Construct a Notifications.Payload based on a media pending event.
 */
export const mediaPending = async (
  data: Models.RequestProperties,
  profile: string,
): Promise<Notifications.Payload> => {
  const body1 = data.subject;
  let body2 = '';
  if (data.username) body2 = `\nOriginally Requested by ${data.username}`;
  if (data.request?.requestedBy_username)
    body2 = `\nOriginally Requested by ${data.request?.requestedBy_username}`;
  const image =
    data.media?.media_type === Models.MediaType.MOVIE
      ? await getMovieImageURL(data)
      : await getSeriesImageURL(data);
  return <Notifications.Payload>{
    title: title(
      profile,
      `${data.media?.media_type === Models.MediaType.MOVIE ? 'Movie' : 'Series'} Requested`,
    ),
    body: [body1, body2].join(''),
    image: image,
  };
};

/**
 * Construct a Notifications.Payload based on a test event.
 */
export const test = async (
  data: Models.RequestProperties,
  profile: string,
): Promise<Notifications.Payload> => {
  return <Notifications.Payload>{
    title: title(profile, 'Connection Test'),
    body: 'LunaSea is ready for Overseerr notifications!',
  };
};

/**
 * Pull the TVDB ID and fetch the series poster URL
 *
 * @param data RequestProperties from Overseerr
 */
const getSeriesImageURL = async (data: Models.RequestProperties): Promise<string | undefined> => {
  try {
    if (data.media?.tvdbId) {
      const id = parseInt(data.media.tvdbId);
      if (!isNaN(id)) return await TheMovieDB.getSeriesPoster(id);
    }
  } catch (error: any) {
    Logger.error(error);
  }
  return undefined;
};

/**
 * Pull the TMDB ID and fetch the movie poster URL
 *
 * @param data RequestProperties from Overseerr
 */
const getMovieImageURL = async (data: Models.RequestProperties): Promise<string | undefined> => {
  try {
    if (data.media?.tmdbId) {
      const id = parseInt(data.media.tmdbId);
      if (!isNaN(id)) return await TheMovieDB.getMoviePoster(id);
    }
  } catch (error: any) {
    Logger.error(error);
  }
  return undefined;
};
