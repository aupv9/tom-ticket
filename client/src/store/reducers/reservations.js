import {
  GET_RESERVATIONS,
  GET_RESERVATION_SUGGESTED_SEATS,
  GET_SEATS_BY_SHOWTIME,
  SET_ORDER_NON_PAYMENT, SET_IS_APPLY_PROMOTION,
} from '../types';

const initialState = {
  reservations: [],
  orderNow:{},
  isApplyPromotionCode:false
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

const setOrderNonPayment = (state, payload) => ({
  ...state,
  orderNow: payload
});

const setApplyPromotionCode = (state) => {
  return {
    ...state,
    isApplyPromotionCode: !state.isApplyPromotionCode
  }
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_RESERVATIONS:
      return getReservations(state, payload);
    case GET_RESERVATION_SUGGESTED_SEATS:
      return getReservationSuggestedSeats(state, payload);
    case GET_SEATS_BY_SHOWTIME:
      return getSeatsByShowtime(state, payload);
    case SET_ORDER_NON_PAYMENT:
      return setOrderNonPayment(state, payload);
    case SET_IS_APPLY_PROMOTION:
      return setApplyPromotionCode(state);
    default:
      return state;
  }
};
