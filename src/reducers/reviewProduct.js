import {
  POST_REVIEW_PRODUCT_REQ,
  POST_REVIEW_PRODUCT_SUCCESS,
  POST_REVIEW_PRODUCT_FAILED,
} from "actions/actionTypes";
import { combineReducers } from "redux";

const initialState = {
  data: null,
  error: null,
  loading: false,
}

export const reviewProduct = (state = { ...initialState }, action) => {
  const { payload, type } = action;
  switch (type) {
    case POST_REVIEW_PRODUCT_REQ: {
      return { ...state, data: null, loading: true };
    }
    case POST_REVIEW_PRODUCT_SUCCESS: {
      const { data } = payload;
      return { ...state, data: data, loading: false }
    }
    case POST_REVIEW_PRODUCT_FAILED: {
      const { err } = payload;
      return { ...state, data: null, error: err, loading: false }
    }
    default:
      return state;
  }
};

const reviewProductReducer = combineReducers({
  reviewProduct,
});

export { reviewProductReducer };