import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT, CHECK_LOGIN, TOGGLE_LOGIN_POPUP,
} from '../types';
import { setAlert } from './alert';
import { setAuthHeaders, removeUser, isLoggedIn } from '../../utils';
import { setToken } from '../../utils/auth';

export const uploadImage = (id, image) => async dispatch => {
  try {
    const data = new FormData();
    data.append('file', image);
    const url = '/users/photo/' + id;
    const response = await fetch(url, {
      method: 'POST',
      body: data
    });
    const responseData = await response.json();
    if (response.ok) {
      dispatch(setAlert('Image Uploaded', 'success', 5000));
    }
    if (responseData.error) {
      dispatch(setAlert(responseData.error.message, 'error', 5000));
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

const host = "http://localhost:8080/api/v1";
// Login user
export const login = (username, password) => async dispatch => {
  try {
    const url = host + '/authenticate';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email:username, password })
    });
    const responseData = await response.json();
    if (response.ok) {
      const { token,fullName } = responseData;
      token && setToken(token);
      dispatch({ type: LOGIN_SUCCESS, payload: responseData });
      dispatch({ type: TOGGLE_LOGIN_POPUP });
      dispatch(setAlert(`Welcome ${fullName}`, 'success', 5000));
    }
    if (responseData.error) {
      dispatch({ type: LOGIN_FAIL });
      dispatch(setAlert(responseData.error.message, 'error', 5000));
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAIL });
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const facebookLogin = e => async dispatch => {
  try {
    const { email, userID, name } = e;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, userID, name })
    };
    const url = '/users/login/facebook';
    const response = await fetch(url, options);
    const responseData = await response.json();

    if (response.ok) {
      const { token, fullName } = responseData;
      token && setToken(token);
      dispatch({ type: LOGIN_SUCCESS, payload: responseData });
      dispatch(setAlert(`Welcome ${fullName}`, 'success', 5000));
    }
    if (responseData.error) {
      dispatch({ type: LOGIN_FAIL });
      dispatch(setAlert(responseData.error.message, 'error', 5000));
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAIL });
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const googleLogin = ({ profileObj }) => async dispatch => {
  try {
    const { email, googleId, name } = profileObj;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, googleId, name })
    };
    const url = '/users/login/google';
    const response = await fetch(url, options);
    const responseData = await response.json();

    if (response.ok) {
      const { token, fullName } = responseData;
      token && setToken(token);
      dispatch({ type: LOGIN_SUCCESS, payload: responseData });
      dispatch(setAlert(`Welcome ${fullName}`, 'success', 5000));
    }
    if (responseData.error) {
      dispatch({ type: LOGIN_FAIL });
      dispatch(setAlert(responseData.error.message, 'error', 5000));
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAIL });
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

// Register user
export const register = ({
  name,
  username,
  email,
  phone,
  image,
  password
}) => async dispatch => {
  try {
    const url = '/users';
    const body = { name, username, email, phone, password };
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const responseData = await response.json();
    if (response.ok) {
      const { token,id } = responseData;
      token && setToken(token);
      if (image) dispatch(uploadImage(id, image)); // Upload image
      dispatch({ type: REGISTER_SUCCESS, payload: responseData });
      dispatch(setAlert('Register Success', 'success', 5000));
    }
    if (responseData._message) {
      dispatch({ type: REGISTER_FAIL });
      dispatch(setAlert(responseData.message, 'error', 5000));
    }
  } catch (error) {
    dispatch({ type: REGISTER_FAIL });
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

// Load user
export const loadUser = () => async dispatch => {
  if (!isLoggedIn()) return;
  try {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch({ type: CHECK_LOGIN});
    }
    if (token) dispatch({ type: AUTH_ERROR });
  } catch (error) {
    dispatch({ type: AUTH_ERROR });
  }
};

// Logout
export const logout = () => async dispatch => {
  try {
    const token = localStorage.getItem('token');
    // const url = '/users/logout';
    // const response = await fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    // const responseData = await response.json();
    if (token) {
      removeUser();
      dispatch({ type: LOGOUT });
      dispatch(setAlert('LOGOUT Success', 'success', 5000));
    }
    if (!token) {
      dispatch(setAlert("", 'error', 5000));
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};
