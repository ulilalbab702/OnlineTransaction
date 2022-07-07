import { combineReducers } from "redux";
import {
    WISHLIST_GET_REQ,
    WISHLIST_GET_SUCCESS,
    WISHLIST_GET_FAILED, 
    WISHLIST_POST_REQ, 
    WISHLIST_POST_SUCCESS,
    WISHLIST_POST_FAILED,
    WISHLIST_DEL_REQ,
    WISHLIST_DEL_SUCCESS,
    WISHLIST_DEL_FAILED,
    WISHLIST_DEL_BULK_REQ,
    WISHLIST_DEL_BULK_SUCCESS,
    WISHLIST_DEL_BULK_FAILED,
} from "actions/actionTypes";

const initialState = {
    dataGet: null,
    dataPost: null,
    dataDel: null,
    loading: false,
    error: null,
};

export const wishlist = (state = { ...initialState }, action) => {
    const { payload, type } = action;
    switch (type) {
        case WISHLIST_GET_REQ: {
            return { ...state, loading: true, dataGet: null, error: null };
        }
        case WISHLIST_GET_SUCCESS: {
            const { data } = payload;
            return { ...state, loading: false, dataGet: data, error: null };
        }
        case WISHLIST_GET_FAILED: {
            const { err } = payload;
            return { ...state, loading: false, dataGet: null, error: err };
        }
        case WISHLIST_POST_REQ: {
            return { ...state, loading: true, dataPost: null, error: null };
        }
        case WISHLIST_POST_SUCCESS: {
            const { data } = payload;
            return { ...state, loading: false, dataPost: data, error: null };
        }
        case WISHLIST_POST_FAILED: {
            const { err } = payload;
            return { ...state, loading: false, dataPost: null, error: err };
        }
        case WISHLIST_DEL_REQ: {
            return { ...state, loading: true, dataDel: null, error: null };
        }
        case WISHLIST_DEL_SUCCESS: {
            const { data } = payload;
            return { ...state, loading: false, dataDel: data, error: null };
        }
        case WISHLIST_DEL_FAILED: {
            const { err } = payload;
            return { ...state, loading: false, dataDel: null, error: err };
        }
        case WISHLIST_DEL_BULK_REQ: {
            return { ...state, loading: true, dataDel: null, error: null };
        }
        case WISHLIST_DEL_BULK_SUCCESS: {
            const { data } = payload;
            return { ...state, loading: false, dataDel: data, error: null };
        }
        case WISHLIST_DEL_BULK_FAILED: {
            const { err } = payload;
            return { ...state, loading: false, dataDel: null, error: err };
        }
        default:
            return state;
    }
};

const wishlistReducer = combineReducers({
    wishlist: wishlist,
});

export { wishlistReducer };