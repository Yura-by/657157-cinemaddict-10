import {createElement} from '../utils/render.js';

const TEXT_NO_MOVIES = `There are no movies in our database`;

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
    return createFilmsElement();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  setNoFilmsTemplate() {
    const title = this.getElement().querySelector(`.films-list__title`);
    title.classList.remove(`visually-hidden`);
    title.textContent = TEXT_NO_MOVIES;
    const filmsListElement = this.getElement().querySelector(`.films-list`);
    filmsListElement.innerHTML = ``;
    filmsListElement.appendChild(title);
    const filmsElement = this.getElement();
    filmsElement.innerHTML = ``;
    filmsElement.appendChild(filmsListElement);
  }
}
