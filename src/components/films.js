import {createElement} from '../utils/render.js';

const createFilmsElement = () => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      </section>
    </section>`
  );
};

export default class Films {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return this._element = createFilmsElement();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(getTemplate());
    }

    return this._element;
  }
};
