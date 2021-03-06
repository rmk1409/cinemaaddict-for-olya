import FilmsModel from "../model/films";
import {commentAdaptToServer} from "../utils/util";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`,
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

class Server {
  constructor(url, authorization) {
    this._url = url;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({url: `movies`})
      .then(Server.toJSON)
      .then((films) => films.map(FilmsModel.adaptToClient));
  }

  getComments(filmId) {
    return this._load({url: `comments/${filmId}`})
      .then(Server.toJSON);
  }

  deleteComments(id) {
    return this._load({url: `comments/${id}`, method: Method.DELETE});
  }

  addComment(film, newComment) {
    const adaptedCommentToServer = commentAdaptToServer(newComment);
    return this._load({
      url: `comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(adaptedCommentToServer),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then(Server.toJSON);
  }

  updateFilm(film) {
    const adaptedFilmToServer = FilmsModel.adaptToServer(film);
    return this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(adaptedFilmToServer),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then(Server.toJSON)
      .then(FilmsModel.adaptToClient);
  }

  sync(films) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(films),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Server.toJSON);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);
    return fetch(`${this._url}/${url}`, {method, body, headers})
      .then(Server.checkStatus)
      .catch(Server.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}

export default Server;
