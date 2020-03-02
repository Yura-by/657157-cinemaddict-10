import AbstractComponent from './abstract-component.js';
import {Title, createFilmsExtraTemplate} from './extra-rating.js';

const createExtraTemplate = (movies) => {
  const extraCommentsTemplate = createFilmsExtraTemplate(movies, Title.COMMENT);
  return (
    `${extraCommentsTemplate}`
  );
};

export default class ExtraComments extends AbstractComponent {
  constructor(movies) {
    super();
    this._movies = movies;
  }

  getTemplate() {
    return createExtraTemplate(this._movies);
  }
}

