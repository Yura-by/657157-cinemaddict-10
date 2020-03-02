import AbstractComponent from './abstract-component.js';

const createMoviesContainerTemplate = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class MoviesContainer extends AbstractComponent {

  getTemplate() {
    return createMoviesContainerTemplate();
  }
}

