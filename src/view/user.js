import {UserStatus, EMPTY_STRING} from "../constants";
import AbstractView from "./abstract";

const NOVICE_MIN_QUANTITY = 1;
const FAN_MIN_QUANTITY = 11;
const MOVIE_BUFF_MIN_QUANTITY = 21;

const getUserStatus = (films) => {
  const quantityWatchedFilms = films.filter((film) => !film.userDetails.watchlist).length;
  let status = EMPTY_STRING;

  if (quantityWatchedFilms >= NOVICE_MIN_QUANTITY && quantityWatchedFilms < FAN_MIN_QUANTITY) {
    status = UserStatus.NOVICE;
  } else if (quantityWatchedFilms >= FAN_MIN_QUANTITY && quantityWatchedFilms < MOVIE_BUFF_MIN_QUANTITY) {
    status = UserStatus.FAN;
  } else if (quantityWatchedFilms >= MOVIE_BUFF_MIN_QUANTITY) {
    status = UserStatus.MOVIE_BUFF;
  }
  return status;
};

const createUserTemplate = (films) => {
  const status = getUserStatus(films);
  return `
    <section class="header__profile profile">
      ${status ? `<p class="profile__rating">${status}</p>` : EMPTY_STRING}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
};

class UserView extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createUserTemplate(this._films);
  }
}

export default UserView;


