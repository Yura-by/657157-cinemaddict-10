import ProfileComponent from './components/profile.js';
import FooterComponent from './components/footer.js';
import StatisticsComponent from './components/statistics.js';
import {RenderPosition, Menu} from './const.js';
import PageController from './controllers/page.js';
import {render} from './utils/render.js';
import MoviesModel from './models/movies.js';
import FilterController from './controllers/filter.js';
import {getAlreadyWatched} from './utils/common.js';
import Api from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const AUTHORIZATION = `Basic HHITupoijk40981uk=6890`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict/`;

const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_COMMENTS = `comments`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const STORE_COMMENTS_NAME = `${STORE_COMMENTS}-${STORE_VER}`;

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`)
   .then(() => {
   })
   .catch(() => {
   });
});

const api = new Api(END_POINT, AUTHORIZATION);

if (window.navigator.onLine) {
  window.localStorage.clear();
}
const store = new Store(STORE_NAME, STORE_COMMENTS_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const moviesModel = new MoviesModel();

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const filterController = new FilterController(mainElement, moviesModel);
const pageController = new PageController(mainElement, moviesModel, apiWithProvider);
const statisticsComponent = new StatisticsComponent(moviesModel, new Date());

apiWithProvider.getMovies()
  .then((response) => {
    moviesModel.setMovies(response);
    return response;
  })
  .then((response) => {
    return Promise.all(response.map((movie) => apiWithProvider.getComments(movie.id)));
  })
  .then((response) => {
    response.forEach((it) => {
      moviesModel.setComments(it);
    });
    render(headerElement, new ProfileComponent(getAlreadyWatched(moviesModel.getAllMovies())), RenderPosition.BEFOREEND);
    filterController.render();
    render(document.body, new FooterComponent(moviesModel.getAllMovies()), RenderPosition.BEFOREEND);
    pageController.render();
    render(mainElement, statisticsComponent, RenderPosition.BEFOREEND);

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
  });

statisticsComponent.hide();

window.addEventListener(`online`, () => {
  document.title = document.title.replace(`[offline]`, ``);
  if (!apiWithProvider.getSynchonize()) {
    apiWithProvider.sync()
    .catch((error) => {
      window.title = error;
    });
  }
});

window.addEventListener(`offline`, () => {
  document.title += `[offline]`;
});
