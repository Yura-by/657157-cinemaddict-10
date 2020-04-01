import ProfileComponent from './components/profile.js';
import FooterComponent from './components/footer.js';
import StatisticsComponent from './components/statistics.js';
// import {generateMovies} from './mock/movie.js';
import {RenderPosition, Menu} from './const.js';
import PageController from './controllers/page.js';
import {render} from './utils/render.js';
import MoviesModel from './models/movies.js';
import FilterController from './controllers/filter.js';
// import {getComments} from './mock/movie.js';
import {getAlreadyWatched} from './utils/common.js';
import API from './api.js';

const AUTHORIZATION = `Basic HHITupoijk40981uk=6890`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict/`;

const api = new API(END_POINT, AUTHORIZATION);



// const COUNT_MOVIES = 7;

// const movies = generateMovies(COUNT_MOVIES);

const moviesModel = new MoviesModel();

// moviesModel.setMovies(movies);

// movies.forEach((movie) => {
//   moviesModel.setComments(getComments(movie.comments));
// });

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const filterController = new FilterController(mainElement, moviesModel);
const pageController = new PageController(mainElement, moviesModel);
const statisticsComponent = new StatisticsComponent(moviesModel, new Date());

api.getMovies()
  .then((response) => {
    moviesModel.setMovies(response);
    return response;
  })
  .then((response) => {
    return Promise.all(response.map((movie) => api.getComments(movie.id)));
  })
  .then((response) => {
    response.forEach((it) => {
      moviesModel.setComments(it);
    })
    render(headerElement, new ProfileComponent(getAlreadyWatched(moviesModel.getAllMovies())), RenderPosition.BEFOREEND);
    filterController.render();
    render(document.body, new FooterComponent(moviesModel.getAllMovies()), RenderPosition.BEFOREEND);
    pageController.render();
    render(mainElement, statisticsComponent, RenderPosition.BEFOREEND);
    statisticsComponent.hide();

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

// statisticsComponent.hide();
  // });

  //   render(headerElement, new ProfileComponent(getAlreadyWatched(moviesModel.getAllMovies())), RenderPosition.BEFOREEND);
  //   filterController.render();
  //   render(document.body, new FooterComponent(moviesModel.getAllMovies()), RenderPosition.BEFOREEND);
  //   pageController.render();
  //   render(mainElement, statisticsComponent, RenderPosition.BEFOREEND);
  //   statisticsComponent.hide();

  //   filterController.setMenuChangeHandler((menuItem) => {
  //     switch (menuItem) {
  //       case Menu.STATS:
  //         pageController.hide();
  //         statisticsComponent.show();
  //         return;
  //       case Menu.PAGE:
  //         pageController.show();
  //         statisticsComponent.hide();
  //         return;
  //     }
  //   });
  // });

// statisticsComponent.hide();

// filterController.setMenuChangeHandler((menuItem) => {
//   switch (menuItem) {
//     case Menu.STATS:
//       pageController.hide();
//       statisticsComponent.show();
//       return;
//     case Menu.PAGE:
//       pageController.show();
//       statisticsComponent.hide();
//       return;
//   }
// });
