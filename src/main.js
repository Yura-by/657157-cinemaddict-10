import ProfileComponent from './components/profile.js';
import FooterComponent from './components/footer.js';
import StatisticsComponent from './components/statistics.js';
import {generateMovies} from './mock/movie.js';
import {RenderPosition, Menu} from './const.js';
import PageController from './controllers/page.js';
import {render} from './utils/render.js';
import MoviesModel from './models/movies.js';
import FilterController from './controllers/filter.js';
import {getComments} from './mock/movie.js';
import {getAlreadyWatched} from './utils/common.js';

const COUNT_MOVIES = 2;

const movies = generateMovies(COUNT_MOVIES);

const moviesModel = new MoviesModel();

moviesModel.setMovies(movies);

movies.forEach((movie) => {
  moviesModel.setComments(getComments(movie.comments));
});

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

render(headerElement, new ProfileComponent(getAlreadyWatched(movies)), RenderPosition.BEFOREEND);
const filterController = new FilterController(mainElement, moviesModel);
filterController.render();

render(document.body, new FooterComponent(movies), RenderPosition.BEFOREEND);

const pageController = new PageController(mainElement, moviesModel);

pageController.render();

const statisticsComponent = new StatisticsComponent(moviesModel);

render(mainElement, statisticsComponent, RenderPosition.BEFOREEND);

statisticsComponent.hide();

statisticsComponent.renderChart();

filterController.setMenuChangeHandler((menuItem) => {
  switch (menuItem) {
    case Menu.STATS:
      pageController.hide();
      statisticsComponent.show();
      return;
    case Menu.PAGE:
      pageController.show();
      statisticsComponent.hide();
      return;
  }
});
