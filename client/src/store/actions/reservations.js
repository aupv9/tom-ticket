import {
  GET_RESERVATIONS,
  GET_RESERVATION_SUGGESTED_SEATS,
  GET_SHOWTIME,
  GET_SEATS_BY_SHOWTIME,
  SET_ORDER_NON_PAYMENT, SET_IS_APPLY_PROMOTION, SET_HISTORY_ORDER, SUB_NEWSLETTER,
} from '../types';
import { setAlert } from './alert';


const host = "http://localhost:8080/api/v1";



export const getSeatsByShowTime = (theater,movie,date,time) => async dispatch =>{
  try {
    const url = host + `/getSeatsByShowTime?theater=${theater}&date=${date}&movie=${movie}&time=${time}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const seats = await response.json();
    if (response.ok) {
      dispatch({ type: GET_SEATS_BY_SHOWTIME, payload: seats.content });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
}


export const getReservations = () => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/reservations';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const reservations = await response.json();
    if (response.ok) {
      dispatch({ type: GET_RESERVATIONS, payload: reservations });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const getSuggestedReservationSeats = username => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/reservations/usermodeling/' + username;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const reservationSeats = await response.json();
    if (response.ok) {
      dispatch({
        type: GET_RESERVATION_SUGGESTED_SEATS,
        payload: reservationSeats
      });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const addReservation = reservation => async dispatch => {
  try {
    const token = localStorage.getItem('token');
    const url = host + '/ordersAnonymous';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservation)
    });
    if (response.ok) {
      const data = await response.json();
      dispatch({ type: SET_ORDER_NON_PAYMENT, payload: data });
      dispatch(setAlert('Reservation Created', 'success', 5000));
      return {
        status: 'success',
        message: 'Reservation Created',
        data: { data }
      };
    }else{
      dispatch(setAlert('Reservation Failure', 'error', 5000));
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: ' Reservation have not been created, try again.'
    };
  }
};

export const updateReservation = (reservation, id) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/reservations/' + id;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservation)
    });
    if (response.ok) {
      dispatch(setAlert('Reservation Updated', 'success', 5000));
      return { status: 'success', message: 'Reservation Updated' };
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: ' Reservation have not been updated, try again.'
    };
  }
};

export const removeReservation = id => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/reservations/' + id;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      dispatch(setAlert('Reservation Deleted', 'success', 5000));
      return { status: 'success', message: 'Reservation Removed' };
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: ' Reservation have not been deleted, try again.'
    };
  }
};



export const checkPromotionCode = (code,movie) => async dispatch => {
  try {
    const token = localStorage.getItem('token');
    const url = host + `/checkCode?code=${code}&movie=${movie}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(setAlert('Apply Code Success', 'success', 5000));
      dispatch({ type: SET_IS_APPLY_PROMOTION });
      return { status: 'success',
        message: 'Apply Code Success' ,
        data:data
      };
    }else{
      dispatch(setAlert('Promotion Code Invalid or Expire', 'error', 5000));
    }
  } catch (error) {
    dispatch(setAlert("Promotion Code Invalid or Expire", 'error', 5000));
    return {
      status: 'error',
      message: 'Promotion Code Invalid or Expire'
    };
  }
};


export const getOrderHistory = (user) => async dispatch => {
  try {
    const token = localStorage.getItem('token');
    const url = host + `/orders-user?user_id=${user}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      // dispatch(setAlert('Apply Code Success', 'success', 5000));
      dispatch({ type: SET_HISTORY_ORDER,payload:data.content});
    }
  } catch (error) {
    // dispatch(setAlert("Promotion Code Invalid or Expire", 'error', 5000));
    return {
      status: 'error',
      message: 'Promotion Code Invalid or Expire'
    };
  }
};


export const subNewsletter = (email) => async dispatch => {
  try {
    const url = host + `/newsletter`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({email})
    });
    if (response.ok) {
      dispatch(setAlert('Subscribe Succession', 'success', 3000));
    }
  } catch (error) {
    // dispatch(setAlert("Promotion Code Invalid or Expire", 'error', 5000));
    return {
      status: 'error',
      message: 'Subscribe Failure'
    };
  }
};

// export const subNewsletter = (email) => ({ type: SUB_NEWSLETTER,payload:email });

