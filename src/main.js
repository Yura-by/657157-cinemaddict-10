import {ProfileComponent} from './components/profile.js';
import {FilterComponent} from './components/site-filter.js';
import {SortComponent} from './components/sort.js';
import {FilmsComponent} from './components/films.js';
import {MovieContainerComponent} from './components/movies-container.js';
import {ShoeMoreComponent} from './components/show-more.js';
import {ExtraComponent} from './components/extra.js';
import {MovieComponent} from './components/movie.js';
import {FooterComponent} from './components/footer.js';
import {MovieInfoComponent} from './components/movie-info.js';
import {generateMovies} from './mock/movie.js';
import {Filter, Sort, RenderPosition} from './const.js';
import {render} from './utils/render.js';

const COUNT_MOVIES = 17;
const SHOWING_MOVIES_ON_START = 5;
const SHOWING_MOVIES_BY_BUTTON = 5;

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

movies.slice(0, SHOWING_MOVIES_ON_START)
  .forEach((movie) => render(moviesContainerElement, createMovieTemplate(movie), `beforeend`));

render(filmsListElement, createShowMoreButtonTemplate(movies.length), `beforeend`);

let showMovie = SHOWING_MOVIES_ON_START;

const buttonElement = filmsListElement.querySelector(`.films-list__show-more`);

if (buttonElement) {
    buttonElement.addEventListener(`click` , () => {
      const startMovie = showMovie;
      showMovie += SHOWING_MOVIES_BY_BUTTON;
      movies.slice(startMovie, showMovie).forEach((movie) => render(moviesContainerElement, createMovieTemplate(movie), `beforeend`));
      if (showMovie >= movies.length) {
        buttonElement.remove();
      }
    });
}

const filmsElement = document.querySelector(`.films`);

render(filmsElement, createExtraTemplate(movies), `beforeend`);

render(mainElement, createFooterTemplate(movies), `afterend`);

const footerElement = document.querySelector(`.footer`);

//render(footerElement, createMovieInfoTemplane(movies[0]), `afterend`);

export {SHOWING_MOVIES_ON_START};
