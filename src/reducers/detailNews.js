import {
  DETAIL_NEWS_REQ,
  DETAIL_NEWS_SUCCESS,
  DETAIL_NEWS_FAILED,
  DETAIL_NEWS_LIST_REQ,
  DETAIL_NEWS_LIST_SUCCESS,
  DETAIL_NEWS_LIST_FAILED,
} from "actions/actionTypes";
import { combineReducers } from "redux";

const initialState = {
  data: {},
};

export const listDetailNews = (state = { ...initialState }, action) => {
  const { payload, type } = action;
  switch (type) {
    case DETAIL_NEWS_SUCCESS: {
      const { data } = payload;
      return { ...state, data };
    }
    default:
      return state;
  }
};

const initialStateAll = {
  data: {
    data: [],
  },
};

export const listDetailNewsAll = (state = { ...initialStateAll }, action) => {
  const { payload, type } = action;
  switch (type) {
    case DETAIL_NEWS_LIST_SUCCESS: {
      const { data } = payload;
      return {
        ...state,
        ...data,
        data: {
          ...state.data,
          data: [...state.data.data, ...data.data],
        },
      };
    }
    default:
      return state;
  }
};

const detailNewsReducer = combineReducers({
  listDetailNews: listDetailNews,
  listDetailNewsAll: listDetailNewsAll,
});

export { detailNewsReducer };
