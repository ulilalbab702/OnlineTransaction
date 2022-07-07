import { WishlistApi } from "api";
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

const api = (token) => WishlistApi.newInstance(token);

export const listWishlist = (token, Filters) => async (dispatch) => {
    dispatch({
        type: WISHLIST_GET_REQ,
    });
    try {
        const res = await api(token).getWishlist(Filters);
        dispatch({
            type: WISHLIST_GET_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: WISHLIST_GET_FAILED,
            payload: { err: error }
        });
    }
}

export const addWishlist = (token, data) => async (dispatch) => {
    dispatch({
        type: WISHLIST_POST_REQ,
    });
    try {
        const res = await api(token).postWishlist(data);
        dispatch({
            type: WISHLIST_POST_SUCCESS,
            payload: { data: res.data }
        });
    } catch (error) {
        dispatch({
            type: WISHLIST_POST_FAILED,
            payload: { err: error }
        });
    }
}

export const deleteWishlist = (token, data) => async (dispatch) => {
    dispatch({
        type: WISHLIST_DEL_REQ
    });
    try {
        const res = await api(token).deleteWishlist(data);
        dispatch({
            type: WISHLIST_DEL_SUCCESS,
            payload: { data: res }
        });
    } catch (error) {
        dispatch({
            type: WISHLIST_DEL_FAILED,
            payload: { err: error }
        });
    }
}

export const deleteBulkWishlist = (token, data) => async (dispatch) => {
    dispatch({
        type: WISHLIST_DEL_BULK_REQ
    });
    try {
        const res = await api(token).deleteBulkWishlist(data);
        dispatch({
            type: WISHLIST_DEL_BULK_SUCCESS,
            payload: { data: res }
        });
    } catch (error) {
        dispatch({
            type: WISHLIST_DEL_BULK_FAILED,
            payload: { err: error }
        });
    }
}