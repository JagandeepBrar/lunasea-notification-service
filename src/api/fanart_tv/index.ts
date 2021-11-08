import axios from 'axios';
import { Logger } from '../../utils';

const http = axios.create({
  baseURL: 'http://webservice.fanart.tv/v3/',
  params: {
    api_key: process.env.FANART_TV_API_KEY,
  },
});

/**
 * Given a full resolution URL, convert the URL to a preview (smaller resolution/thumbnail) image.
 *
 * @param url Fanart.tv full resolution URL
 */
const convertToPreview = (url: string): string => url.replace('/fanart/', '/preview/');

/**
 * Returns the first artist thumbnail with the given artist ID.
 * If no thumbnails are found or an error has occurred, returns undefined.
 *
 * @param artistId Musicbrainz artist ID
 */
export const getArtistThumbnail = async (artistId: string): Promise<string | undefined> => {
  Logger.debug(`Fetching artist thumbnail... (${artistId})`);
  try {
    return await http({
      method: 'GET',
      url: `music/${artistId}`,
    }).then((response) => {
      if (
        response.data.artistthumb &&
        Array.isArray(response.data.artistthumb) &&
        response.data.artistthumb.length > 0
      ) {
        const url = convertToPreview(response.data.artistthumb[0]?.url);
        if (url) {
          Logger.debug(`-> ...${url.substr(url.length - 50, 50)}`);
          return url;
        }
      }
      Logger.debug(`-> No artist thumbnail found (${artistId})`);
    });
  } catch (error: any) {
    Logger.error(error);
  }
  return undefined;
};

/**
 * Returns the first album artwork with the given album ID.
 * If no artwork are found or an error has occurred, returns undefined.
 *
 * @param albumId Musicbrainz album ID
 */
export const getAlbumCover = async (albumId: string): Promise<string | undefined> => {
  Logger.debug(`Fetching album cover... (${albumId})`);
  try {
    return await http({
      method: 'GET',
      url: `music/albums/${albumId}`,
    }).then((response) => {
      if (
        response.data.albums &&
        response.data.albums[albumId] &&
        response.data.albums[albumId].albumcover &&
        Array.isArray(response.data.albums[albumId].albumcover) &&
        response.data.albums[albumId].albumcover.length > 0
      ) {
        const url = convertToPreview(response.data[albumId].albumcover[0]?.url);
        if (url) {
          Logger.debug(`-> ...${url?.substr(url.length - 50, 50)}`);
          return url;
        }
      }
      Logger.debug('-> No album cover found', albumId);
    });
  } catch (error: any) {
    Logger.error(error);
  }
  return undefined;
};
