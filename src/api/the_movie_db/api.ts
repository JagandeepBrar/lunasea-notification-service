import axios from 'axios';
import { ContentResponse, ExternalSourceType, FindContentResponse } from './models';
import { Constants } from '../../utils';

const http = axios.create({
  method: 'GET',
  baseURL: Constants.THE_MOVIE_DB.API.BASE_URL,
  params: {
    api_key: process.env.THEMOVIEDB_API_KEY,
  },
});

const _constructImageURL = (path: string): string => {
  return `${Constants.THE_MOVIE_DB.IMAGE.BASE_URL}${Constants.THE_MOVIE_DB.IMAGE.SIZE}${path}`;
};

export const getMoviePoster = async (movieId: number): Promise<string | undefined> => {
  return http({
    url: `movie/${movieId}`,
  }).then((response): string | undefined => {
    const movie = response.data as ContentResponse;
    if (movie.poster_path) return _constructImageURL(movie.poster_path);
    if (movie.backdrop_path) return _constructImageURL(movie.backdrop_path);
    return undefined;
  });
};

export const getSeriesPoster = async (seriesId: number): Promise<string | undefined> => {
  return await http({
    url: `find/${seriesId}`,
    params: {
      external_source: ExternalSourceType.tvdbId,
    },
  }).then((response): string | undefined => {
    const data = response.data as FindContentResponse;
    if (data.tv_results && data.tv_results.length > 0) {
      const series = data.tv_results[0];
      if (series.poster_path) return _constructImageURL(series.poster_path);
      if (series.backdrop_path) return _constructImageURL(series.backdrop_path);
      return undefined;
    }
  });
};
