import {SHOWING_MOVIES_ON_START} from '../main.js';
import {createElement} from '../utils/render.js';


const createShowMoreButtonTemplate = (lengthMovies) => {
  return lengthMovies > SHOWING_MOVIES_ON_START ? `<button class="films-list__show-more">Show more</button>` : ``;
};

export default class ShowMore {
  constructor(lengths) {
    this._element = null;
    this._lengths = lengths;
  }

  getTemplate() {
    return this._element = createShowMoreButtonTemplate(this._lengths);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(getTemplate());
    }

    return this._element;
  }
};
