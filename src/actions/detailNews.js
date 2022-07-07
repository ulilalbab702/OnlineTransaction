import { DetailNewsApi } from "api";
import {
  DETAIL_NEWS_REQ,
  DETAIL_NEWS_SUCCESS,
  DETAIL_NEWS_FAILED,
  DETAIL_NEWS_LIST_REQ,
  DETAIL_NEWS_LIST_SUCCESS,
  DETAIL_NEWS_LIST_FAILED,
} from "actions/actionTypes";

const api = (token) => DetailNewsApi.newInstance(token);
export const listDetailNews = (newsId) => async (dispatch) => {
  dispatch({
    type: DETAIL_NEWS_REQ,
  });
  try {
    const res = await api(null).detailNewsGet(newsId);
    dispatch({
      type: DETAIL_NEWS_SUCCESS,
      payload: { data: res.data },
    });
  } catch (error) {
    dispatch({
      type: DETAIL_NEWS_FAILED,
      payload: error,
    });
  }
};

export const listDetailNewsAll = (PageNumber, Keyword, Title) => async (dispatch) => {
  dispatch({
    type: DETAIL_NEWS_LIST_REQ,
  });
  try {
    const res = await api(null).detailNewsAllGet(PageNumber, Keyword, Title);
    dispatch({
      type: DETAIL_NEWS_LIST_SUCCESS,
      payload: { data: res.data },
    });
  } catch (error) {
    dispatch({
      type: DETAIL_NEWS_LIST_FAILED,
      payload: error,
    });
  }
};
