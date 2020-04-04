import {getMoviesByFilter} from '../utils/filter.js';
import {Filter} from '../const.js';
import CommetnsModel from './comments.js';
import Movie from './movie.js';

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
    return this._addComments(moviesWithoutComments);
  }

  getAllMovies() {
    const res = this._addComments(this._movies);
    return res;
  }

  getMovie(idMovie) {
    return this.getAllMovies().find((it) => it.id === idMovie);
  }

  _addComments(movies) {
    const moviesWithComments = movies.map((movie) => {
      const entireComments = movie.comments.map((idComment) => {
        return this.getComment(idComment);
      });
      // return Object.assign({}, movie, {comments: entireComments});
      const newMovie = Movie.clone(movie);
      newMovie.comments = entireComments;
      return newMovie;
    });
    return moviesWithComments;
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

  setComments(newComments) {
    this._commentsModel.setComments(newComments);
  }

  addCommentToMovie(movieId, commentId) {
    this._movies.find((movie) => movie.id === movieId).comments.push(commentId);
  }

  getComment(id) {
    return this._commentsModel.getComment(id);
  }

  removeComment(movieId, idComment) {
    const targetMovie = this._movies.find((movie) => movie.id === movieId);
    const index = targetMovie.comments.findIndex((comment) => {
      return comment === idComment;
    });
    if (index === -1) {
      return false;
    }
    targetMovie.comments = [].concat(targetMovie.comments.slice(0, index), targetMovie.comments.slice(index + 1));
    return this._deleteComment(idComment);
  }

  _deleteComment(id) {
    return this._commentsModel.removeComment(id);
  }

  clearComments() {
    this._commentsModel.clearComments();
  }

  getActiveFilterName() {
    return this._activeFilter;
  }

}
