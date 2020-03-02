import AbstractComponent from './abstract-component.js';

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

export default class ExtraRating extends AbstractComponent {
  constructor(movies) {
    super();
    this._movies = movies;
  }

  getTemplate() {
    return createExtraTemplate(this._movies);
  }
}

export {Title, createFilmsExtraTemplate};
