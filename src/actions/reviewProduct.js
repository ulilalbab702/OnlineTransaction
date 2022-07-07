import {
  POST_REVIEW_PRODUCT_REQ,
  POST_REVIEW_PRODUCT_SUCCESS,
  POST_REVIEW_PRODUCT_FAILED,
} from "./actionTypes";
import { ReviewProductApi } from "api";

const api = (token) => ReviewProductApi.newInstance(token);

export const reviewProductPost = (data, token) => async (dispatch) => {
  dispatch({
    type: POST_REVIEW_PRODUCT_REQ,
  });
  try {
    const res = await api(token).postReviewProduct(data);
    dispatch({
      type: POST_REVIEW_PRODUCT_SUCCESS,
      payload: { data: res.data },
    });
  } catch (error) {
    dispatch({
      type: POST_REVIEW_PRODUCT_FAILED,
      payload: error,
    });
  }
}