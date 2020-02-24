import {createElement} from '../utils/render.js';
import {Title, createFilmsExtraTemplate} from './extra-rating.js';

const createExtraTemplate = (movies) => {
  const extraCommentsTemplate = createFilmsExtraTemplate(movies, Title.COMMENT);
  return (
    `${extraCommentsTemplate}`
  );
};

export default class ExtraComments {
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

