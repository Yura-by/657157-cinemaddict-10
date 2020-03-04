import AbstractComponent from './abstract-component.js';
const SORT_ACTIVE_CLASS_NAME = `sort__button--active`;

const getItemsMarkup = (sorts) => {
  return sorts.map((sort, index) => {
    const classActive = index === 0 ? SORT_ACTIVE_CLASS_NAME : ``;
    return (
      `<li><a href="#" class="sort__button ${classActive}" data-sort-type="${sort}">Sort by ${sort}</a></li>`
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
    this._currentSortType = sorts[0];
  }

  getTemplate() {
    return createSortTemplate(this._sorts);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
        return;
      }
      const sortType = evt.target.dataset.sortType;
      if (sortType === this._currentSortType) {
        return;
      }
      this.getElement().querySelector(`a[data-sort-type="${this._currentSortType}"]`).classList.remove(`${SORT_ACTIVE_CLASS_NAME}`);
      this.getElement().querySelector(`a[data-sort-type="${sortType}"]`).classList.add(`${SORT_ACTIVE_CLASS_NAME}`);
      this._currentSortType = sortType;
      handler(this._currentSortType);
    });
  }
}
