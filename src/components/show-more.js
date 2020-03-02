import {SHOWING_MOVIES_ON_START} from '../main.js';
import AbstractComponent from './abstract-component.js';

const createShowMoreButtonTemplate = (lengthMovies) => {
  return lengthMovies > SHOWING_MOVIES_ON_START ? `<button class="films-list__show-more">Show more</button>` : ``;
};

export default class ShowMore extends AbstractComponent {
  constructor(lengths) {
    super();
    this._lengths = lengths;
  }

  getTemplate() {
    return createShowMoreButtonTemplate(this._lengths);
  }

  setButtonHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
