import {createProfileTemplate} from './components/profile.js';
import {createSiteFilterTemplate} from './components/site-filter.js';
import {createSortTemplate} from './components/sort.js';
import {createFilmsElement} from './components/films.js';
import {createMoviesContainerTemplate} from './components/movies-container.js';
import {createShowMoreButtonTemplate} from './components/show-more.js';
import {createExtraTemplate} from './components/extra.js';
import {createMovieTemplate} from './components/movie.js';
import {generateMovies} from './mock/movie.js';
import {Filter, Sort} from './const.js';
import {createMovieInfoTemplane} from './components/movie-info.js';
import {createFooterTemplate} from './footer.js';

const COUNT_MOVIES = 24;
const COUNT_START_MOVIES = 5;

const movies = generateMovies(COUNT_MOVIES);

console.log(movies)




const generateFilter = (allMovies, name) => {
  return {
    name,
    count: getCountByFilter(allMovies, name)
  };
};

const getCountByFilter = (allMovies, filterName) => {
  switch (filterName) {
    case Filter.ALL:
      return null;
    case Filter.WATCHLIST:
      return allMovies.filter((movie) => movie.userDetails.watchlist).length;
    case Filter.HISTORY:
      return allMovies.filter((movie) => movie.userDetails.alreadyWatched).length;
    case Filter.FAVORITES:
      return allMovies.filter((movie) => movie.userDetails.favorite).length;
  }
};

const getFilters = () => {
  return Object.values(Filter).map((filterName) => generateFilter(movies, filterName));
};




const getSorts = () => {
  return Object.values(Sort);
};


const getAlreadyWatched = () => {
  return movies.filter((movie) => movie.userDetails.alreadyWatched).length;
};




const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(headerElement, createProfileTemplate(getAlreadyWatched()), `beforeend`);
render(mainElement, createSiteFilterTemplate(getFilters()), `beforebegin`);
render(mainElement, createSortTemplate(getSorts()), `beforeend`);
render(mainElement, createFilmsElement(), `beforeend`);

const filmsListElement = mainElement.querySelector(`.films-list`);

render(filmsListElement, createMoviesContainerTemplate(), `beforeend`);

const moviesContainerElement = document.querySelector(`.films-list__container`);

new Array(COUNT_START_MOVIES).fill(``)
  .forEach((it, index) => render(moviesContainerElement, createMovieTemplate(movies[index]), `beforeend`));

render(filmsListElement, createShowMoreButtonTemplate(), `beforeend`);

const filmsElement = document.querySelector(`.films`);

render(filmsElement, createExtraTemplate(), `beforeend`);

render(mainElement, createFooterTemplate(), `afterend`);

const footerElement = document.querySelector(`.footer`);

render(footerElement, createMovieInfoTemplane(movies[0]), `afterend`);
