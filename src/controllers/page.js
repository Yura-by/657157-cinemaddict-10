import SortComponent from '../components/sort.js';
import FilmsComponent from '../components/films.js';
import MovieContainerComponent from '../components/movies-container.js';
import ShowMoreComponent from '../components/show-more.js';
import ExtraRatingComponent from '../components/extra-rating.js';
import ExtraCommentsComponent from '../components/extra-comments.js';
import MovieController from './movie.js';
import {render, remove} from '../utils/render.js';
import {getRatingMovies, getCommentsMovies} from '../utils/extra.js';
import {Sort, RenderPosition, SHOWING_MOVIES_ON_START} from '../const.js';

const SHOWING_MOVIES_BY_BUTTON = 5;

const getSorts = () => {
  return Object.values(Sort);
};

const renderMovies = (movieListElement, movies, onDataChange, onViewChange) => {
  return movies.map((movie) => {
    const movieController = new MovieController(movieListElement, onDataChange, onViewChange);
    movieController.render(movie);
    return movieController;
  });
};

export default class PageController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._showedMovieControllers = [];
    this._extraRatingControllers = [];
    this._extraCommentControllers = [];
    this._showingMoviesCount = SHOWING_MOVIES_ON_START;
    this._filmsComponent = new FilmsComponent();
    this._sortsComponent = new SortComponent(getSorts());
    this._movieContainerComponent = new MovieContainerComponent();
    this._loadMoreButtomComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortsComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render() {
    const movies = this._moviesModel.getMovies();

    if (movies.length === 0) {
      this._filmsComponent.setNoFilmsTemplate();
      render(this._container, this._filmsComponent, RenderPosition.BEFOREEND);
      return;
    }
    render(this._container, this._sortsComponent, RenderPosition.BEFOREEND);
    render(this._container, this._filmsComponent, RenderPosition.BEFOREEND);
    const filmsListElement = this._container.querySelector(`.films-list`);

    render(filmsListElement, this._movieContainerComponent, RenderPosition.BEFOREEND);
    const moviesContainerElement = document.querySelector(`.films-list__container`);

    this._showedMovieControllers = renderMovies(moviesContainerElement, movies.slice(0, this._showingMoviesCount), this._onDataChange, this._onViewChange);

    this._renderLoadMoreButton(movies.length, filmsListElement, moviesContainerElement);

    const filmsElement = document.querySelector(`.films`);

    this._renderExtraRatingSection(filmsElement);

    this._renderExtraCommentsSection(filmsElement);
  }

  _onFilterChange() {
    this._removeMovies();
    this._renderMovies(this._moviesModel.getMovies().slice(0, SHOWING_MOVIES_ON_START));
    thi.__renderLoadMoreButton();
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((movieContorller) => movieContorller.setDefaultView());
    this._extraRatingControllers.forEach((movieContorller) => movieContorller.setDefaultView());
    this._extraCommentControllers.forEach((movieContorller) => movieContorller.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const movies = this._moviesModel.getMovies();
    let sortMovies = [];
    switch (sortType) {
      case Sort.DATE:
        sortMovies = movies.slice().sort((leftFilm, rightFilm) => rightFilm.filmInfo.release.date - leftFilm.filmInfo.release.date);
        break;
      case Sort.RATING:
        sortMovies = movies.slice().sort((leftFilm, rightFilm) => rightFilm.filmInfo.totalRating - leftFilm.filmInfo.totalRating);
        break;
      case Sort.DEFAULT:
        this._showingMoviesCount = SHOWING_MOVIES_ON_START;
        sortMovies = movies.slice(0, this._showingMoviesCount);
        break;
    }
    const moviesContainerElement = document.querySelector(`.films-list__container`);

    moviesContainerElement.innerHTML = ``;
    this._showedMovieControllers = renderMovies(moviesContainerElement, sortMovies, this._onDataChange, this._onViewChange);

    if (this._loadMoreButtomComponent) {
      remove(this._loadMoreButtomComponent);
    }

    const filmsListElement = this._container.querySelector(`.films-list`);

    if (sortType === Sort.DEFAULT) {
      this._renderLoadMoreButton(movies.length, filmsListElement, moviesContainerElement);
    }
  }

  _renderLoadMoreButton(length, buttonContainerElement, moviesContainerElement) {
    const movies = this._moviesModel.getMovies();
    this._loadMoreButtomComponent = new ShowMoreComponent(length);
    if (!this._loadMoreButtomComponent.getElement()) {
      return;
    }
    render(buttonContainerElement, this._loadMoreButtomComponent, RenderPosition.BEFOREEND);

    const onButtonMoreClick = () => {
      const startMovie = this._showingMoviesCount;
      this._showingMoviesCount += SHOWING_MOVIES_BY_BUTTON;
      const newMovingContollers = renderMovies(moviesContainerElement, movies.slice(startMovie, this._showingMoviesCount), this._onDataChange, this._onViewChange);
      this._showedMovieControllers = this._showedMovieControllers.concat(newMovingContollers);
      if (this._showingMoviesCount >= movies.length) {
        remove(this._loadMoreButtomComponent);
      }
    };
    this._loadMoreButtomComponent.setButtonHandler(onButtonMoreClick);
  }

  _onDataChange(movieController, oldData, newData) {
    const isSuccess = this._moviesModel.updateMovie(oldData.id, newData);

    if (isSuccess) {
      movieController.render(newData);
    }
  }

  _renderExtraRatingSection(container) {
    const extraRatingMovies = getRatingMovies(this._moviesModel.getAllMovies());
    const extraRatingComponent = new ExtraRatingComponent(extraRatingMovies);
    const extraRatingMoviesContainer = extraRatingComponent.getElement().querySelector(`.films-list__container`);
    if (extraRatingMoviesContainer) {
      this._extraRatingControllers = renderMovies(extraRatingMoviesContainer, extraRatingMovies, this._onDataChange, this._onViewChange);

      render(container, extraRatingComponent, RenderPosition.BEFOREEND);
    }
  }

  _renderExtraCommentsSection(container) {
    const extraCommentsMovies = getCommentsMovies(this._moviesModel.getAllMovies());
    const extraCommentsComponent = new ExtraCommentsComponent(extraCommentsMovies);
    const extraCommentsMoviesContainer = extraCommentsComponent.getElement().querySelector(`.films-list__container`);
    if (extraCommentsMoviesContainer) {
      this._extraCommentControllers = renderMovies(extraCommentsMoviesContainer, extraCommentsMovies, this._onDataChange, this._onViewChange);

      render(container, extraCommentsComponent, RenderPosition.BEFOREEND);
    }
  }
}