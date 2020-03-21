import {getMoviesByFilter} from '../utils/filter.js';
import {Filter} from '../const.js';
import CommetnsModel from './comments.js';

export default class Movies {
  constructor() {
    this._movies = [];
    this._commentsModel = new CommetnsModel();

    this._activeFilter = Filter.ALL;

    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  getMovies() {
    const moviesWithoutComments = getMoviesByFilter(this._movies, this._activeFilter);
    const moviesWithComments = moviesWithoutComments.map((movie) => {
      const entireComments = movie.comments.map((idComment) => {
        return this._commentsModel.getComment(idComment);
      });
      return Object.assign({}, movie, {comments: entireComments});
    });
    return moviesWithComments;
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
    this._dataChangeHandlers.forEach((handler) => handler());
    return true;
  }

  setFilter(filterType) {
    this._activeFilter = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  addComments(newComments) {
    this._commentsModel.addComments(newComments);
  }

  getComment(id) {
    this._commentsModel.getComment(id);
  }

  removeComment(id) {
    this._commentsModel.removeComment(id);
  }

  clearComments() {
    this._commentsModel.clearComments();
  }
}
