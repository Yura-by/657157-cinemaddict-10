import {createElement} from '../utils/render.js';

const getLinksMarkup = (filters) => {
  return filters.map((it, index) => {
    const {name, count} = it;
    const countMarkup = count ? `<span class="main-navigation__item-count">${count}</span>` : ``;
    const activeClass = index === 0 ? `main-navigation__item--active` : ``;
    return (
      `<a href="#" class="main-navigation__item ${activeClass}">${name} ${countMarkup}</a>`
    )
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

export default class Extra {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  getTemplate() {
    return this._element = createSiteFilterTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(getTemplate());
    }

    return this._element;
  }
};
