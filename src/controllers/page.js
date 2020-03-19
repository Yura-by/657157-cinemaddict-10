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
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);

    this._sortsComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
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

    this._renderLoadMoreButton(movies.length);

    this._renderExtraRatingSection();

    this._renderExtraCommentsSection();
  }

  _onFilterChange() {
    if (this._showedMovieControllers.length > 0) {
      this._removeMovies();
    }
    const moviesContainerElement = this._container.querySelector(`.films-list__container`);
    this._renderMovies(moviesContainerElement, this._moviesModel.getMovies().slice(0, SHOWING_MOVIES_ON_START));
    this._renderLoadMoreButton(this._moviesModel.getMovies().length);
  }

  _renderMovies(container, movies) {
    const newMovies = renderMovies(container, movies, this._onDataChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);
    this._showingMoviesCount = this._showedMovieControllers.length;
  }

  _removeMovies() {
    const moviesContainerElement = this._container.querySelector(`.films-list__container`);
    moviesContainerElement.innerHTML = ``;
    this._showedMovieControllers = [];
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

    this._removeMovies();
    this._renderMovies(moviesContainerElement, sortMovies);

    if (sortType === Sort.DEFAULT) {
      this._renderLoadMoreButton(movies.length);
    } else if (this._loadMoreButtomComponent && this._container.contains(this._loadMoreButtomComponent.getElement())) {
      remove(this._loadMoreButtomComponent);
    }
  }

  _renderLoadMoreButton(length) {
    if (this._loadMoreButtomComponent && this._container.contains(this._loadMoreButtomComponent.getElement())) {
      remove(this._loadMoreButtomComponent);
    }
    const buttonContainerElement = this._container.querySelector(`.films-list`);
    this._loadMoreButtomComponent = new ShowMoreComponent(length);
    if (!this._loadMoreButtomComponent.getElement()) {
      return;
    }
    render(buttonContainerElement, this._loadMoreButtomComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtomComponent.setButtonHandler(this._onLoadMoreButtonClick);
  }

  _onLoadMoreButtonClick() {
    const startMovie = this._showingMoviesCount;
    this._showingMoviesCount += SHOWING_MOVIES_BY_BUTTON;
    const movies = this._moviesModel.getMovies();
    const moviesContainerElement = this._container.querySelector(`.films-list__container`);
    this._renderMovies(moviesContainerElement, movies.slice(startMovie, this._showingMoviesCount));
    if (this._showingMoviesCount >= movies.length) {
      remove(this._loadMoreButtomComponent);
    }
  }

  _onDataChange(movieController, oldData, newData) {
    const isSuccess = this._moviesModel.updateMovie(oldData.id, newData);

    if (isSuccess) {
      this._rerenderMovieController(movieController, newData);
    }
  }

  _rerenderMovieController(movieController, newData) {
    const ordinaryMovieController = this._showedMovieControllers.find((showedMovieController) => showedMovieController._id === movieController._id);
    if (ordinaryMovieController) {
      ordinaryMovieController.render(newData);
    }
    const extraRatingController = this._extraRatingControllers.find((movieExtraController) => movieExtraController._id === movieController._id);
    if (extraRatingController) {
      extraRatingController.render(newData);
    }
    const extraCommentsController = this._extraCommentControllers.find((movieExtraController) => movieExtraController._id === movieController._id);
    if (extraCommentsController) {
      extraCommentsController.render(newData);
    }
  }

  _renderExtraRatingSection() {
    const filmsElement = document.querySelector(`.films`);
    const extraRatingMovies = getRatingMovies(this._moviesModel.getAllMovies());
    const extraRatingComponent = new ExtraRatingComponent(extraRatingMovies);
    const extraRatingMoviesContainer = extraRatingComponent.getElement().querySelector(`.films-list__container`);
    if (extraRatingMoviesContainer) {
      this._extraRatingControllers = renderMovies(extraRatingMoviesContainer, extraRatingMovies, this._onDataChange, this._onViewChange);

      render(filmsElement, extraRatingComponent, RenderPosition.BEFOREEND);
    }
  }

  _renderExtraCommentsSection() {
    const filmsElement = document.querySelector(`.films`);
    const extraCommentsMovies = getCommentsMovies(this._moviesModel.getAllMovies());
    const extraCommentsComponent = new ExtraCommentsComponent(extraCommentsMovies);
    const extraCommentsMoviesContainer = extraCommentsComponent.getElement().querySelector(`.films-list__container`);
    if (extraCommentsMoviesContainer) {
      this._extraCommentControllers = renderMovies(extraCommentsMoviesContainer, extraCommentsMovies, this._onDataChange, this._onViewChange);

      render(filmsElement, extraCommentsComponent, RenderPosition.BEFOREEND);
    }
  }
}
