import AbstractComponent from './abstract-component.js';
import {Filter} from '../const.js';

const ACTIVE_CLASS = `main-navigation__item--active`;

const getLinksMarkup = (filters) => {
  return filters.map((it) => {
    const {name, count, checked} = it;
    const countMarkup = count && name !== Filter.ALL ? `<span class="main-navigation__item-count">${count}</span>` : ``;
    const activeClass = name === checked ? ACTIVE_CLASS : ``;
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
      this.getElement().querySelector(`.${ACTIVE_CLASS}`).classList.remove(ACTIVE_CLASS);
      evt.target.classList.add(ACTIVE_CLASS);
      handler(evt.target.dataset.filterName);
    });
  }
}
