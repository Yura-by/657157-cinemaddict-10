import ProfileComponent from './components/profile.js';
import FilterComponent from './components/site-filter.js';
import FooterComponent from './components/footer.js';
import {generateMovies} from './mock/movie.js';
import {Filter, RenderPosition} from './const.js';
import ScreenController from './controllers/screen.js';
import {render} from './utils/render.js';

const COUNT_MOVIES = 17;

const movies = generateMovies(COUNT_MOVIES);

const generateFilter = (allMovies, name) => {
  return {
    name,
    count: getCountByFilter(allMovies, name)
  };
};

const getCountByFilter = (allMovies, filterName) => {
  let result;
  switch (filterName) {
    case Filter.ALL:
      result = null;
      break;
    case Filter.WATCHLIST:
      result = allMovies.filter((movie) => movie.userDetails.watchlist).length;
      break;
    case Filter.HISTORY:
      result = allMovies.filter((movie) => movie.userDetails.alreadyWatched).length;
      break;
    case Filter.FAVORITES:
      result = allMovies.filter((movie) => movie.userDetails.favorite).length;
      break;
  }
  return result;
};

const getFilters = () => {
  return Object.values(Filter).map((filterName) => generateFilter(movies, filterName));
};

const getAlreadyWatched = () => {
  return movies.filter((movie) => movie.userDetails.alreadyWatched).length;
};

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

render(headerElement, new ProfileComponent(getAlreadyWatched()), RenderPosition.BEFOREEND);
render(mainElement, new FilterComponent(getFilters()), RenderPosition.AFTERBEGIN);

render(document.body, new FooterComponent(movies), RenderPosition.BEFOREEND);

const screenController = new ScreenController(mainElement);

screenController.render(movies);
