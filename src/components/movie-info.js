import MovieDescriptionComponent from './movie-description.js';
import MovieRatingComponent from './movie-rating.js';
import MovieCommentsComponent from './movie-comments.js';
import AbstractSmartComponent from './abstract-smart-component.js';

const createMovieInfoTemplane = (description, rating, comments) => {
  const descriptionTemplate = description.getTemplate();
  const ratingTemplate = rating.getTemplate();
  const commentsTemplate = comments.getTemplate();
  return (
    `<form class="film-details__inner" action="" method="get">
      ${descriptionTemplate}
      ${ratingTemplate}
      ${commentsTemplate}
    </form>`
  );
};

export default class MovieInfo extends AbstractSmartComponent {
  constructor(movie) {
    super();
    this._movie = movie;
    this._descriptionComponent = null;
    this._ratingComponent = null;
    this._commentsComponent = null;
    this._commentReaction = ``;
    this._alreadyWatched = movie.userDetails.alreadyWatched;
    this._personalRating = movie.userDetails.personalRating;
    this._urlEmoji = ``;

    this._onCloseButtonClick = null;
    this._onAddToWatchlistClick = null;
    this._onFavoriteClick = null;
    this._onUndoClick = null;
    this._onRatingClick = null;
    this._onEmojiClick = null;
    this._onCommentSubmit = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    this._descriptionComponent = new MovieDescriptionComponent(this._movie, this._alreadyWatched, this._personalRating);
    this._ratingComponent = new MovieRatingComponent(this._movie, this._alreadyWatched, this._personalRating);
    this._commentsComponent = new MovieCommentsComponent(this._movie, this._urlEmoji);
    return createMovieInfoTemplane(this._descriptionComponent, this._ratingComponent, this._commentsComponent);
  }

  recoveryListeners() {
    this._subscribeOnEvents();

    this.setCloseButtonHandler(this._onCloseButtonClick);
    this.setAddToWatchlistHandler(this._onAddToWatchlistClick);
    this.setFavoriteHandler(this._onFavoriteClick);
    this.setUndoHandler(this._onUndoClick);
    this.setRatingHandler(this._onRatingClick);
    this.setSubmitCommentHandler(this._onCommentSubmit);
  }

  _subscribeOnEvents() {
    const asWatchElement = this.getElement().querySelector(`input[name="watched"]`);
    asWatchElement.addEventListener(`click`, () => {
      this._alreadyWatched = !this._alreadyWatched;
      if (!this._alreadyWatched) {
        this._personalRating = 0;
      }
      this.rerender();
    });

    const emojiContainerElement = this.getElement().querySelector(`.film-details__emoji-list`);
    emojiContainerElement.addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `IMG`) {
        return;
      }
      const urlName = evt.target.src;
      this._commentReaction = evt.target.dataset.reaction;
      this._urlEmoji = urlName;
      this.rerender();
      // const targetElement = this.getElement().querySelector(`.film-details__add-emoji-label`);
      // targetElement.style.backgroundImage = `url(${urlName})`;
      // targetElement.style.backgroundSize = `100%`;
    });
  }

  setCloseButtonHandler(handler) {
    const closeButtonElement = this.getElement().querySelector(`.film-details__close-btn`);
    closeButtonElement.addEventListener(`click`, handler);
    this._onCloseButtonClick = handler;
  }

  setAddToWatchlistHandler(handler) {
    const watchElement = this.getElement().querySelector(`input[name="watchlist"]`);
    watchElement.addEventListener(`click`, handler);
    this._onAddToWatchlistClick = handler;
  }

  // setAsWatchedHandler(handler) {
  //   const asWatchElement = this.getElement().querySelector(`input[name="watched"]`);
  //   asWatchElement.addEventListener(`click`, handler);
  // }

  setFavoriteHandler(handler) {
    const favoriteElement = this.getElement().querySelector(`input[name="favorite"]`);
    favoriteElement.addEventListener(`click`, handler);
    this._onFavoriteClick = handler;
  }

  setUndoHandler(handler) {
    const undoElement = this.getElement().querySelector(`.film-details__watched-reset`);
    if (undoElement) {
      undoElement.addEventListener(`click`, handler);
    }
    this._onUndoClick = handler;
  }

  setRatingHandler(handler) {
    const ratingContainerElement = this.getElement().querySelector(`.film-details__user-rating-score`);
    if (ratingContainerElement) {
      ratingContainerElement.addEventListener(`click`, (evt) => {
        if (evt.target.tagName !== `INPUT`) {
          return;
        }
        handler(evt.target.value);
      });
    }
    this._onRatingClick = handler;
  }

  resetEmojiImage() {
    const targetElement = this.getElement().querySelector(`.film-details__add-emoji-label`);
    targetElement.style.backgroundImage = ``;
    const inputsCollection = this.getElement().querySelectorAll(`.film-details__emoji-item`);
    inputsCollection.forEach((it) => {
      it.checked = false;
    });
    const imageEmojiElement = this.getElement().querySelector(`.film-details__add-emoji-image`);
    if (imageEmojiElement) {
      imageEmojiElement.remove();
    }
  }

  setSubmitCommentHandler(handler) {
    const commentElement = this.getElement().querySelector(`.film-details__comment-input`);
    commentElement.addEventListener(`keydown`, (evt) => {
      if (evt.key === `Enter` && evt.ctrlKey && commentElement.value) {
        handler(commentElement.value);
        commentElement.value = ``;
      }
    });
    this._onCommentSubmit = handler;
  }

  reset() {
    this.getElement().reset();
  }
}
