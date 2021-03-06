import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT, CHECK_LOGIN,
} from '../types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return { ...state, user: payload, isAuthenticated: true, loading: false };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return { ...state, ...payload, isAuthenticated: true, loading: false };
    case CHECK_LOGIN:
      // localStorage.setItem('token', state.token);
      return { ...state, ...payload, isAuthenticated: true, loading: false };
    // case REGISTER_FAIL:
    // case LOGIN_FAIL:
    //  case AUTH_ERROR:
    //    return { ...state, isAuthenticated: false, loading: true,user: null };
    case LOGOUT:
      localStorage.removeItem('token');
      return initialState;
    default:
      return state;
  }
};
