import {createElement} from '../utils/render.js';

const getItemsMarkup = (sorts) => {
  return sorts.map((sort, index) => {
    const classActive = index === 0 ? `sort__button--active` : ``;
    return (
      `<li><a href="#" class="sort__button ${classActive}">Sort by ${sort}</a></li>`
    )
  }).join(`\n`);
};

const createSortTemplate = (sorts) => {
  const itemsMarkup = getItemsMarkup(sorts);
  return (
    `<ul class="sort">
      ${itemsMarkup}
    </ul>
  `);
};

export default class Extra {
  constructor(sorts) {
    this._element = null;
    this._sorts = sorts;
  }

  getTemplate() {
    return this._element = createSortTemplate(this._sorts);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(getTemplate());
    }

    return this._element;
  }
};
