import MovieDescriptionComponent from './movie-description.js';
import MovieRatingComponent from './movie-rating.js';
import MovieCommentsComponent from './movie-comments.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import debounce from 'lodash.debounce';

const DEBOUNCE_TIMEOUT = 500;

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
    this._commentText = ``;

    this._onCloseButtonClickHandlers = [];
    this._onAddToWatchlistClick = null;
    this._onFavoriteClick = null;
    this._onUndoClick = null;
    this._onRatingClick = null;
    this._onEmojiClick = null;
    this._onCommentSubmit = null;
    this._onDeleteButtonClick = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    this._descriptionComponent = new MovieDescriptionComponent(this._movie, this._alreadyWatched, this._personalRating);
    this._ratingComponent = new MovieRatingComponent(this._movie, this._alreadyWatched, this._personalRating);
    this._commentsComponent = new MovieCommentsComponent(this._movie, this._urlEmoji, this._commentText);
    return createMovieInfoTemplane(this._descriptionComponent, this._ratingComponent, this._commentsComponent);
  }

  recoveryListeners() {
    this._subscribeOnEvents();

    this._onCloseButtonClickHandlers.forEach((handler) => this.setCloseButtonHandler(handler));
    this.setAddToWatchlistHandler(this._onAddToWatchlistClick);
    this.setFavoriteHandler(this._onFavoriteClick);
    this.setUndoHandler(this._onUndoClick);
    this.setRatingHandler(this._onRatingClick);
    this.setSubmitCommentHandler(this._onCommentSubmit);
    this.setDeleteCommentButtonHandler(this._onDeleteButtonClick);
  }

  _subscribeOnEvents() {
    const emojiContainerElement = this.getElement().querySelector(`.film-details__emoji-list`);
    emojiContainerElement.addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `IMG`) {
        return;
      }
      const urlName = evt.target.src;
      this._commentReaction = evt.target.dataset.reaction;
      this._urlEmoji = urlName;
      this._commentText = this.getElement().querySelector(`.film-details__comment-input`).value;
      this.rerender();
    });
  }

  setCloseButtonHandler(handler) {
    this._onCloseButtonClickHandlers.push(handler);
    const closeButtonElement = this.getElement().querySelector(`.film-details__close-btn`);
    closeButtonElement.addEventListener(`click`, () => {
      this._onCloseButtonClickHandlers.forEach((it) => it());
    });
  }

  setAddToWatchlistHandler(handler) {
    const watchElement = this.getElement().querySelector(`input[name="watchlist"]`);
    watchElement.addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
    this._onAddToWatchlistClick = handler;
  }

  setAsWatchedHandler(handler) {
    const asWatchElement = this.getElement().querySelector(`input[name="watched"]`);
    asWatchElement.addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  setFavoriteHandler(handler) {
    const favoriteElement = this.getElement().querySelector(`input[name="favorite"]`);
    favoriteElement.addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
    this._onFavoriteClick = handler;
  }

  setUndoHandler(handler) {
    const undoElement = this.getElement().querySelector(`.film-details__watched-reset`);
    if (undoElement) {
      undoElement.addEventListener(`click`, handler);
    }
    this._onUndoClick = handler;
  }

  setRatingDisabled() {
    const ratingElements = this.getElement().querySelectorAll(`.film-details__user-rating-input`);
    ratingElements.forEach((it) => {
      it.disabled = true;
    });
  }

  resetRatingDisabled() {
    const ratingElements = this.getElement().querySelectorAll(`.film-details__user-rating-input`);
    ratingElements.forEach((it) => {
      it.disabled = false;
    });
  }

  setRatingHandler(handler) {
    const ratingContainerElement = this.getElement().querySelector(`.film-details__user-rating-score`);
    if (ratingContainerElement) {
      ratingContainerElement.addEventListener(`click`, (evt) => {
        if (evt.target.tagName !== `INPUT` || evt.target.disabled) {
          return;
        }
        evt.preventDefault();
        handler(evt.target.value);
      });
    }
    this._onRatingClick = handler;
  }

  resetElement() {
    this.getElement().reset();
    this._commentReaction = ``;
    this._urlEmoji = ``;
    this._commentText = ``;
    const inputsCollection = this.getElement().querySelectorAll(`.film-details__emoji-item`);
    inputsCollection.forEach((it) => {
      it.checked = false;
    });

    this.rerender();
  }

  setDisabledCommentField() {
    const inputCommentElement = this.getElement().querySelector(`.film-details__comment-input`);
    inputCommentElement.disabled = true;
  }

  resetDisabledCommentField() {
    const inputCommentElement = this.getElement().querySelector(`.film-details__comment-input`);
    inputCommentElement.disabled = false;
  }

  setSubmitCommentHandler(handler) {
    const commentElement = this.getElement().querySelector(`.film-details__comment-input`);
    commentElement.addEventListener(`keydown`, (evt) => {
      if (evt.key === `Enter` && evt.ctrlKey && commentElement.value && this._commentReaction) {
        handler(commentElement.value, this._commentReaction);
      }
    });
    this._onCommentSubmit = handler;
  }

  setDeleteCommentButtonHandler(handler) {
    const listCommentsElement = this.getElement().querySelector(`.film-details__comments-list`);
    listCommentsElement.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `BUTTON`) {
        return;
      }
      handler(evt.target.dataset.commentId);
    });
    this._onDeleteButtonClick = handler;
  }
}
