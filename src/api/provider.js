import Movie from '../models/movie.js';
import Comment from '../models/comment.js';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  getMovies() {
    if (this._isOnline()) {
      return this._api.getMovies().then(
          (movies) => {
            movies.forEach((movie) => {
              this._store.setMovie(movie.id, movie.toRAW());
            });
            return movies;
          }
      );
    }
    const storeMovies = Object.values(this._store.getAllMovies());

    this._isSynchronized = false;

    return Promise.resolve(Movie.parseMovies(storeMovies));
  }

  getComments(movieId) {
    if (this._isOnline()) {
      return this._api.getComments(movieId).then(
          (comments) => {
            comments.forEach((comment) => {
              this._store.setComment(comment.id, comment);
            });
            return comments;
          }
      );
    }
    const storeComments = Object.values(this._store.getAllComments());

    this._isSynchronized = false;
    return Promise.resolve(Comment.parseComments(storeComments));
  }

  createComment(filmId, commentItem) {
    if (this._isOnline()) {
      return this._api.createComment(filmId, commentItem).then(
          (response) => {
            const newComment = response.find((it) => it.comment === commentItem.comment);
            this._store.setComment(newComment.id, newComment, filmId);
            return response;
          }
      );
    }

    const fakeId = String(Number(new Date()) + Math.floor(Math.random() * 1000));
    const fakeAuthor = `Someone`;
    const newComment = Comment.parseComment(Object.assign({}, commentItem.toRAW(), {id: fakeId, author: fakeAuthor}));
    this._store.setComment(newComment.id, newComment, filmId);
    this._isSynchronized = false;

    return Promise.resolve([newComment]);
  }

  updateMovie(id, data) {
    if (this._isOnline()) {
      return this._api.updateMovie(id, data).then(
          (movie) => {
            this._store.setMovie(movie.id, movie.toRAW());
            return movie;
          }
      );
    }
    this._store.setMovie(data.id, data.toRAW());
    this._isSynchronized = false;

    return Promise.resolve(data);
  }

  deleteComment(keyComment, keyMovie) {
    if (this._isOnline()) {
      return this._api.deleteComment(keyComment).then(
          this._store.removeComment(keyComment, keyMovie)
      );
    }

    this._store.removeComment(keyComment, keyMovie);
    this._isSynchronized = false;

    return Promise.resolve();
  }

  getSynchonize() {
    return this._isSynchronized;
  }

  sync() {
    if (this._isOnline) {
      const movies = Object.values(this._store.getAllMovies());
      this._api.sync(movies)
        .then((response) => {
          response.updated.forEach((movie) => {
            this._store.setMovie(movie.id, movie);
          });
        });
      this._isSynchronized = true;
      return Promise.resolve();
    }

    return Promise.reject(new Error(`Sync data failed`));

  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
