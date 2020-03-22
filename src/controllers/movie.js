import MovieComponent from '../components/movie.js';
import MovieInfoComponent from '../components/movie-info.js';
import {render, replace} from '../utils/render.js';
import {RenderPosition} from '../const.js';
import MovieInfoContainerComponent from '../components/movie-info-contaiter';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
};

const Type = {
  USUAL: `usual`,
  EXTRA: `extra`
};

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
      const newMovieUserDetails = Object.assign({}, movie.userDetails);
      newMovieUserDetails.watchlist = !movie.userDetails.watchlist;
      this._onDataChange(this, movie, Object.assign({}, movie, {userDetails: newMovieUserDetails}));
    });

    this._movieComponent.setAsWatchedHandler(() => {
      const newMovieUserDetails = Object.assign({}, movie.userDetails);
      newMovieUserDetails.alreadyWatched = !movie.userDetails.alreadyWatched;
      this._onDataChange(this, movie, Object.assign({}, movie, {userDetails: newMovieUserDetails}));
    });

    this._movieComponent.setFavoriteHandler(() => {
      const newMovieUserDetails = Object.assign({}, movie.userDetails);
      newMovieUserDetails.favorite = !movie.userDetails.favorite;
      this._onDataChange(this, movie, Object.assign({}, movie, {userDetails: newMovieUserDetails}));
    });

    this._infoComponent.setAddToWatchlistHandler(() => {
      const newMovieUserDetails = Object.assign({}, movie.userDetails);
      newMovieUserDetails.watchlist = !movie.userDetails.watchlist;
      this._onDataChange(this, movie, Object.assign({}, movie, {userDetails: newMovieUserDetails}));
    });

    this._infoComponent.setAsWatchedHandler(() => {
      const newMovieUserDetails = Object.assign({}, movie.userDetails);
      newMovieUserDetails.alreadyWatched = !movie.userDetails.alreadyWatched;
      if (!newMovieUserDetails.alreadyWatched) {
        newMovieUserDetails.personalRating = 0;
      }
      this._onDataChange(this, movie, Object.assign({}, movie, {userDetails: newMovieUserDetails}));
    });

    this._infoComponent.setFavoriteHandler(() => {
      const newMovieUserDetails = Object.assign({}, movie.userDetails);
      newMovieUserDetails.favorite = !movie.userDetails.favorite;
      this._onDataChange(this, movie, Object.assign({}, movie, {userDetails: newMovieUserDetails}));
    });

    this._infoComponent.setUndoHandler(() => {
      if (movie.userDetails.personalRating === 0) {
        return;
      }
      const newMovieUserDetails = Object.assign({}, movie.userDetails);
      newMovieUserDetails.personalRating = 0;
      this._onDataChange(this, movie, Object.assign({}, movie, {userDetails: newMovieUserDetails}));
    });

    this._infoComponent.setRatingHandler((rating) => {
      const newMovieUserDetails = Object.assign({}, movie.userDetails);
      newMovieUserDetails.personalRating = rating;
      this._onDataChange(this, movie, Object.assign({}, movie, {userDetails: newMovieUserDetails}));
    });

    this._infoComponent.setSubmitCommentHandler((commentContent, reaction) => {
      console.log(commentContent, reaction);
      this._infoComponent.resetElement();
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
