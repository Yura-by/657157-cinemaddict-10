import {getMoviesByFilter} from '../utils/filter.js';
import {Filter} from '../const.js';

export default class Movies {
  constructor() {
    this._movies = [];

    this._activeFilter = Filter.ALL;

    this._filterChangeHandler = [];
  }

  getMovies() {
    return getMoviesByFilter(this._movies, this._activeFilter);
  }

  getAllMovies() {
    return this._movies;
  }

  setMovies(movies) {
    this._movies = Array.from(movies);
  }

  updateMovie(id, newMovie) {
    const index = this._movies.findIndex((movie) => movie.id === id);

    if (index === -1) {
      return false;
    }

    this._movies = [].concat(this._movies.slice(0, index), newMovie, this._movies.slice(index + 1));

    return true;
  }

  setFilter(filterType) {
    this._activeFilter = filterType;
    this._filterChangeHandler.forEach((handler) => handler());
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandler.push(handler);
  }
}