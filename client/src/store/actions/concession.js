import { setAlert } from './alert';
import {
  ADD_FOOD,
  GET_CONCESSIONS,
  GET_PAYMENT_METHODS,
  REMOVE_FOOD, RESET_SELECTED_FOOD, SET_ORDER_NON_PAYMENT,
  SET_SELECTED_FOOD,
  SET_SUB_TOTAL, SET_URL_PAYMENT_VNPAY, SHOW_MESSAGE_PAYMENT_SUCCESS,
} from '../types';


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

export const getPaymentMethods = () => async dispatch => {
  try {
    const url = host + '/payments-method';
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const concessions = await response.json();
    if (response.ok) {
      dispatch({ type: GET_PAYMENT_METHODS, payload: concessions.content });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const handleVNPAY = pay => async dispatch => {
  try {
    const token = localStorage.getItem('token');
    const url = host + '/vnpayments';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pay)
    });
    if (response.ok) {
      const urlVNPAY = await response.json();
      dispatch({ type: SET_URL_PAYMENT_VNPAY, payload: urlVNPAY.data });
      return {
        status:"Success",
        message:"Create Payment With VnPay Success",
        data:urlVNPAY.data
      }
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: ' Reservation have not been created, try again.'
    };
  }
};

export const createPayment = pay => async dispatch => {
  try {
    const token = localStorage.getItem('token');
    const url = host + '/payments';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pay)
    });
    if (response.ok) {
      const paymentId = await response.json();
      return {
        status:"Success",
        message:"Create Payment Success",
        data:paymentId
      }
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: ' Reservation have not been created, try again.'
    };
  }
};


// export const handleVNPAY = (pay) => async dispatch => {
//   try {
//     const token = localStorage.getItem("token");
//     const url = host + '/vnpayments';
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         Authorization: `${token}`
//       },
//       body:JSON.stringify(pay)
//     });
//     const urlVNPAY = await response.json();
//     if (response.ok) {
//       dispatch({ type: SET_URL_PAYMENT_VNPAY, payload: urlVNPAY.data });
//       return {
//         status:"Success",
//         message:"Create Payment With VnPay Success",
//         data:urlVNPAY.data
//       }
;//     }
// //   } catch (error) {
// //     dispatch(setAlert(error.message, 'error', 5000));
// //   }
// // }

export const showMessagePaymentSuccess = () =>  dispatch => {
  dispatch(setAlert("Payment Order Success", 'success', 5000));
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

export const resetSelectedFood = () =>  dispatch => {
  dispatch({ type: RESET_SELECTED_FOOD })
}
