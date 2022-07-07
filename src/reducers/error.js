import { FAILURE_TYPE, LOGIN_TYPE,FORGOT_PASSWORD, VERIFY_CODE, CLEAR_ERROR } from "actions/actionTypes";
import { combineReducers } from 'redux';

const errorLogin = (state = false,action) => {
  switch (action.type) {
    case `${LOGIN_TYPE}${FAILURE_TYPE}`:
      return action.payload
    case CLEAR_ERROR:
      return state = false;
    default:
      return state;
  }
}
const errorForgot = (state = null,action) => {
  switch (action.type) {
    case `${FORGOT_PASSWORD}${FAILURE_TYPE}`:
      return action.payload
    case CLEAR_ERROR:
      return state = false;
    default:
      return state = null;
  }
}

const errorReducer = combineReducers({
  errorLogin,
  errorForgot,
})
export {errorReducer}