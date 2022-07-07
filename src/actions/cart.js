import { CartApi } from "api";
import {
    CART_LIST_REQ,
    CART_LIST_SUCCESS,
    CART_LIST_FAILED,
    PURCHASE_SUMMARY_REQ,
    PURCHASE_SUMMARY_SUCCESS,
    PURCHASE_SUMMARY_FAILED,
    ATTRIBUTE_NAME_REQ,
    ATTRIBUTE_NAME_SUCCESS,
    ATTRIBUTE_NAME_FAILED,
    SEARCH_BY_USERID_REQ,
    SEARCH_BY_USERID_SUCCESS,
    SEARCH_BY_USERID_FAILED,
    CART_LIST_BY_CARTID_REQ,
    CART_LIST_BY_CARTID_SUCCESS,
    CART_LIST_BY_CARTID_FAILED,
    CART_LIST_BY_CARTID_PUT_REQ,
    CART_LIST_BY_CARTID_PUT_SUCCESS,
    CART_LIST_BY_CARTID_PUT_FAILED,
    CART_DETAIL_FAILED,
    CART_DETAIL_SUCCESS,
    CART_DETAIL_REQ,
    CREATE_SO_REQ,
    CREATE_SO_SUCCESS,
    CREATE_SO_FAILED,
    CHANGE_STATUS_REQ,
    CHANGE_STATUS_SUCCESS,
    CHANGE_STATUS_FAILED,
    UPLOADATTACH_SO_FAILED,
    UPLOADATTACH_SO_REQ,
    UPLOADATTACH_SO_SUCCESS,
    CART_LIST_BY_CARTID_DELETE_REQ,
    CART_LIST_BY_CARTID_DELETE_SUCCESS,
    CART_LIST_BY_CARTID_DELETE_FAILED,
    CART_BY_DETAILID_DELETE_REQ,
    CART_BY_DETAILID_DELETE_SUCCESS,
    CART_BY_DETAILID_DELETE_FAILED,
    CART_PURCHASE_CHECKOUT_REQ,
    CART_PURCHASE_CHECKOUT_SUCCESS,
    CART_PURCHASE_CHECKOUT_FAILED,
    CART_CHECKOUT_PRODUCT_REQ,
    CART_CHECKOUT_PRODUCT_SUCCESS,
    CART_CHECKOUT_PRODUCT_FAILED
} from "actions/actionTypes";

const api = (token) => CartApi.newInstance(token);
export const listCart = (token) => async (dispatch) => {
    dispatch({
        type: CART_LIST_REQ,
    });
    try {
        const res = await api(token).getCartList();
        dispatch({
            type: CART_LIST_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: CART_LIST_FAILED,
            payload: { err: error },
        });
    }
};

export const getPurchaseSummary = (cartId, token) => async (dispatch) => {
    dispatch({
        type: PURCHASE_SUMMARY_REQ,
    });
    try {
        const res = await api(token).getPurchaseCheckout(cartId);
        dispatch({
            type: PURCHASE_SUMMARY_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: PURCHASE_SUMMARY_FAILED,
            payload: { err: error },
        });
    }
};

export const getAttributeName = (name) => async (dispatch) => {
    dispatch({
        type: ATTRIBUTE_NAME_REQ,
    });
    try {
        const res = await api().getAttributeName(name);
        dispatch({
            type: ATTRIBUTE_NAME_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: ATTRIBUTE_NAME_FAILED,
            payload: { err: error },
        });
    }
};

export const searchByUserId = (userId, token) => async (dispatch) => {
    dispatch({
        type: SEARCH_BY_USERID_REQ,
    });
    try {
        const res = await api(token).getSearchByUserId(userId);
        dispatch({
            type: SEARCH_BY_USERID_SUCCESS,
            payload: { data: res },
        });
    } catch (error) {
        dispatch({
            type: SEARCH_BY_USERID_FAILED,
            payload: { err: error },
        });
    }
};

export const cartDetail = (token, id) => async (dispatch) => {
    dispatch({
        type: CART_DETAIL_REQ,
    });
    try {
        const res = await api(token).getCartDetail(id);
        dispatch({
            type: CART_DETAIL_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: CART_DETAIL_FAILED,
            payload: { err: error },
        });
    }
};

export const getListCartByCartId = (cartId, token) => async (dispatch) => {
    dispatch({
        type: CART_LIST_BY_CARTID_REQ
    });
    try {
        const res = await api(token).getCartListByCartId(cartId);
        dispatch({
            type: CART_LIST_BY_CARTID_SUCCESS,
            payload: { data: res },
        });
    } catch (error) {
        dispatch({
            type: CART_LIST_BY_CARTID_FAILED,
            payload: { err: error },
        });
    }
};

export const completeOrder = (token, body) => async (dispatch) => {
    dispatch({
        type: CREATE_SO_REQ,
    });
    try {
        const res = await api(token).postCompleteOrder(body);
        dispatch({
            type: CREATE_SO_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: CREATE_SO_FAILED,
            payload: { err: error },
        });
    }
};

export const putListCartByCartId = (cartId, data, token) => async (dispatch) => {
    dispatch({
        type: CART_LIST_BY_CARTID_PUT_REQ
    });
    try {
        const res = await api(token).putCartListByCartId(cartId, data);
        dispatch({
            type: CART_LIST_BY_CARTID_PUT_SUCCESS,
            payload: { data: res },
        });
    } catch (error) {
        dispatch({
            type: CART_LIST_BY_CARTID_PUT_FAILED,
            payload: { err: error },
        });
    }
};

export const changeStatus = (token, id, status) => async (dispatch) => {
    dispatch({
        type: CHANGE_STATUS_REQ,
    });
    try {
        const res = await api(token).putChangeStatus(id, status);
        dispatch({
            type: CHANGE_STATUS_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: CHANGE_STATUS_FAILED,
            payload: { err: error },
        });
    }
};

export const uploadAttachment = (token, body) => async (dispatch) => {
    dispatch({
        type: UPLOADATTACH_SO_REQ,
    });
    try {
        const res = await api(token).postUploadattachment(body);
        dispatch({
            type: UPLOADATTACH_SO_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: UPLOADATTACH_SO_FAILED,
            payload: { data: error },
        })
    }
}

export const deleteAllCart = (cartId, body, token) => async (dispatch) => {
    dispatch({
        type: CART_LIST_BY_CARTID_DELETE_REQ,
    });
    try {
        const res = await api(token).deleteAllCart(cartId, body);
        dispatch({
            type: CART_LIST_BY_CARTID_DELETE_SUCCESS,
            payload: { data: res },
        });
    } catch (error) {
        dispatch({
            type: CART_LIST_BY_CARTID_DELETE_FAILED,
            payload: { err: error },
        });
    }
};

export const deleteCartDetail = (cartId, token) => async (dispatch) => {
    dispatch({
        type: CART_BY_DETAILID_DELETE_REQ,
    });
    try {
        const res = await api(token).deleteCartDetail(cartId);
        dispatch({
            type: CART_BY_DETAILID_DELETE_SUCCESS,
            payload: { data: res },
        });
    } catch (error) {
        dispatch({
            type: CART_BY_DETAILID_DELETE_FAILED,
            payload: { err: error },
        });
    }
};

export const getPurchaseCheckout = (cartId, token) => async (dispatch) => {
    dispatch({
        type: CART_PURCHASE_CHECKOUT_REQ,
    });
    try {
        const res = await api(token).getPurchaseCheckout(cartId);
        dispatch({
            type: CART_PURCHASE_CHECKOUT_SUCCESS,
            payload: { data: res },
        });
    } catch (error) {
        dispatch({
            type: CART_PURCHASE_CHECKOUT_FAILED,
            payload: { err: error },
        });
    }
};

export const getCheckoutProduct = (cartId, token) => async (dispatch) => {
    dispatch({
        type: CART_CHECKOUT_PRODUCT_REQ,
    });
    try {
        const res = await api(token).getCheckoutProduct(cartId);
        dispatch({
            type: CART_CHECKOUT_PRODUCT_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: CART_CHECKOUT_PRODUCT_FAILED,
            payload: { err: error },
        });
    }
};