import MovieComponent from '../components/movie.js';
import MovieInfoComponent from '../components/movie-info.js';
import {render, replace} from '../utils/render.js';
import {RenderPosition} from '../const.js';
import MovieInfoContainerComponent from '../components/movie-info-contaiter';
import Movie from '../models/movie.js';
import Comment from '../models/comment.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
};

const Type = {
  USUAL: `usual`,
  EXTRA: `extra`
};

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._movieComponent = null;
    this._infoComponent = null;
    this._infoContainerComponent = new MovieInfoContainerComponent();

    this.mode = Mode.DEFAULT;
    this.type = Type.USUAL;

    this._id = null;
    this._movieComments = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._showInfoElement = this._showInfoElement.bind(this);
    this._hideInfoElement = this._hideInfoElement.bind(this);
  }

  render(movie) {
    this._id = movie.id;
    const oldMovieComponent = this._movieComponent;
    const oldInfoComponent = this._infoComponent;

    this._movieComponent = new MovieComponent(movie);
    this._infoComponent = new MovieInfoComponent(movie);

    this._movieComponent.setPosterHandler(this._showInfoElement);
    this._movieComponent.setTitleHandler(this._showInfoElement);
    this._movieComponent.setCommentHandler(this._showInfoElement);

    this._movieComponent.setAddToWatchlistHandler(() => {
      const newMovie = Movie.clone(movie);
      newMovie.userDetails.watchlist = !movie.userDetails.watchlist;
      this._onDataChange(this, movie, newMovie);
    });

    this._movieComponent.setAsWatchedHandler(() => {
      const newMovie = Movie.clone(movie);
      newMovie.userDetails.alreadyWatched = !movie.userDetails.alreadyWatched;
      if (newMovie.userDetails.alreadyWatched) {
        newMovie.userDetails.watchingDate = new Date();
      } else {
        newMovie.userDetails.personalRating = 0;
      }
      this._onDataChange(this, movie, newMovie);
    });

    this._movieComponent.setFavoriteHandler(() => {
      const newMovie = Movie.clone(movie);
      newMovie.userDetails.favorite = !movie.userDetails.favorite;
      this._onDataChange(this, movie, newMovie);
    });

    this._infoComponent.setAddToWatchlistHandler((evt) => {
      evt.preventDefault();
      const newMovie = Movie.clone(movie);
      newMovie.userDetails.watchlist = !movie.userDetails.watchlist;
      this._onDataChange(this, movie, newMovie);
    });

    this._infoComponent.setAsWatchedHandler((evt) => {
      evt.preventDefault();
      const newMovie = Movie.clone(movie);
      newMovie.userDetails.alreadyWatched = !movie.userDetails.alreadyWatched;
      if (newMovie.userDetails.alreadyWatched) {
        newMovie.userDetails.watchingDate = new Date();
      } else {
        newMovie.userDetails.personalRating = 0;
      }
      this._onDataChange(this, movie, newMovie);
    });

    this._infoComponent.setFavoriteHandler((evt) => {
      evt.preventDefault();
      const newMovie = Movie.clone(movie);
      newMovie.userDetails.favorite = !movie.userDetails.favorite;
      this._onDataChange(this, movie, newMovie);
    });

    this._infoComponent.setUndoHandler(() => {
      if (movie.userDetails.personalRating === 0) {
        return;
      }
      const newMovie = Movie.clone(movie);
      newMovie.userDetails.personalRating = 0;
      this._onDataChange(this, movie, newMovie);
    });

    this._infoComponent.setRatingHandler((rating) => {
      const newMovie = Movie.clone(movie);
      newMovie.userDetails.personalRating = Number(rating);
      this._infoComponent.setRatingDisabled();
      this._onDataChange(this, movie, newMovie);
    });

    this._infoComponent.setSubmitCommentHandler((commentContent, reaction) => {
      const newComment = new Comment({
        emotion: reaction,
        comment: commentContent,
        date: String(new Date().toISOString())
      });
      this._infoComponent.setDisabledCommentField();
      this._onDataChange(this, null, newComment);
    });

    this._infoComponent.setCloseButtonHandler(this._hideInfoElement);

    this._infoComponent.setDeleteCommentButtonHandler((idComment) => {
      this._onDataChange(this, movie, null, idComment);
    });

    if (oldMovieComponent && oldInfoComponent) {
      replace(this._movieComponent, oldMovieComponent);
      replace(this._infoComponent, oldInfoComponent);
    } else {
      render(this._container, this._movieComponent, RenderPosition.BEFOREEND);
    }
  }

  setCloseHandler(handler) {
    this._infoComponent.setCloseButtonHandler(handler);

    const onEscClick = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {

        handler();
        document.removeEventListener(`keydown`, onEscClick);
      }
    };
    document.addEventListener(`keydown`, onEscClick);
  }

  setDefaultView() {
    if (this.mode !== Mode.DEFAULT) {
      this._hideInfoElement();
    }
  }

  getId() {
    return this._id;
  }

  shake() {
    this._movieComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._infoComponent.getElement().querySelector(`.film-details__comment-input`).style.boxShadow = `0 0 10px rgba(255,0,0,1)`;
    const ratingLabelElements = this._infoComponent.getElement().querySelectorAll(`.film-details__user-rating-label`);
    ratingLabelElements.forEach((labelElement) => {
      labelElement.style.backgroundColor = `rgb(255, 0, 0)`;
    });
    const checkedElement = Array.from(this._infoComponent.getElement().querySelectorAll(`.film-details__user-rating-input`)).find((it) => it.checked === true);
    if (checkedElement) {
      checkedElement.nextElementSibling.style.backgroundColor = `#ffe800`;
    }
    this._infoComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._movieComponent.getElement().style.animation = ``;
      this._infoComponent.getElement().querySelector(`.film-details__comment-input`).style.boxShadow = ``;
      this._infoComponent.getElement().style.animation = ``;
      ratingLabelElements.forEach((labelElement) => {
        labelElement.style.backgroundColor = `#d8d8d8`;
      });
      if (checkedElement) {
        checkedElement.nextElementSibling.style.backgroundColor = `#ffe800`;
      }
      this._infoComponent.resetRatingDisabled();
      this._infoComponent.resetDisabledCommentField();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _showInfoElement() {
    this._onViewChange();
    render(document.body, this._infoContainerComponent, RenderPosition.BEFOREEND);
    render(this._infoContainerComponent.getElement(), this._infoComponent, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this.mode = Mode.EDIT;
  }

  _hideInfoElement() {
    this._infoComponent.resetElement();
    this._infoContainerComponent.getElement().remove();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this.mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._hideInfoElement();
    }
  }
}

export {Type, Mode};
