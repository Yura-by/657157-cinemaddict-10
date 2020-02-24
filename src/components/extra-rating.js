import {createElement} from '../utils/render.js';

const Title = {
  RATING: `Top rated`,
  COMMENT: `Most commented`
};

const createFilmsExtraTemplate = (movies, title) => {
  return movies.length > 0 ? (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>

      <div class="films-list__container">
      </div>
    </section>`
  ) : ``;
};

const createExtraTemplate = (movies) => {
  const extraRatingTemplate = createFilmsExtraTemplate(movies, Title.RATING);
  return (
    `${extraRatingTemplate}`
  );
};

export default class ExtraRating {
  constructor(movies) {
    this._element = null;
    this._movies = movies;
  }

  getTemplate() {
    return createExtraTemplate(this._movies);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }
}

export {Title, createFilmsExtraTemplate};
