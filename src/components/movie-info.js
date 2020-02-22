import MovieDescriptionComponent from './movie-description.js';
import MovieRatingComponent from './movie-rating.js';
import MovieCommentsComponent from './movie-comments.js';
import {createElement} from '../utils/render.js';

const createMovieInfoTemplane = (movie, description, rating, comments) => {
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

export default class MovieInfo {
  constructor(movie) {
    this._element = null;
    this._movie = movie;
    this._descriptionComponent = new MovieDescriptionComponent(movie);
    this._ratingComponent = new MovieRatingComponent(movie);
    this._commentsComponent = new MovieCommentsComponent(movie);
  }

  getTemplate() {
    return createMovieInfoTemplane(this._movie, this._descriptionComponent, this._ratingComponent, this._commentsComponent);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }
}
