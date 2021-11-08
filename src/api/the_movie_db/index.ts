import { Logger } from '../../utils';
import * as API from './api';
import * as Cache from './cache';

/**
 * Given a movie's ID, fetch the content's poster path.
 *
 * @param id TMDB ID
 */
export const getMoviePoster = async (movieId: number): Promise<string | undefined> => {
  try {
    Logger.debug(`Fetching movie poster... (${movieId})`);
    const cacheResult = await Cache.getMoviePoster(movieId);
    if (cacheResult) {
      Logger.debug(`Fetched movie poster. (Cache, ${movieId})`);
      return cacheResult;
    }
    const apiResult = await API.getMoviePoster(movieId);
    if (apiResult) {
      Logger.debug(`Fetched movie poster. (API, ${movieId})`);
      Cache.setMoviePoster(movieId, apiResult);
      return apiResult;
    }
  } catch (error) {
    Logger.error(error);
  }
  return undefined;
};

/**
 * Given a series's TVDB ID, fetch the content's poster path.
 *
 * @param id TVDB ID
 */
export const getSeriesPoster = async (seriesId: number): Promise<string | undefined> => {
  try {
    Logger.debug(`Fetching series poster... (${seriesId})`);
    const cacheResult = await Cache.getSeriesPoster(seriesId);
    if (cacheResult) {
      Logger.debug(`Fetched series poster. (Cache, ${seriesId})`);
      return cacheResult;
    }
    const apiResult = await API.getSeriesPoster(seriesId);
    if (apiResult) {
      Logger.debug(`Fetched series poster. (API, ${seriesId})`);
      Cache.setSeriesPoster(seriesId, apiResult);
      return apiResult;
    }
  } catch (error) {
    Logger.error(error);
  }
  return undefined;
};
