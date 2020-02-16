const getItemsMarkup = (sorts) => {
  return sorts.map((sort, index) => {
    const classActive = index === 0 ? `sort__button--active` : ``;
    return (
      `<li><a href="#" class="sort__button ${classActive}">Sort by ${sort}</a></li>`
    )
  }).join(`\n`);
};

export const createSortTemplate = (sorts) => {
  const itemsMarkup = getItemsMarkup(sorts);
  return (
    `<ul class="sort">
      ${itemsMarkup}
    </ul>
  `);
};

/*<li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" class="sort__button">Sort by date</a></li>
      <li><a href="#" class="sort__button">Sort by rating</a></li>*/
