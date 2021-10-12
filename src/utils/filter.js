import {FilterType, TimePeriod} from "../constants";
import dayjs from "dayjs";

const Filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((f) => f.userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((f) => f.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter((f) => f.userDetails.favorite),
};

const FilterTimePeriod = {
  [TimePeriod.ALL_TIME]: (films) => films,
  [TimePeriod.TODAY]: (films) => films.filter((film) => {
    const today = dayjs();
    return today.diff(dayjs(film.userDetails.watchingDate), `day`) === 0;
  }),
  [TimePeriod.WEEK]: (films) => films.filter((film) => {
    const today = dayjs();
    const daysInAWeek = 7;
    return today.diff(dayjs(film.userDetails.watchingDate), `day`) <= daysInAWeek;
  }),
  [TimePeriod.MONTH]: (films) => films.filter((film) => {
    const today = dayjs();
    const daysInAMonth = 30;
    return today.diff(dayjs(film.userDetails.watchingDate), `day`) <= daysInAMonth;
  }),
  [TimePeriod.YEAR]: (films) => films.filter((film) => {
    const today = dayjs();
    const daysInAYear = 365;
    return today.diff(dayjs(film.userDetails.watchingDate), `year`) <= daysInAYear;
  }),
};

export {Filter, FilterTimePeriod};
