import ProfileComponent from './components/profile.js';
import FilterComponent from './components/site-filter.js';
import SortComponent from './components/sort.js';
import FilmsComponent from './components/films.js';
import MovieContainerComponent from './components/movies-container.js';
import ShowMoreComponent from './components/show-more.js';
import ExtraRatingComponent from './components/extra-rating.js';
import ExtraCommentsComponent from './components/extra-comments.js';
import MovieComponent from './components/movie.js';
import FooterComponent from './components/footer.js';
import MovieInfoComponent from './components/movie-info.js';
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

render(headerElement, new ProfileComponent(getAlreadyWatched()).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new FilterComponent(getFilters()).getElement(), RenderPosition.AFTERBEGIN);
render(mainElement, new SortComponent(getSorts()).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new FilmsComponent().getElement(), RenderPosition.BEFOREEND);

const filmsListElement = mainElement.querySelector(`.films-list`);

render(filmsListElement, new MovieContainerComponent().getElement(), RenderPosition.BEFOREEND);

const moviesContainerElement = document.querySelector(`.films-list__container`);

movies.slice(0, SHOWING_MOVIES_ON_START)
  .forEach((movie) => render(moviesContainerElement, new MovieComponent(movie).getElement(), RenderPosition.BEFOREEND));

render(filmsListElement, new ShowMoreComponent(movies.length).getElement(), RenderPosition.BEFOREEND);

let showMovie = SHOWING_MOVIES_ON_START;

const buttonElement = filmsListElement.querySelector(`.films-list__show-more`);

if (buttonElement) {
  buttonElement.addEventListener(`click`, () => {
    const startMovie = showMovie;
    showMovie += SHOWING_MOVIES_BY_BUTTON;
    movies.slice(startMovie, showMovie).forEach((movie) => render(moviesContainerElement, new MovieComponent(movie).getElement(), RenderPosition.BEFOREEND));
    if (showMovie >= movies.length) {
      buttonElement.remove();
    }
  });
}

const filmsElement = document.querySelector(`.films`);

render(filmsElement, new ExtraRatingComponent(movies).getElement(), RenderPosition.BEFOREEND);

render(filmsElement, new ExtraCommentsComponent(movies).getElement(), RenderPosition.BEFOREEND);

render(document.body, new FooterComponent(movies).getElement(), RenderPosition.BEFOREEND);

const footerElement = document.querySelector(`.footer`);

render(footerElement, new MovieInfoComponent(movies[0]).getElement(), RenderPosition.BEFOREEND);

export {SHOWING_MOVIES_ON_START};
