import SortComponent from '../components/sort.js';
import FilmsComponent from '../components/films.js';
import MovieContainerComponent from '../components/movies-container.js';
import ShowMoreComponent from '../components/show-more.js';
import ExtraRatingComponent from '../components/extra-rating.js';
import ExtraCommentsComponent from '../components/extra-comments.js';
import MovieController, {Type, Mode} from './movie.js';
import {render, remove} from '../utils/render.js';
import {getRatingMovies, getCommentsMovies} from '../utils/extra.js';
import {Sort, RenderPosition, SHOWING_MOVIES_ON_START} from '../const.js';
import {Filter} from '../const.js';

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
  constructor(container, moviesModel, api) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._api = api;
    this._showedMovieControllers = [];
    this._extraRatingControllers = [];
    this._extraCommentControllers = [];
    this._showingMoviesCount = SHOWING_MOVIES_ON_START;
    this._filmsComponent = new FilmsComponent();
    this._sortsComponent = new SortComponent(getSorts());
    this._movieContainerComponent = new MovieContainerComponent();
    this._loadMoreButtomComponent = null;
    this._extraRatingComponent = null;
    this._extraCommentsComponent = null;
    this._sortType = Sort.DEFAULT;

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

    this._renderMovies(movies.slice(0, this._showingMoviesCount));
    this._renderLoadMoreButton(movies.length);

    this._renderExtraRatingSection();

    this._renderExtraCommentsSection();
  }

  hide() {
    this._sortsComponent.hide();
    this._filmsComponent.hide();
  }

  show() {
    this._sortsComponent.show();
    this._filmsComponent.show();
  }

  _onFilterChange() {
    if (this._showedMovieControllers.length > 0) {
      this._removeMovies();
    }
    if (this._sortType !== Sort.DEFAULT) {
      const movies = this._determineSortMovies(this._sortType);
      this._renderMovies(movies);
      return;
    }
    this._renderMovies(this._moviesModel.getMovies().slice(0, SHOWING_MOVIES_ON_START));
    this._renderLoadMoreButton(this._moviesModel.getMovies().length);
  }

  _renderMovies(movies) {
    const container = document.querySelector(`.films-list__container`);
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
    const sortMovies = this._determineSortMovies(sortType);
    this._removeMovies();
    this._renderMovies(sortMovies);

    if (sortType === Sort.DEFAULT) {
      this._renderLoadMoreButton(movies.length);
    } else if (this._loadMoreButtomComponent && this._container.contains(this._loadMoreButtomComponent.getElement())) {
      remove(this._loadMoreButtomComponent);
    }
  }

  _determineSortMovies(sortType) {
    this._sortType = sortType;
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
    return sortMovies;
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
    this._renderMovies(movies.slice(startMovie, this._showingMoviesCount));
    if (this._showingMoviesCount >= movies.length) {
      remove(this._loadMoreButtomComponent);
    }
  }

  _onDataChange(movieController, oldData, newData, idComment) {
    if (newData === null) {
      this._api.deleteComment(idComment)
        .then(() => {
          const isSuccess = this._moviesModel.removeComment(oldData.id, idComment);
          if (isSuccess) {
            this._rerenderMovieController(movieController, this._moviesModel.getMovie(oldData.id));
          }
        })
        .catch(() => {
          movieController.shake();
        });
      return;
    }

    if (oldData === null) {
      this._api.createComment(movieController.getId(), newData)
        .then((response) => {
          const newComment = response.find((it) => it.comment === newData.comment);
          this._moviesModel.setComments(newComment);
          this._moviesModel.addCommentToMovie(movieController.getId(), newComment.id);
          this._rerenderMovieController(movieController, this._moviesModel.getMovie(movieController.getId()));
        })
        .catch(() => {
          movieController.shake();
        });
      return;
    }

    this._api.updateMovie(oldData.id, newData)
      .then((response) => {
        const isSuccess = this._moviesModel.updateMovie(oldData.id, response);
        if (isSuccess) {
          this._rerenderMovieController(movieController, this._moviesModel.getMovie(response.id));
        }
      })
      .catch(() => {
        movieController.shake();
      });
  }

  _rerenderMovieController(movieController, newData) {
    if (movieController.type === Type.USUAL) {
      movieController.render(newData);
      this._removeExtraComponents();
      this._renderExtraRatingSection();
      this._renderExtraCommentsSection();
      if (this._moviesModel.getActiveFilterName() !== Filter.ALL) {
        this._onFilterChange();
      }
    }

    if (movieController.type === Type.EXTRA && movieController.mode === Mode.DEFAULT) {
      const extraRatingController = this._extraRatingControllers.find((movieExtraController) => movieExtraController._id === movieController._id);
      if (extraRatingController) {
        extraRatingController.render(newData);
      }
      const extraCommentsController = this._extraCommentControllers.find((movieExtraController) => movieExtraController._id === movieController._id);
      if (extraCommentsController) {
        extraCommentsController.render(newData);
      }
      this._onFilterChange();
    }

    if (movieController.type === Type.EXTRA && movieController.mode === Mode.EDIT) {
      movieController.render(newData);
      movieController.setCloseHandler(() => {
        this._removeExtraComponents();
        this._renderExtraRatingSection();
        this._renderExtraCommentsSection();
      });
      if (this._moviesModel.getActiveFilterName() !== Filter.ALL) {
        this._onFilterChange();
      } else {
        const ordinaryMovieController = this._showedMovieControllers.find((showedMovieController) => showedMovieController._id === movieController._id);
        if (ordinaryMovieController) {
          ordinaryMovieController.render(newData);
        }
      }
    }
  }

  _removeExtraComponents() {
    remove(this._extraRatingComponent);
    remove(this._extraCommentsComponent);
  }

  _renderExtraRatingSection() {
    const filmsElement = document.querySelector(`.films`);
    const extraRatingMovies = getRatingMovies(this._moviesModel.getAllMovies());
    this._extraRatingComponent = new ExtraRatingComponent(extraRatingMovies);
    if (this._extraRatingComponent.getElement()) {
      const extraRatingMoviesContainer = this._extraRatingComponent.getElement().querySelector(`.films-list__container`);
      this._extraRatingControllers = renderMovies(extraRatingMoviesContainer, extraRatingMovies, this._onDataChange, this._onViewChange);
      this._extraRatingControllers.forEach((controller) => {
        controller.type = Type.EXTRA;
      });
      render(filmsElement, this._extraRatingComponent, RenderPosition.BEFOREEND);
    }
  }

  _renderExtraCommentsSection() {
    const filmsElement = document.querySelector(`.films`);
    const extraCommentsMovies = getCommentsMovies(this._moviesModel.getAllMovies());
    this._extraCommentsComponent = new ExtraCommentsComponent(extraCommentsMovies);
    if (this._extraCommentsComponent.getElement()) {
      const extraCommentsMoviesContainer = this._extraCommentsComponent.getElement().querySelector(`.films-list__container`);
      this._extraCommentControllers = renderMovies(extraCommentsMoviesContainer, extraCommentsMovies, this._onDataChange, this._onViewChange);
      this._extraCommentControllers.forEach((controller) => {
        controller.type = Type.EXTRA;
      });
      render(filmsElement, this._extraCommentsComponent, RenderPosition.BEFOREEND);
    }
  }
}
