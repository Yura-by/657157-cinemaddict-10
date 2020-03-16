import AbstractComponent from './abstract-component.js';
import {Filter} from '../const.js';

const getLinksMarkup = (filters) => {
  return filters.map((it) => {
    const {name, count, checked} = it;
    const countMarkup = count ? `<span class="main-navigation__item-count">${count}</span>` : ``;
    const activeClass = it === checked ? `main-navigation__item--active` : ``;
    return (
      `<a href="#" class="main-navigation__item ${activeClass}" data-filter-name="${name}">${name} ${countMarkup}</a>`
    );
  })
  .join(`\n`);
};

const createSiteFilterTemplate = (filters) => {
  const linksMarkup = getLinksMarkup(filters);
  return (
    `<nav class="main-navigation">
      ${linksMarkup}
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>`
  );
};

export default class Extra extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createSiteFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {

      evt.preventDefault();
      if (evt.target.tagName !== `A` || evt.target.classList.contains(`main-navigation__item--additional`)) {
        return;
      }
      handler(evt.target.dataset);
      console.log(evt.target.dataset.filterName)
    });
  }
}
