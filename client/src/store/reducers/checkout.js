import {
  SET_SELECTED_SEATS,
  SET_SELECTED_CINEMA,
  SET_SELECTED_DATE,
  SET_SELECTED_TIME,
  TOGGLE_LOGIN_POPUP,
  SHOW_INVITATION_FORM,
  RESET_CHECKOUT,
  SET_INVITATION,
  SET_SUGGESTED_SEATS,
  SET_QR_CODE,
  SET_SEATS,
  SHOW_CONCESSION,
  SET_SELECTED_FOOD,
  SET_SHOW_CONCESSION,
  SET_IS_RESERVED,
  SET_IS_PAYMENT,
  SET_IS_EXPIRE_ORDER, RESET_ORDER_EXPIRE,
} from '../types';

const initialState = {
  selectedSeats: [],
  suggestedSeat: [],
  selectedCinema: '',
  selectedDate: new Date(),
  selectedTime: '',
  showLoginPopup: false,
  showInvitation: false,
  invitations: {},
  QRCode: '',
  showConcession:false,
  isReserved:false,
  isPayment:false,
  isExpireOrder:false
};

const setSelectedSeats = (state, seats) => {
  let newSeats = [];
  const seatExist = state.selectedSeats.find(
    seat => seat.id === seats.id
  );
  !seatExist
    ? (newSeats = [...state.selectedSeats, seats])
    : (newSeats = state.selectedSeats.filter(
        seat => seat.id !== seats.id
      ));
  return {
    ...state,
    selectedSeats: newSeats
  };
};

const setSuggestedSeats = (state, seats) => {
  let newSeats = [];

  newSeats = [...state.suggestedSeat, seats];

  return {
    ...state,
    suggestedSeat: newSeats
  };
};


const setSelectedCinema = (state, selectedCinema) => ({
  ...state,
  selectedCinema
});
const setSelectedDate = (state, selectedDate) => ({
  ...state,
  selectedDate
});

const setSelectedTime = (state, selectedTime) => ({
  ...state,
  selectedTime
});

const setInvitation = (state, event) => {
  return {
    ...state,
    invitations: {
      ...state.invitations,
      [event.target.name]: event.target.value
    }
  };
};

const setQRCode = (state, QRCode) => ({
  ...state,
  QRCode
});

const toggleLoginPopup = state => ({
  ...state,
  showLoginPopup: !state.showLoginPopup
});

const showInvitationForm = state => ({
  ...state,
  showInvitation: !state.showInvitation
});

const setShowedConcession = state => ({
  ...state,
  showConcession: !state.showConcession
});


const setSeats = (state, seats) => {
  return {
    ...state,
    seats
  }
};

export const setPayment = (state) => ({
    ...state,
    isPayment:!state.isPayment
});


export const setExpireOrder = (state) => {
  return {
    ...state,
    isExpireOrder:!state.isExpireOrder
  }
};

export const setReserved = (state) => ({
    ...state,
    isReserved:!state.isReserved
});



const resetCheckout = () => initialState;


const resetOrderExpire = () => initialState;

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_SELECTED_SEATS:
      return setSelectedSeats(state, payload);
    case SET_SUGGESTED_SEATS:
      return setSuggestedSeats(state, payload);
    case SET_SELECTED_CINEMA:
      return setSelectedCinema(state, payload);
    case SET_SELECTED_DATE:
      return setSelectedDate(state, payload);
    case SET_SELECTED_TIME:
      return setSelectedTime(state, payload);
    case SET_INVITATION:
      return setInvitation(state, payload);
    case TOGGLE_LOGIN_POPUP:
      return toggleLoginPopup(state);
    case SHOW_INVITATION_FORM:
      return showInvitationForm(state);
    case SET_QR_CODE:
      return setQRCode(state, payload);
    case RESET_CHECKOUT:
      return resetCheckout();
    case SET_SEATS:
      return setSeats(state,payload);
    case SET_SHOW_CONCESSION:
      return setShowedConcession(state);
    case SET_IS_RESERVED:
      return setReserved(state);
    case SET_IS_PAYMENT:
      return setPayment(state);
    case SET_IS_EXPIRE_ORDER:
      return setExpireOrder(state);
    case RESET_ORDER_EXPIRE:
      return resetOrderExpire(state);
    default:
      return state;
  }
}
