import {Filter} from '../const.js';

const getMoviesByFilter = (movies, filterName) => {
  switch (filterName) {
    case Filter.ALL:
      return movies;
    case Filter.WATCHLIST:
      return movies.filter((movie) => movie.userDetails.watchlist);
    case Filter.HISTORY:
      return movies.filter((movie) => movie.userDetails.alreadyWatched);
    case Filter.FAVORITES:
      return movies.filter((movie) => movie.userDetails.favorite);
  }
  return movies;
}

export {getMoviesByFilter};
