import AbstractComponent from './abstract-component.js';

const getItemsMarkup = (sorts) => {
  return sorts.map((sort, index) => {
    const classActive = index === 0 ? `sort__button--active` : ``;
    return (
      `<li><a href="#" class="sort__button ${classActive}">Sort by ${sort}</a></li>`
    );
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

export default class Extra extends AbstractComponent {
  constructor(sorts) {
    super();
    this._sorts = sorts;
  }

  getTemplate() {
    return createSortTemplate(this._sorts);
  }
}
