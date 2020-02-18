import {SHOWING_MOVIES_ON_START} from '../main.js';

export const createShowMoreButtonTemplate = (lengthMovies) => {
  return lengthMovies > SHOWING_MOVIES_ON_START ? `<button class="films-list__show-more">Show more</button>` : ``;
};
