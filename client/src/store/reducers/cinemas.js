import { GET_CINEMAS, GET_CINEMA,GET_CINEMAS_MOVIE } from '../types';

const initialState = {
  cinemas: [],
  selectedCinema: null
};


const getCinemasByMovie = (state, payload) => ({
  ...state,
  cinemas: payload
});

const getCinemas = (state, payload) => ({
  ...state,
  cinemas: payload
});

const getCinema = (state, payload) => ({
  ...state,
  selectedCinema: payload
});

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_CINEMAS:
      return getCinemas(state, payload);
    case GET_CINEMA:
      return getCinema(state, payload);
    case GET_CINEMAS_MOVIE:
      return getCinemasByMovie(state, payload);
    default:
      return state;
  }
};
