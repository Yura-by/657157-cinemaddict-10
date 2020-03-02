import {getDurationInFormat} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

const createMovieTemplate = (movie) => {
  if (!movie) {
    return ``;
  }
  const {filmInfo: {poster}, filmInfo: {title}, filmInfo: {totalRating}, filmInfo: {release: {date}}, filmInfo: {runtime}, filmInfo: {genre}, filmInfo: {description}, comments} = movie;
  const duration = getDurationInFormat(runtime);
  const year = date.getFullYear();
  const genreFirst = genre[0];
  const countComments = `${comments.length} comments`;
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genreFirst}</span>
      </p>
      <img src="${poster}" alt="${title}" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <a class="film-card__comments">${countComments}</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class Movie extends AbstractComponent {
  constructor(movie) {
    super();
    this._movie = movie;
  }

  getTemplate() {
    return createMovieTemplate(this._movie);
  }

  setPosterHandler(handler) {
    const posterElement = this.getElement().querySelector(`.film-card__poster`);
    posterElement.addEventListener(`click`, handler);
  }

  setTitleHandler(handler) {
    const titleElement = this.getElement().querySelector(`.film-card__title`);
    titleElement.addEventListener(`click`, handler);
  }

  setCommentHandler(handler) {
    const commentElement = this.getElement().querySelector(`.film-card__comments`);
    commentElement.addEventListener(`click`, handler);
  }
}
