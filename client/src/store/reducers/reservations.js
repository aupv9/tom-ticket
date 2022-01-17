import { GET_RESERVATIONS, GET_RESERVATION_SUGGESTED_SEATS, GET_SEATS_BY_SHOWTIME } from '../types';

const initialState = {
  reservations: []
};

const getReservations = (state, payload) => ({
  ...state,
  reservations: payload
});

const getReservationSuggestedSeats = (state, payload) => ({
  ...state,
  suggestedSeats: payload
});

const getSeatsByShowtime = (state, payload) => ({
  ...state,
  seats: payload
});

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_RESERVATIONS:
      return getReservations(state, payload);
    case GET_RESERVATION_SUGGESTED_SEATS:
      return getReservationSuggestedSeats(state, payload);
    case GET_SEATS_BY_SHOWTIME:
      return getSeatsByShowtime(state, payload);
    default:
      return state;
  }
};
