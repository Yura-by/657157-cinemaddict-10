import {getDurationInFormat} from '../utils/common.js';
import {createElement} from '../utils/render.js';

const Month = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`
];

const getFilmsGenresMarkup = (genres) => {
  return genres.map((genre) => {
    return (`<span class="film-details__genre">${genre}</span>`);
  }).join(`\n`);
};

const createDescriptionTemplate = (movie) => {
  const {filmInfo: {title}, filmInfo: {alternativeTitle}, filmInfo: {totalRating}, filmInfo: {poster}, filmInfo: {ageRating}, filmInfo: {director}, filmInfo: {writers}, filmInfo: {actors}, filmInfo: {release: {date}}, filmInfo: {release: {releaseCountry}}, filmInfo: {runtime}, filmInfo: {genre}, filmInfo: {description}, userDetails: {personalRating}, userDetails: {watchlist}, userDetails: {alreadyWatched}, userDetails: {favorite}} = movie;
  const writersString = writers.join(`, `);
  const actorsString = actors.join(`, `);
  const dateRelease = `${date.getDate()} ${Month[date.getMonth()]} ${date.getFullYear()}`;
  const durationInFormat = getDurationInFormat(runtime);
  const genresTemplate = getFilmsGenresMarkup(genre);

  return (
    `<div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="${title}">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
              <p class="film-details__user-rating">Your rate ${personalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writersString}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actorsString}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dateRelease}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${durationInFormat}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                ${genresTemplate}
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlist ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" checked>
        <label for="watched" class="film-details__control-label ${alreadyWatched ? `film-details__control-label--watched` : ``}">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite"  ${favorite ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>`
  );
};

export default class MovieDescription {
  constructor(movie) {
    this._element = null;
    this._movie = movie;
  }

  getTemplate() {
    return this._element = createDescriptionTemplate(this._movie);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(getTemplate());
    }

    return this._element;
  }
};

