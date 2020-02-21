import {createMovieTemplate} from './movie.js';
import {createElement} from '../utils/render.js';

const getCardsMarkup = (movies) => {
  return movies.map((movie) => {
    return createMovieTemplate(movie);
  }).join(`\n`);
};

const createFilmsExtraTemplate = (movies, title) => {
  const cardsMarkup = getCardsMarkup(movies);
  return movies.length > 0 ? (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>

      <div class="films-list__container">
        ${cardsMarkup}
      </div>
    </section>`
  ) : ``;
};

const Title = {
  RATING: `Top rated`,
  COMMENT: `Most commented`
};

const createExtraTemplate = (movies) => {
  let topsRating = movies.slice()
    .sort((left, right) => right.filmInfo.totalRating - left.filmInfo.totalRating)
    .slice(0, 2);
  if (topsRating.length > 0 && topsRating[0].totalRating === 0) {
    topsRating = [];
  }
  let topsComments = movies.slice()
    .sort((left, right) => right.comments.length - left.comments.length)
    .slice(0, 2);
  if (topsComments.length > 0 && topsComments[0].comments.length === 0) {
    topsComments = [];
  }
  const extraRatingTemplate = createFilmsExtraTemplate(topsRating, Title.RATING);
  const extraCommentsTemplate = createFilmsExtraTemplate(topsComments, Title.COMMENT);
  return (
    `${extraRatingTemplate}
    ${extraCommentsTemplate}`
  );
};

export default class Extra {
  constructor(movies) {
    this._element = null;
    this._movies = movies;
  }

  getTemplate() {
    return this._element = createExtraTemplate(this._movies);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(getTemplate());
    }

    return this._element;
  }
};
