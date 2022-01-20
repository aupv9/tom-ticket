import {
  ADD_FOOD,
  GET_CONCESSIONS,
  GET_PAYMENT_METHODS,
  REMOVE_FOOD, RESET_SELECTED_FOOD,
  SET_FOOD_TOTAL,
  SET_SUB_TOTAL, SET_URL_PAYMENT_VNPAY, SHOW_MESSAGE_PAYMENT_SUCCESS,
} from '../types';
import { resetSelectedFood } from '../actions/concession';

const initialState = {
  concessions:[] ,
  selectedFood:[],
  subTotal:0,
  foodTotal:0,
  paymentMethods:[],
  urlVNPAY:""
};

const getConcessions = (state, payload) => ({
  ...state,
  concessions: payload
});

export const addFood = (state,food) => {
  return {
    ...state,
    selectedFood:[...state.selectedFood,food]
  }
};

export const setSubTotal = (state,subTotal) => {
  return {
    ...state,
    subTotal:subTotal
  }
};

export const setFoodTotal = (state,foodTotal) => {
  return {
    ...state,
    foodTotal:foodTotal
  }
};



export const removeFood = (state,food) => {
  const newFoods = [...state.selectedFood];
  const indexFood = state.selectedFood.findIndex(item => item.id === food.id);
  if(indexFood !== -1){
    newFoods.splice(indexFood,1);
  }
  return {
    ...state,
    selectedFood:newFoods
  }
};

const getPaymentMethods = (state, payload) => ({
  ...state,
  paymentMethods: payload
});


const setURLVNPAY = (state, payload) => ({
  ...state,
  urlVNPAY: payload
});



const resetSelectFood = (state) => ({
  ...state,
  selectedFood: []
});

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_CONCESSIONS:
      return getConcessions(state, payload);
    case ADD_FOOD:
      return addFood(state,payload);
    case REMOVE_FOOD:
      return removeFood(state,payload);
    case SET_SUB_TOTAL:
      return setSubTotal(state,payload);
    case SET_FOOD_TOTAL:
      return setFoodTotal(state,payload);
    case GET_PAYMENT_METHODS:
      return getPaymentMethods(state,payload);
    case SET_URL_PAYMENT_VNPAY:
      return setURLVNPAY(state,payload);
    case RESET_SELECTED_FOOD:
      return resetSelectFood(state);

    default:
      return state;
  }
};
