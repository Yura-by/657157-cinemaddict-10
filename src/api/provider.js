import Movie from '../models/movie.js';
import Comment from '../models/comment.js';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (this._isOnline()) {
      return this._api.getMovies();
    }

    return Promise.resolve(Movie.parseMovies([]));
  }

  getComments(movieId) {
    if (this._isOnline()) {
      return this._api.getComments(movieId);
    }

    return Promise.resolve();
  }

  createComment(filmId, comment) {
    if (this._isOnline()) {
      return this._api.createComment(filmId, comment);
    }

    const fakeId = String(Number(new Date()) + Math.floor(Math.random() * 1000));
    const fakeAuthor = `Someone`;
    const newComment = Comment.parseComment(Object.assign({}, comment.toRAW(), {id: fakeId, author: fakeAuthor}));
    return Promise.resolve([newComment]);
  }

  updateMovie(id, data) {
    if (this._isOnline()) {
      return this._api.updateMovie(id, data);
    }

    return Promise.resolve(data);
  }

  deleteComment(id) {
    if (this._isOnline()) {
      return this._api.deleteComment(id);
    }

    return Promise.resolve();
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
