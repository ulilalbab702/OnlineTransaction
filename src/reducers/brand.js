import {
    BRAND_REQ,
    BRAND_SUCCESS,
    BRAND_FAILED,
    SET_CLICK_CHAT,
    CATEGORY_SUCCESS
} from "actions/actionTypes";
import { combineReducers } from "redux";

const initialState = {
    data: null,
    click:  localStorage.getItem('eventClick'),
    loading: false,
     
};


export const listBrand = (state = { ...initialState }, action) => {
    const { payload, type } = action;
    switch (type) {
        case BRAND_SUCCESS: {
            const { data } = payload;
            return { ...state, data, loading: false };
        }
        case BRAND_REQ: {
            return { ...state, loading: true };
        }
        case BRAND_FAILED: {
            return { ...state, loading: false };
        }
        case SET_CLICK_CHAT: {
            return { ...state, click: payload };
        }
        default:
            return state;
    }
};
const initialStateCategory = {
    data:null
}
export const listCategory = (state = {...initialStateCategory},action) => {
    const {type,payload} = action;
    switch (type) {
        case CATEGORY_SUCCESS:{
            const {data} = payload;
            return {...state,data}
        }
        default:
            return state;
    }
}

const listBrandReducer = combineReducers({
    listBrand: listBrand,
    listCategory,
});

export { listBrandReducer };