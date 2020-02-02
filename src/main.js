import {createProfileTemplate} from './components/profile.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createSortTemplate} from './components/sort.js';

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(headerElement, createProfileTemplate(), `beforeend`);
render(mainElement, createSiteMenuTemplate(), `beforebegin`);
render(mainElement, createSortTemplate(), `beforeend`);
