import { setAlert } from './alert';
import { ADD_FOOD, GET_CONCESSIONS, REMOVE_FOOD, SET_SELECTED_FOOD, SET_SUB_TOTAL } from '../types';


const host = "http://localhost:8080/api/v1";


export const getConcession = () => async dispatch => {
  try {
    const url = host + '/concessions';
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const concessions = await response.json();
    if (response.ok) {
      dispatch({ type: GET_CONCESSIONS, payload: concessions.content });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const addFood = food =>  dispatch => {
  dispatch({ type: ADD_FOOD, payload: food })
};

export const removeFood = food =>  dispatch => {
  dispatch({ type: REMOVE_FOOD, payload: food })
}

export const setSubTotal = subTotal =>  dispatch => {
  dispatch({ type: SET_SUB_TOTAL, payload: subTotal })
}
