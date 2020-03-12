import AbstractComponent from './abstract-component.js';

const RATING_COUNT = 9;
const CORRECT_INDEX = 1;

const createControlsMarkup = (rating) => {
  const isCheckedIndex = Math.floor(rating);
  return new Array(RATING_COUNT).fill(``)
    .map((it, index) => {
      const number = index + CORRECT_INDEX;
      return (
        `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${number}" id="rating-${number}" ${isCheckedIndex === number ? `checked` : ``}>
        <label class="film-details__user-rating-label" for="rating-${number}">${number}</label>`
      );
    }).join(`\n`);
};

const createRatingTemplate = (movie, alreadyWatched, personalRating) => {
  const {filmInfo: {title}, filmInfo: {poster}} = movie;
  const contolsMarkup = createControlsMarkup(personalRating);
  return alreadyWatched ? (
    `<div class="form-details__middle-container">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${poster}" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              ${contolsMarkup}
            </div>
          </section>
        </div>
      </section>
    </div>`
  ) : ``;
};

export default class MovieRating extends AbstractComponent {
  constructor(movie, alreadyWatched, personalRating) {
    super();
    this._movie = movie;
    this._alreadyWatched = alreadyWatched;
    this._personalRating = personalRating;
  }

  getTemplate() {
    return createRatingTemplate(this._movie, this._alreadyWatched, this._personalRating);
  }
}
