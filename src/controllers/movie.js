import MovieComponent from '../components/movie.js';
import MovieInfoComponent from '../components/movie-info.js';
import {render, replace} from '../utils/render.js';
import {RenderPosition} from '../const.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._movieComponent = null;
    this._infoComponent = null;

    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._showInfoElement = this._showInfoElement.bind(this);
    this._hideInfoElement = this._hideInfoElement.bind(this);
  }

  render(movie) {
    const oldMovieComponent = this._movieComponent;
    const oldInfoComponent = this._infoComponent;

    this._movieComponent = new MovieComponent(movie);
    this._infoComponent = new MovieInfoComponent(movie);

    this._movieComponent.setPosterHandler(this._showInfoElement);
    this._movieComponent.setTitleHandler(this._showInfoElement);
    this._movieComponent.setCommentHandler(this._showInfoElement);

    this._movieComponent.setAddToWatchlistHandler(() => {
      const newMovieDetails = Object.assign({}, movie.userDetails);
      newMovieDetails.watchlist = !movie.userDetails.watchlist;
      this._onDataChange(this, movie, Object.assign({}, movie, {userDetails: newMovieDetails}));
    });

    this._movieComponent.setAsWatchedHandler(() => {
      const newMovieDetails = Object.assign({}, movie.userDetails);
      newMovieDetails.alreadyWatched = !movie.userDetails.alreadyWatched;
      this._onDataChange(this, movie, Object.assign({}, movie, {userDetails: newMovieDetails}));
    });

    this._movieComponent.setFavoriteHandler(() => {
      const newMovieDetails = Object.assign({}, movie.userDetails);
      newMovieDetails.favorite = !movie.userDetails.favorite;
      this._onDataChange(this, movie, Object.assign({}, movie, {userDetails: newMovieDetails}));
    });

    this._infoComponent.setAddToWatchlistHandler(() => {
      const newMovieDetails = Object.assign({}, movie.userDetails);
      newMovieDetails.watchlist = !movie.userDetails.watchlist;
      this._onDataChange(this, movie, Object.assign({}, movie, {userDetails: newMovieDetails}));
    });

    this._infoComponent.setAsWatchedHandler(() => {
      const newMovieDetails = Object.assign({}, movie.userDetails);
      newMovieDetails.alreadyWatched = !movie.userDetails.alreadyWatched;
      if (!newMovieDetails.alreadyWatched) {
        newMovieDetails.personalRating = 0;
      }
      this._onDataChange(this, movie, Object.assign({}, movie, {userDetails: newMovieDetails}));
    });

    this._infoComponent.setFavoriteHandler(() => {
      const newMovieDetails = Object.assign({}, movie.userDetails);
      newMovieDetails.favorite = !movie.userDetails.favorite;
      this._onDataChange(this, movie, Object.assign({}, movie, {userDetails: newMovieDetails}));
    });

    this._infoComponent.setUndoHandler(() => {
      const newMovieDetails = Object.assign({}, movie.userDetails);
      newMovieDetails.personalRating = 0;
      this._onDataChange(this, movie, Object.assign({}, movie, {userDetails: newMovieDetails}));
    });

    this._infoComponent.setRatingHandler((rating) => {
      const newMovieDetails = Object.assign({}, movie.userDetails);
      newMovieDetails.personalRating = rating;
      this._onDataChange(this, movie, Object.assign({}, movie, {userDetails: newMovieDetails}));
    });

    this._infoComponent.setEmojiHandler((url) => {
      this._infoComponent.setEmojiImage(url);
    });

    this._infoComponent.setSubmitCommentHandler((commentContent) => {
      console.log(commentContent);
      this._infoComponent.resetEmojiImage();
    });

    this._infoComponent.setCloseButtonHandler(this._hideInfoElement);

    if (oldMovieComponent && oldInfoComponent) {
      replace(this._movieComponent, oldMovieComponent);
      replace(this._infoComponent, oldInfoComponent);
    } else {
      render(this._container, this._movieComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._hideInfoElement();
    }
  }

  _showInfoElement() {
    this._onViewChange();
    render(document.body, this._infoComponent, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.EDIT;
  }

  _hideInfoElement() {
    this._infoComponent.reset();
    this._infoComponent.getElement().remove();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._hideInfoElement();
    }
  }
}
