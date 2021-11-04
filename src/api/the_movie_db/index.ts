import axios from 'axios';
import { ContentResponse, ExternalSourceType, FindContentResponse } from './models';
import { Logger } from '../../utils';

export namespace TheMovieDB {
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
  const IMAGE_SIZE = 'w780';

  const http = axios.create({
    method: 'GET',
    baseURL: 'https://api.themoviedb.org/3/',
    params: {
      api_key: process.env.THEMOVIEDB_API_KEY,
    },
  });

  /**
   * Construct the path path to the image.
   *
   * @param path Relative path to the image
   */
  const constructImageURL = (path: string): string => `${IMAGE_BASE_URL}${IMAGE_SIZE}${path}`;

  /**
   * Given a movie's ID, fetch the content's poster path.
   *
   * @param id The Movie Database movie ID
   */
  export const getMoviePoster = async (movieId: number): Promise<string | undefined> => {
    Logger.debug(`Fetching movie poster... (${movieId})`);
    try {
      return await http({
        url: `movie/${movieId}`,
      }).then((response) => {
        const movie = response.data as ContentResponse;
        if (movie.poster_path) {
          const url = constructImageURL(movie.poster_path);
          Logger.debug(`-> ...${url.substr(url.length - 50, 50)}`);
          return url;
        }
        if (movie.backdrop_path) {
          const url = constructImageURL(movie.backdrop_path);
          Logger.debug(`-> ...${url.substr(url.length - 50, 50)}`);
          return url;
        }
        Logger.warn('-> Movie had no poster or background image.');
      });
    } catch (error: any) {
      Logger.error(error);
      Logger.warn(`-> Failed to fetch movie poster (${movieId})`);
    }
    return undefined;
  };

  /**
   * Given a series's TVDB ID, fetch the content's poster path from The Movie Database.
   *
   * @param id The series ID from TVDB
   */
  export const getSeriesPoster = async (seriesId: number): Promise<string | undefined> => {
    Logger.debug(`Fetching series poster... (${seriesId})`);
    try {
      return await http({
        url: `find/${seriesId}`,
        params: {
          external_source: ExternalSourceType.tvdbId,
        },
      }).then((response) => {
        const data = response.data as FindContentResponse;
        if (data.tv_results && data.tv_results.length > 0) {
          // Assume the first series is the right one.
          const series = data.tv_results[0];
          if (series.poster_path) {
            const url = constructImageURL(series.poster_path);
            Logger.debug(`-> ...${url.substr(url.length - 50, 50)}`);
            return url;
          }
          if (series.backdrop_path) {
            const url = constructImageURL(series.backdrop_path);
            Logger.debug(`-> ...${url.substr(url.length - 50, 50)}`);
            return url;
          }
          Logger.warn('-> Series had no poster or background image.');
        }
        Logger.warn(`-> Failed to find a TV series $(${seriesId})`);
      });
    } catch (error: any) {
      Logger.error(error);
      Logger.warn(`-> Failed to fetch series poster (${seriesId})`);
    }
    return undefined;
  };
}
