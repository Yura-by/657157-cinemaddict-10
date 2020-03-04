import SortComponent from '../components/sort.js';
import FilmsComponent from '../components/films.js';
import MovieContainerComponent from '../components/movies-container.js';
import ShowMoreComponent from '../components/show-more.js';
import ExtraRatingComponent from '../components/extra-rating.js';
import ExtraCommentsComponent from '../components/extra-comments.js';
import MovieComponent from '../components/movie.js';
import MovieInfoComponent from '../components/movie-info.js';
import {render, remove} from '../utils/render.js';
import {getRatingMovies, getCommentsMovies} from '../utils/extra.js';
import {Sort, RenderPosition, SHOWING_MOVIES_ON_START} from '../const.js';

const SHOWING_MOVIES_BY_BUTTON = 5;

const getSorts = () => {
  return Object.values(Sort);
};

const renderMovie = (movieContainerElement, movie) => {
  const movieComponent = new MovieComponent(movie);

  const movieInfoComponent = new MovieInfoComponent(movie);

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
    render(document.body, movieInfoComponent, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, onKeyDown);
  };

  movieComponent.setPosterHandler(showInfoElement);
  movieComponent.setTitleHandler(showInfoElement);
  movieComponent.setCommentHandler(showInfoElement);

  movieInfoComponent.setCloseButtonHandler(hideInfoElement);

  render(movieContainerElement, movieComponent, RenderPosition.BEFOREEND);
};

const renderMovies = (movieContainerElement, movies) => {
  movies.forEach((movie) => {
    renderMovie(movieContainerElement, movie);
  });
};

export default class ScreenController {
  constructor(container) {
    this._container = container;
    this._filmsComponent = new FilmsComponent();
    this._sortsComponent = new SortComponent(getSorts());
    this._movieContainerComponent = new MovieContainerComponent();
  }

  render(allMovies) {

    const renderLoadMoreButton = (length) => {
      const loadButtonComponent = new ShowMoreComponent(length);
      if (!loadButtonComponent.getElement()) {
        return;
      }
      render(filmsListElement, loadButtonComponent, RenderPosition.BEFOREEND);

      const onButtonMoreClick = () => {
        const startMovie = showMovie;
        showMovie += SHOWING_MOVIES_BY_BUTTON;
        renderMovies(moviesContainerElement, allMovies.slice(startMovie, showMovie));
        if (showMovie >= allMovies.length) {
          remove(loadButtonComponent);
        }
      };
      loadButtonComponent.setButtonHandler(onButtonMoreClick);
    };

    if (allMovies.length === 0) {
      this._filmsComponent.setNoFilmsTemplate();
      render(this._container, this._filmsComponent, RenderPosition.BEFOREEND);
      return;
    }
    render(this._container, this._sortsComponent, RenderPosition.BEFOREEND);
    render(this._container, this._filmsComponent, RenderPosition.BEFOREEND);
    const filmsListElement = this._container.querySelector(`.films-list`);

    let showMovie = SHOWING_MOVIES_ON_START;

    render(filmsListElement, this._movieContainerComponent, RenderPosition.BEFOREEND);
    const moviesContainerElement = document.querySelector(`.films-list__container`);

    renderMovies(moviesContainerElement, allMovies.slice(0, showMovie));
    renderLoadMoreButton(allMovies.length);

    const filmsElement = document.querySelector(`.films`);

    const extraRatingMovies = getRatingMovies(allMovies);
    const extraRatingComponent = new ExtraRatingComponent(extraRatingMovies);
    const extraRatingMoviesContainer = extraRatingComponent.getElement().querySelector(`.films-list__container`);

    if (extraRatingMoviesContainer) {
      extraRatingMovies.forEach((movie) => {
        renderMovie(extraRatingMoviesContainer, movie);
      });
      render(filmsElement, extraRatingComponent, RenderPosition.BEFOREEND);
    }

    const extraCommentsMovies = getCommentsMovies(allMovies);
    const extraCommentsComponent = new ExtraCommentsComponent(extraCommentsMovies);
    const extraCommentsMoviesContainer = extraCommentsComponent.getElement().querySelector(`.films-list__container`);

    if (extraCommentsMoviesContainer) {
      extraCommentsMovies.forEach((movie) => {
        renderMovie(extraCommentsMoviesContainer, movie);
      });
      render(filmsElement, extraCommentsComponent, RenderPosition.BEFOREEND);
    }

    this._sortsComponent.setSortTypeChangeHandler((sortType) => {
      let sortMovies = [];
      switch (sortType) {
        case Sort.DATE:
          sortMovies = allMovies.slice().sort((leftFilm, rightFilm) => rightFilm.filmInfo.release.date - leftFilm.filmInfo.release.date);
          break;
        case Sort.RATING:
          sortMovies = allMovies.slice().sort((leftFilm, rightFilm) => rightFilm.filmInfo.totalRating - leftFilm.filmInfo.totalRating);
          break;
        case Sort.DEFAULT:
          showMovie = SHOWING_MOVIES_ON_START;
          sortMovies = allMovies.slice(0, showMovie);
          break;
      }

      moviesContainerElement.innerHTML = ``;
      renderMovies(moviesContainerElement, sortMovies);

      const buttonElement = this._filmsComponent.getElement().querySelector(`.films-list__show-more`);

      if (buttonElement) {
        buttonElement.remove();
      }

      if (sortType === Sort.DEFAULT) {
        renderLoadMoreButton(allMovies.length);
      }
    });

  }
}
