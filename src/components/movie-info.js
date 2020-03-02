import MovieDescriptionComponent from './movie-description.js';
import MovieRatingComponent from './movie-rating.js';
import MovieCommentsComponent from './movie-comments.js';
import AbstractComponent from './abstract-component.js';

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

export default class MovieInfo extends AbstractComponent {
  constructor(movie) {
    super();
    this._movie = movie;
    this._descriptionComponent = new MovieDescriptionComponent(movie);
    this._ratingComponent = new MovieRatingComponent(movie);
    this._commentsComponent = new MovieCommentsComponent(movie);
  }

  getTemplate() {
    return createMovieInfoTemplane(this._descriptionComponent, this._ratingComponent, this._commentsComponent);
  }

  setCloseButtonHandler(handler) {
    const closeButtonElement = this.getElement().querySelector(`.film-details__close-btn`);
    closeButtonElement.addEventListener(`click`, handler);
  }
}
