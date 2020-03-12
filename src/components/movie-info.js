import MovieDescriptionComponent from './movie-description.js';
import MovieRatingComponent from './movie-rating.js';
import MovieCommentsComponent from './movie-comments.js';
import AbstractSmartComponent from './abstract-smart-component.js';

const createMovieInfoTemplane = (description, rating, comments) => {
  const descriptionTemplate = description.getTemplate();
  const ratingTemplate = rating.getTemplate();
  const commentsTemplate = comments.getTemplate();
  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        ${descriptionTemplate}
        ${ratingTemplate}
        ${commentsTemplate}
      </form>
    </section>`
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
  }

  getTemplate() {
    this._descriptionComponent = new MovieDescriptionComponent(this._movie);
    this._ratingComponent = new MovieRatingComponent(this._movie);
    this._commentsComponent = new MovieCommentsComponent(this._movie);
    return createMovieInfoTemplane(this._descriptionComponent, this._ratingComponent, this._commentsComponent);
  }

  setCloseButtonHandler(handler) {
    const closeButtonElement = this.getElement().querySelector(`.film-details__close-btn`);
    closeButtonElement.addEventListener(`click`, handler);
  }

  setAddToWatchlistHandler(handler) {
    const watchElement = this.getElement().querySelector(`input[name="watchlist"]`);
    watchElement.addEventListener(`click`, handler);
  }

  setAsWatchedHandler(handler) {
    const asWatchElement = this.getElement().querySelector(`input[name="watched"]`);
    asWatchElement.addEventListener(`click`, handler);
  }

  setFavoriteHandler(handler) {
    const favoriteElement = this.getElement().querySelector(`input[name="favorite"]`);
    favoriteElement.addEventListener(`click`, handler);
  }

  setUndoHandler(handler) {
    const undoElement = this.getElement().querySelector(`.film-details__watched-reset`);
    if (undoElement) {
      undoElement.addEventListener(`click`, handler);
    }
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
  }

  setEmojiHandler(handler) {
    const emojiContainerElement = this.getElement().querySelector(`.film-details__emoji-list`);
    emojiContainerElement.addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `IMG`) {
        return;
      }
      const urlName = evt.target.src;
      this._commentReaction = evt.target.dataset.reaction;
      handler(urlName);
    });
  }

  setEmojiImage(urlName) {
    const targetElement = this.getElement().querySelector(`.film-details__add-emoji-label`);
    targetElement.style.backgroundImage = `url(${urlName})`;
    targetElement.style.backgroundSize = `100%`;
  }

  resetEmojiImage() {
    const targetElement = this.getElement().querySelector(`.film-details__add-emoji-label`);
    targetElement.style.backgroundImage = ``;
    const inputsCollection = this.getElement().querySelectorAll(`.film-details__emoji-item`);
    inputsCollection.forEach((it) => {
      it.checked = false;
    });
  }

  setSubmitCommentHandler(handler) {
    const commentElement = this.getElement().querySelector(`.film-details__comment-input`);
    commentElement.addEventListener(`keydown`, (evt) => {
      if (evt.key === `Enter` && evt.ctrlKey && commentElement.value) {
        handler(commentElement.value);
        commentElement.value = ``;
      }
    });
  }

  reset() {
    this.getElement().querySelector(`.film-details__inner`).reset();
    this.getElement().querySelector(`.film-details__add-emoji-label`).style.backgroundImage = ``;
  }
}
