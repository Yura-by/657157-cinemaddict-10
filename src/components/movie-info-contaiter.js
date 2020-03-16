import AbstractComponent from './abstract-component.js';

const createMovieInfoTemplate = () => {
  return `<section class="film-details"></section>`;
};

export default class MovieInfoContainer extends AbstractComponent {
  getTemplate() {
    return createMovieInfoTemplate();
  }
}
