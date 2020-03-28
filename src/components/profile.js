import AbstractComponent from './abstract-component.js';
import {getStatusName} from '../utils/common.js';

const createProfileTemplate = (countWatched) => {

  const status = getStatusName(countWatched);

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${status}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Profile extends AbstractComponent {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return createProfileTemplate(this._count);
  }
}
