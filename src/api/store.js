export default class Store {
  constructor(moviesKey, commentsKey, storage) {
    this._moviesKey = moviesKey;
    this._commentsKey = commentsKey;
    this._storage = storage;
  }

  getAllMovies() {
    try {
      return JSON.parse(this._storage.getItem(this._moviesKey));
    } catch (err) {
      return {};
    }
  }

  getAllComments() {
    try {
      return JSON.parse(this._storage.getItem(this._commentsKey));
    } catch (err) {
      return {};
    }
  }

  setMovie(key, value) {
    const store = this.getAllMovies();
    this._storage.setItem(
        this._moviesKey,
        JSON.stringify(
            Object.assign({}, store, {[key]: value})
        )
    );
  }

  setComment(keyComment, value, keyMovie) {
    const store = this.getAllComments();
    this._storage.setItem(
        this._commentsKey,
        JSON.stringify(
            Object.assign({}, store, {[keyComment]: value})
        )
    );

    if (!keyMovie) {
      return;
    }

    const storeMovies = this.getAllMovies();
    const movie = storeMovies[keyMovie];
    const index = movie.comments.findIndex((commentId) => {
      return commentId === keyComment;
    });
    if (index !== -1) {
      return;
    }
    movie.comments.push(keyComment);
    this._storage.setItem(
        this._moviesKey,
        JSON.stringify(
            Object.assign({}, storeMovies)
        )
    );
  }

  removeComment(keyComment, keyMovie) {
    const storeComments = this.getAllComments();
    delete storeComments[keyComment];

    this._storage.setItem(
        this._commentsKey,
        JSON.stringify(
            Object.assign({}, storeComments)
        )
    );

    const storeMovies = this.getAllMovies();
    const commentsMovie = storeMovies[keyMovie].comments;
    const indexInMovie = commentsMovie.findIndex((commentId) => commentId === keyComment);
    if (indexInMovie !== -1) {
      storeMovies[keyMovie].comments = [].concat(commentsMovie.slice(0, indexInMovie), commentsMovie.slice(indexInMovie + 1));
    }

    this._storage.setItem(
        this._moviesKey,
        JSON.stringify(
            Object.assign({}, storeMovies)
        )
    );
  }
}
