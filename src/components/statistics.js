import SmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getStatusName, getAlreadyWatched} from '../utils/common.js';


const BAR_COLOR = `#ffe800`;

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
  console.log(labelsChart)
  console.log(dataChart)
  const chhart = new Chart(ctx, {
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
      // plugins: {
      //   datasets: [{
      //     data: dataChart
      //   }]
      // },
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
          // formatter(value) {
          //   return `€ ${value}`;
          // },
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
  console.dir(chhart)
  return chhart;
};

const createStatisticsTemplate = (movies) => {
  const allWatched = movies.filter((movie) => movie.userDetails.alreadyWatched);
  const countAllWatched = allWatched.length;
  const totalDurationInMinutes = allWatched.reduce((accumulator, movie) => {
    const count = accumulator += movie.userDetails.watchingDate.getMinutes();
    return count;
  }, 0);
  const hours = Math.floor(totalDurationInMinutes / 60);
  const minutes = totalDurationInMinutes % 60;
  const topGenreResult = getGenresWithCount(allWatched)[0];
  const genre = topGenreResult ? topGenreResult.genre : `-`;
  const statusName = getStatusName(getAlreadyWatched(movies));

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

export default class Statistics extends SmartComponent {
  constructor(movies) {
    super();

    this._movies = movies.getAllMovies();
  }

  getTemplate() {
    return createStatisticsTemplate(this._movies);
  }

  renderChart() {
    const context = this.getElement().querySelector(`.statistic__chart`).getContext(`2d`);
    const movies = getGenresWithCount(this._movies)
    renderChart(context, movies);
  }
}
