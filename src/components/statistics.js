import SmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getStatusName, getAlreadyWatched} from '../utils/common.js';
import moment from 'moment';

const BAR_COLOR = `#ffe800`;
const ID_PREFIX = `statistic-`;

const getCountGenre = (item, allGeneres) => {
  let count = 0;
  allGeneres.forEach((genre) => {
    if (genre === item) {
      count++;
    }
  });
  return count;
};

const getUniqItems = (array) => {
  return array.filter((item, index, arrayDefault) => {
    return arrayDefault.indexOf(item) === index;
  });
};

const getGenresWithCount = (movies) => {
  const allGeneres = [];
  movies.map((movie) => movie.filmInfo.genre)
    .forEach((genres) => {
      genres.forEach((genre) => {
        allGeneres.push(genre);
      });
    });
  const arrayResult = getUniqItems(allGeneres)
    .map((item) => {
      return {
        genre: item,
        count: getCountGenre(item, allGeneres)
      };
    });
  return arrayResult.sort((left, right) => right.count - left.count);
};

Chart.defaults.global.defaultFontColor = `#ffffff`;
Chart.defaults.global.defaultFontSize = 16;

const renderChart = (ctx, genres) => {
  const labelsChart = genres.map((item) => item.genre);
  const dataChart = genres.map((item) => Number(item.count));
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: labelsChart,
      datasets: [{
        data: dataChart,
        backgroundColor: Array(dataChart.length).fill(BAR_COLOR),
        barThickness: 20,
      }],
    },
    options: {
      layout: {
        padding: {
          left: 50,
          right: 0,
          top: 0,
          bottom: 0
        }
      },
      plugins: {
        datalabels: {
          labels: {
            title: {
              color: `white`,
              anchor: `start`,
              align: `left`
            }
          },
          font: {
            size: 16
          },
          color: `white`
        }
      },
      scales: {
        xAxes: [{
          display: false,
          ticks: {
            beginAtZero: true,
          },
        }],
        yAxes: [{
          ticks: {
            padding: 30,
          }
        }]
      },
      legend: {
        display: false
      },
    }
  });
};

const getWatchedMovies = (movies) => {
  return movies.filter((movie) => movie.userDetails.alreadyWatched);
};

const createStatisticsTemplate = (movies, allWatched) => {
  const countAllWatched = movies.length;
  const totalDurationInMinutes = movies.reduce((accumulator, movie) => {
    accumulator += movie.filmInfo.runtime;
    return accumulator;
  }, 0);
  const hours = Math.floor(totalDurationInMinutes / 60);
  const minutes = totalDurationInMinutes % 60;
  const topGenreResult = getGenresWithCount(movies)[0];
  const genre = topGenreResult ? topGenreResult.genre : `-`;
  const statusName = getStatusName(getAlreadyWatched(allWatched));

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${statusName}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${countAllWatched} <span class="statistic__item-description"> movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${hours ? hours : ``} <span class="statistic__item-description">${hours ? `h` : ``}</span> ${minutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${genre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`
  );
};

const Period = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const getIsOneDay = (dateNow, dateMovie) => {
  const momentNow = moment(dateNow);
  const momentMovie = moment(dateMovie);
  return momentNow.diff(momentMovie, `days`) === 0 && momentNow.get(`date`) === momentMovie.get(`date`);
};

const getMoviesInPeriod = (dateNow, period, movies) => {
  const moviesInPeriod = movies;
  let dateFrom = null;
  switch (period) {
    case Period.TODAY:
      return movies.filter((movie) => getIsOneDay(dateNow, movie.userDetails.watchingDate));
    case Period.WEEK:
      dateFrom = moment(dateNow).subtract(7, `days`);
      return movies.filter((movie) => {
        const wathingDate = movie.userDetails.watchingDate;
        return wathingDate >= dateFrom;
      });
    case Period.MONTH:
      dateFrom = moment(dateNow).subtract(1, `months`);
      return movies.filter((movie) => {
        const wathingDate = movie.userDetails.watchingDate;
        return wathingDate >= dateFrom;
      });
    case Period.YEAR:
      dateFrom = moment(dateNow).subtract(1, `years`);
      return movies.filter((movie) => {
        const wathingDate = movie.userDetails.watchingDate;
        return wathingDate >= dateFrom;
      });
  }
  return moviesInPeriod;
};

export default class Statistics extends SmartComponent {
  constructor(moviesModel, dateNow) {
    super();
    this._movies = moviesModel;
    this._watchedMovies = getWatchedMovies(moviesModel.getAllMovies());
    this._dateNow = dateNow;
    this._period = Period.ALL_TIME;
    this._chart = null;

    this._renderChart();
  }

  getTemplate() {
    return createStatisticsTemplate(this._watchedMovies, this._movies.getAllMovies());
  }

  rerender() {
    super.rerender();
    this._renderChart();
  }

  show() {
    this._watchedMovies = getWatchedMovies(this._movies.getAllMovies());
    this._period = Period.ALL_TIME;
    super.show();
    this.rerender();
  }

  recoveryListeners() {
    const formElement = this.getElement().querySelector(`.statistic__filters`);
    formElement.addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._period = evt.target.id.slice(ID_PREFIX.length);
      const allWatchedMovies = getWatchedMovies(this._movies.getAllMovies());
      this._watchedMovies = getMoviesInPeriod(this._dateNow, this._period, allWatchedMovies);
      this.rerender();
    });
  }

  _renderChart() {
    const context = this.getElement().querySelector(`.statistic__chart`).getContext(`2d`);
    this._setCheckedState(this._period);
    const movies = getMoviesInPeriod(this._dateNow, this._period, this._watchedMovies);
    const moviesComplete = getGenresWithCount(movies);
    this.recoveryListeners();

    this._resetChart();

    this._chart = renderChart(context, moviesComplete);
  }

  _setCheckedState(name) {
    this.getElement().querySelector(`#${ID_PREFIX}${name}`).checked = true;
  }

  _resetChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }
}
