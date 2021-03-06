import SmartView from "./smart";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getUserStatus, getAllGenresToQuantity, calculateTotalDurationOfFilms, getPopularGenre} from "../utils/stats";
import {FilterType, TimePeriod, MINUTE_QUANTITY_IN_HOUR} from "../constants";
import {Filter, FilterTimePeriod} from "../utils/filter";

const renderStatisticChart = (statisticCtx, films) => {
  const BAR_HEIGHT = 50;
  const genresTwo = getAllGenresToQuantity(films);
  const genreNames = [...genresTwo.keys()];
  const genreQuantity = [...genresTwo.values()];
  statisticCtx.height = BAR_HEIGHT * genreQuantity.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genreNames,
      datasets: [{
        data: genreQuantity,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatsPageTemplate = (films, activePeriod) => {
  films = Filter[FilterType.HISTORY](films);
  const status = getUserStatus(films);
  films = FilterTimePeriod[activePeriod](films);
  const minutes = calculateTotalDurationOfFilms(films);
  const h = Math.floor((minutes / MINUTE_QUANTITY_IN_HOUR));
  const m = minutes % MINUTE_QUANTITY_IN_HOUR;
  const popularGenre = getPopularGenre(films);

  return `
  <section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${status}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${activePeriod === TimePeriod.ALL_TIME ? `checked` : ``}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${activePeriod === TimePeriod.TODAY ? `checked` : ``}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${activePeriod === TimePeriod.WEEK ? `checked` : ``}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${activePeriod === TimePeriod.MONTH ? `checked` : ``}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${activePeriod === TimePeriod.YEAR ? `checked` : ``}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${films.length} <span class="statistic__item-description">movies</span></p>
      </li>
      ${films.length ? `
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${h} <span class="statistic__item-description">h</span> ${m} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${popularGenre}</p>
      </li>` : ``}

    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

class Stats extends SmartView {
  constructor(films) {
    super(films);
    this._acvitePeriod = TimePeriod.ALL_TIME;
    this._statisticCart = null;
    this._setCharts();
    this._handlePeriodChange = this._handlePeriodChange.bind(this);
    this.setHandlePeriodChange();
  }

  removeElement() {
    super.removeElement();

    if (this._statisticCart !== null) {
      this._statisticCart = null;
    }
  }

  getTemplate() {
    return createStatsPageTemplate(this.data, this._acvitePeriod);
  }

  resetActivePeriod() {
    this._acvitePeriod = TimePeriod.ALL_TIME;
  }

  restoreHandlers() {
    this._setCharts();
    this.setHandlePeriodChange();
  }

  hide() {
    this.getElement().classList.add(`visually-hidden`);
  }

  show() {
    this.resetActivePeriod();
    this.getElement().classList.remove(`visually-hidden`);
  }

  _handlePeriodChange(evt) {
    this._acvitePeriod = evt.target.value;
    this.updateState(this.data, true);
  }

  setHandlePeriodChange() {
    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`change`, this._handlePeriodChange);
  }

  _setCharts() {
    if (this._statisticCart !== null) {
      this._statisticCart = null;
    }

    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);
    this._statisticCart = renderStatisticChart(statisticCtx, FilterTimePeriod[this._acvitePeriod](this.data));
  }
}

export default Stats;
