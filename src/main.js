import {createProfileTemplate} from './components/profile.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createSortTemplate} from './components/sort.js';
import {createFilmsElement} from './components/films.js';
import {createMoviesContainerTemplate} from './components/movies-container.js';
import {createShowMoreButtonTemplate} from './components/show-more.js';
import {createExtraTemplate} from './components/extra.js';
import {createMovieTemplate} from './components/movie.js';
import {generateMovies} from './mock/movie.js';

const COUNT_MOVIES = 5;

const movies = generateMovies(COUNT_MOVIES);

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(headerElement, createProfileTemplate(), `beforeend`);
render(mainElement, createSiteMenuTemplate(), `beforebegin`);
render(mainElement, createSortTemplate(), `beforeend`);
render(mainElement, createFilmsElement(), `beforeend`);

const filmsListElement = mainElement.querySelector(`.films-list`);

render(filmsListElement, createMoviesContainerTemplate(), `beforeend`);

const moviesContainerElement = document.querySelector(`.films-list__container`);

render(moviesContainerElement, createMovieTemplate(movies[0]), `beforeend`);

render(filmsListElement, createShowMoreButtonTemplate(), `beforeend`);

const filmsElement = document.querySelector(`.films`);

render(filmsElement, createExtraTemplate(), `beforeend`);
