import {createElement} from '../utils/render.js';

const createMoviesContainerTemplate = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class MoviesContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return this._element = createMoviesContainerTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(getTemplate());
    }

    return this._element;
  }
};

