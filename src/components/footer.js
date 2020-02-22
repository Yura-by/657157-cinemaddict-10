import {createElement} from '../utils/render.js';

const createFooterTemplate = (movies) => {
  const countMovies = movies.length;
  return (
    `<footer class="footer">
      <section class="footer__logo logo logo--smaller">Cinemaddict</section>
      <section class="footer__statistics">
        <p>${countMovies} movies inside</p>
      </section>
    </footer>`
  );
};

export default class Footer {
  constructor(movies) {
    this._element = null;
    this._movies = movies;
  }

  getTemplate() {
    return createFooterTemplate(this._movies);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }
}
