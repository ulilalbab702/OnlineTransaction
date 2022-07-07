import {
  DETAIL_PRODUCT_REQ,
  DETAIL_PRODUCT_SUCCESS,
  DETAIL_PRODUCT_FAILED,
  DETAIL_PRODUCT_RELATED_REQ,
  DETAIL_PRODUCT_RELATED_SUCCESS,
  DETAIL_PRODUCT_RELATED_FAILED,
  DETAIL_PRODUCT_REVIEW_REQ,
  DETAIL_PRODUCT_REVIEW_SUCCESS,
  DETAIL_PRODUCT_REVIEW_FAILED,
} from "actions/actionTypes";
import { DetailProductApi } from "api";

const api = () => DetailProductApi.newInstance();

export const detailProductGet = (id) => async (dispatch) => {
  dispatch({
    type: DETAIL_PRODUCT_REQ,
  });
  try {
    const res = await api().getDetailProduct(id);
    dispatch({
      type: DETAIL_PRODUCT_SUCCESS,
      payload: { data: res.data },
    });
  } catch (error) {
    dispatch({
      type: DETAIL_PRODUCT_FAILED,
      payload: error,
    });
  }
};

export const detailProductRelatedGet = (id, Keyword, Brand, Type, PlantCode, Filters, Sorts, PageNumber, PageSize) => async (dispatch) => {
  dispatch({
    type: DETAIL_PRODUCT_RELATED_REQ,
  });
  try {
    const res = await api().getDetailList(id, Keyword, Brand, Type, PlantCode, Filters, Sorts, PageNumber, PageSize);
    dispatch({
      type: DETAIL_PRODUCT_RELATED_SUCCESS,
      payload: { data: res.data },
    });
  } catch (error) {
    dispatch({
      type: DETAIL_PRODUCT_RELATED_FAILED,
      payload: error,
    });
  }
};

export const reviewDetailProduct = (productId) => async (dispatch) => {
  dispatch({
    type: DETAIL_PRODUCT_REVIEW_REQ
  });
  try {
    const res = await api(null).getReviewProduct(productId);
    dispatch({
      type: DETAIL_PRODUCT_REVIEW_SUCCESS,
      payload: { data: res.data }
    });
  } catch (error) {
    dispatch({
      type: DETAIL_PRODUCT_REVIEW_FAILED,
      payload: error
    });
  }
};