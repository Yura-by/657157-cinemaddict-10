import AbstractComponent from './abstract-component.js';

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

export default class Footer extends AbstractComponent {
  constructor(movies) {
    super();
    this._movies = movies;
  }

  getTemplate() {
    return createFooterTemplate(this._movies);
  }
}
