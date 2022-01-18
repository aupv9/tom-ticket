import { ADD_FOOD, GET_CONCESSIONS, REMOVE_FOOD, SET_FOOD_TOTAL, SET_SELECTED_FOOD, SET_SUB_TOTAL } from '../types';

const initialState = {
  concessions:[] ,
  selectedFood:[],
  subTotal:0,
  foodTotal:0
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
  newFoods.splice(state.selectedFood.findIndex(item => item.id === food.id),1);
  return {
    ...state,
    selectedFood:newFoods
  }
};


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
    default:
      return state;
  }
};
