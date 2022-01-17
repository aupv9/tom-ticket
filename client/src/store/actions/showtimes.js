import {
  TOGGLE_DIALOG,
  SELECT_SHOWTIMES,
  SELECT_ALL_SHOWTIMES,
  GET_SHOWTIMES,
  DELETE_SHOWTIME, GET_CINEMA, FILTER_SHOW, GET_SHOWTIME,
} from '../types';
import { setAlert } from './alert';

export const toggleDialog = () => ({ type: TOGGLE_DIALOG });

export const selectShowtime = showtime => ({
  type: SELECT_SHOWTIMES,
  payload: showtime
});
const host = "http://localhost:8080/api/v1"


export const selectAllShowtimes = () => ({ type: SELECT_ALL_SHOWTIMES });



export const getShowTimesFilter = (theater,movie,date) => async dispatch =>{
  try {
    const url = host + `/showByTheaterAnonymous?theater=${theater}&date=${date}&movie=${movie}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const showTimes = await response.json();
    if (response.ok) {
      dispatch({ type: FILTER_SHOW, payload: showTimes.content });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
}

export const getShowtimes = (theater,movie,date) => async dispatch => {
  try {
    const url = host + `/seatTheaterAnonymous?theater=${theater}&date=${date}&movie=${movie}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const showTimes = await response.json();
    if (response.ok) {
      dispatch({ type: FILTER_SHOW, payload: showTimes });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const addShowtime = showtime => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/showtimes/';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(showtime)
    });
    if (response.ok) {
      dispatch(setAlert('Showtime Created', 'success', 5000));
      return { status: 'success', message: 'Showtime Created' };
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: ' Cinema have not been saved, try again.'
    };
  }
};

export const updateShowtime = (showtime, id) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/showtimes/' + id;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(showtime)
    });
    if (response.ok) {
      dispatch(setAlert('Showtime Created', 'success', 5000));
      return { status: 'success', message: 'Showtime Created' };
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: ' Cinema have not been saved, try again.'
    };
  }
};

export const deleteShowtime = id => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/showtimes/' + id;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      dispatch({ type: DELETE_SHOWTIME, payload: id });
      dispatch(setAlert('Showtime Deleted', 'success', 5000));
      dispatch(getShowtimes());
      return { status: 'success', message: 'Showtime Removed' };
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: ' Showtime have not been deleted, try again.'
    };
  }
};
