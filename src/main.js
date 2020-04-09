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
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

// window.addEventListener(`load`, () => {
//   navigator.serviceWorker.register(`./sw.js`)
//    .then(() => {
//      console.log(`yes register`);
//    })
//    .catch(() => {
//      console.log(`no register`);
//    });
// });

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
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
