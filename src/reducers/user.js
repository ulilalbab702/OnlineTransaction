import { 
  GET_USER_TYPE,
  LOGIN_TYPE,
  LOGOUT_TYPE,
  SET_LEADER_TYPE,
  SUCCESS_TYPE,
  FAILURE_TYPE,
  SIGNUP,
  VERIFY_CODE,
} from 'actions/actionTypes';
import { combineReducers } from 'redux';

const initialState = null;

const user =  (state = initialState, action) => {
  switch (action.type) {
    case `${LOGIN_TYPE}${SUCCESS_TYPE}`:
      return {
        ...state, 
        ...action.payload.data,
      }
    case `${GET_USER_TYPE}${SUCCESS_TYPE}`:
      return { ...state, ...action.payload.data };
    case SET_LEADER_TYPE:
      return { ...state, isLeader: action.payload };
    case `${LOGOUT_TYPE}${SUCCESS_TYPE}`:
      return { ...initialState };
    case `CLEAR_STORE`: 
      return state = null;
    default:
      return state;
  }
};
const register = (state = null,action) => {
  switch (action.type) {
    case `${SIGNUP}${SUCCESS_TYPE}`:
      return {...state,...action.payload.data}
    default:
      return state;
  }
}
const errorRegister = (state = null,action) => {
  switch (action.type) {
    case `${SIGNUP}${FAILURE_TYPE}`:
      return {...state,...action.payload.error}
    default:
      return state;
  }
}

const verify = (state = null,action) => {
  switch (action.type) {
    case `${VERIFY_CODE}${SUCCESS_TYPE}`:
      return {...state,...action.payload.data.status}
    default:
      return state = null;
  }
}

const errorVerify = (state = null,action) => {
  switch (action.type) {
    case `${VERIFY_CODE}${FAILURE_TYPE}`:
      return action.payload
    default:
      return state = null;
  }
}
const userReducer = combineReducers({
  user,
  register,
  errorRegister,
  verify,
  errorVerify
});

export { userReducer };
