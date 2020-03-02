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
import {getRatingMovies, getCommentsMovies} from './utils/extra.js';

const COUNT_MOVIES = 17;
const SHOWING_MOVIES_ON_START = 5;
const SHOWING_MOVIES_BY_BUTTON = 5;

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

const getSorts = () => {
  return Object.values(Sort);
};

const getAlreadyWatched = () => {
  return movies.filter((movie) => movie.userDetails.alreadyWatched).length;
};



const renderScreen = (allMovies, container) => {
  const filmsComponent = new FilmsComponent();
  if (allMovies.length === 0) {
    filmsComponent.setNoFilmsTemplate();
    render(container, filmsComponent.getElement(), RenderPosition.BEFOREEND);
    return;
  }
  render(mainElement, new SortComponent(getSorts()).getElement(), RenderPosition.BEFOREEND);
  render(mainElement, filmsComponent.getElement(), RenderPosition.BEFOREEND);
  const filmsListElement = mainElement.querySelector(`.films-list`);

  render(filmsListElement, new MovieContainerComponent().getElement(), RenderPosition.BEFOREEND);
  const moviesContainerElement = document.querySelector(`.films-list__container`);
  movies.slice(0, SHOWING_MOVIES_ON_START)
  .forEach((movie) => renderMovie(moviesContainerElement, movie));

  const loadButtonComponent = new ShowMoreComponent(movies.length);

  render(filmsListElement, loadButtonComponent.getElement(), RenderPosition.BEFOREEND);

  let showMovie = SHOWING_MOVIES_ON_START;

  const buttonElement = filmsListElement.querySelector(`.films-list__show-more`);

  if (buttonElement) {
    loadButtonComponent.getElement().addEventListener(`click`, () => {
      const startMovie = showMovie;
      showMovie += SHOWING_MOVIES_BY_BUTTON;
      movies.slice(startMovie, showMovie).forEach((movie) => renderMovie(moviesContainerElement, movie));
      if (showMovie >= movies.length) {
        buttonElement.remove();
        loadButtonComponent.removeElement();
      }
    });
  }

  const filmsElement = document.querySelector(`.films`);

  const extraRatingMovies = getRatingMovies(movies);
  const extraRatingComponent = new ExtraRatingComponent(extraRatingMovies);
  const extraRatingMoviesContainer = extraRatingComponent.getElement().querySelector(`.films-list__container`);

  if (extraRatingMoviesContainer) {
    extraRatingMovies.forEach((movie) => {
      renderMovie(extraRatingMoviesContainer, movie);
    });
    render(filmsElement, extraRatingComponent.getElement(), RenderPosition.BEFOREEND);
  }

  const extraCommentsMovies = getCommentsMovies(movies);
  const extraCommentsComponent = new ExtraCommentsComponent(extraCommentsMovies);
  const extraCommentsMoviesContainer = extraCommentsComponent.getElement().querySelector(`.films-list__container`);

  if (extraCommentsMoviesContainer) {
    extraCommentsMovies.forEach((movie) => {
      renderMovie(extraCommentsMoviesContainer, movie);
    });
    render(filmsElement, extraCommentsComponent.getElement(), RenderPosition.BEFOREEND);
  }
};

const renderMovie = (movieContainerElement, movie) => {
  const movieComponent = new MovieComponent(movie);
  const posterElement = movieComponent.getElement().querySelector(`.film-card__poster`);
  const titleElement = movieComponent.getElement().querySelector(`.film-card__title`);
  const commentElement = movieComponent.getElement().querySelector(`.film-card__comments`);
  const movieInfoComponent = new MovieInfoComponent(movie);
  const closeInfoElement = movieInfoComponent.getElement().querySelector(`.film-details__close-btn`);

  const hideInfoElement = () => {
    movieInfoComponent.getElement().remove();
    document.removeEventListener(`keydown`, onKeyDown);
  };

  const onKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      hideInfoElement();
    }
  };

  const showInfoElement = () => {
    render(document.body, movieInfoComponent.getElement(), RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, onKeyDown);
  };

  posterElement.addEventListener(`click`, () => showInfoElement());
  titleElement.addEventListener(`click`, () => showInfoElement());
  commentElement.addEventListener(`click`, () => showInfoElement());

  closeInfoElement.addEventListener(`click`, () => {
    hideInfoElement();
  });

  render(movieContainerElement, movieComponent.getElement(), RenderPosition.BEFOREEND);
};


const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

render(headerElement, new ProfileComponent(getAlreadyWatched()).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new FilterComponent(getFilters()).getElement(), RenderPosition.AFTERBEGIN);

render(document.body, new FooterComponent(movies).getElement(), RenderPosition.BEFOREEND);

renderScreen(movies, mainElement);

export {SHOWING_MOVIES_ON_START, renderMovie};
