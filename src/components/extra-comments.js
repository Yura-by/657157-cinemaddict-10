import {createElement} from '../utils/render.js';
import {Title, createFilmsExtraTemplate} from './extra-rating.js';

const createExtraTemplate = (movies) => {
  let topsComments = movies.slice()
    .sort((left, right) => right.comments.length - left.comments.length)
    .slice(0, 2);
  if (topsComments.length > 0 && topsComments[0].comments.length === 0) {
    topsComments = [];
  }
  const extraCommentsTemplate = createFilmsExtraTemplate(topsComments, Title.COMMENT);
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

