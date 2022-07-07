import {
    CART_LIST_FAILED,
    CART_LIST_REQ,
    CART_LIST_SUCCESS,
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
    CART_DETAIL_REQ,
    CART_DETAIL_SUCCESS,
    CREATE_SO_FAILED,
    CREATE_SO_SUCCESS,
    CREATE_SO_REQ,
    CHANGE_STATUS_FAILED,
    CHANGE_STATUS_REQ,
    CHANGE_STATUS_SUCCESS,
    UPLOADATTACH_SO_SUCCESS,
    CART_LIST_BY_CARTID_DELETE_REQ,
    CART_LIST_BY_CARTID_DELETE_SUCCESS,
    CART_LIST_BY_CARTID_DELETE_FAILED,
    CART_BY_DETAILID_DELETE_REQ,
    CART_BY_DETAILID_DELETE_SUCCESS,
    CART_BY_DETAILID_DELETE_FAILED,
    CART_CHECKOUT_PRODUCT_REQ,
    CART_CHECKOUT_PRODUCT_SUCCESS,
    CART_CHECKOUT_PRODUCT_FAILED
} from "actions/actionTypes";
import { combineReducers } from "redux";

const initialState = {
    data: null,
    attributeName: null,
    dataCart: null,
    dataCartList: null,
    dataPutCartList: null,
    errPutCartList: null,
    err: '',
    loading: false,
    cartDetail: null,
    succesCreateSo: null,
    succesStatus: null,
    upploadAttach: null,
    errorCreateSo: null,
    errorCartDetail: null,
    errorCheckoutProduct: null,
    succesCheckoutProduct: null
};

export const cart = (state = { ...initialState }, action) => {
    const { payload, type } = action;
    switch (type) {
        case CART_LIST_REQ: {
            return { ...state, loading: true };
        }
        case CART_LIST_SUCCESS: {
            const { data } = payload;
            return { ...state, data, loading: false };
        }
        case CART_LIST_FAILED: {
            const { err } = payload;
            return { ...state, err, loading: false };
        }
        case CART_DETAIL_REQ: {
            return { ...state, errorCartDetail: null, loading: true };
        }
        case CART_DETAIL_FAILED: {
            const { err } = payload;
            return { ...state, errorCartDetail: err, loading: false };
        }
        case CART_DETAIL_SUCCESS: {
            const { data } = payload;
            return { ...state, cartDetail: data, loading: false };
        }
        case CREATE_SO_REQ: {
            return { ...state, errorCreateSo: null };
        }
        case CREATE_SO_SUCCESS: {
            const { data } = payload;
            return { ...state, succesCreateSo: data };
        }
        case CREATE_SO_FAILED: {
            const { err } = payload;
            return { ...state, errorCreateSo: err }
        }
        case CHANGE_STATUS_SUCCESS: {
            const { data } = payload;
            return { ...state, succesStatus: data };
        }
        case UPLOADATTACH_SO_SUCCESS: {
            const { data } = payload;
            return { ...state, upploadAttach: data };
        }
        case CART_CHECKOUT_PRODUCT_REQ: {
            return { ...state, errorCheckoutProduct: null, loading: true};
        }
        case CART_CHECKOUT_PRODUCT_SUCCESS: {
            const { data } = payload;
            return { ...state, succesCheckoutProduct: data, loading: false };
        }
        case CART_CHECKOUT_PRODUCT_FAILED: {
            const { err } = payload;
            return { ...state, errorCheckoutProduct: err, loading: false}
        }
        default:
            return state;
    }
};

export const listCart = (state = { ...initialState }, action) => {
    const { payload, type } = action;
    switch (type) {
        case CART_LIST_BY_CARTID_REQ: {
            return { ...state, err: '', dataCartList: null, loading: true };
        }
        case CART_LIST_BY_CARTID_SUCCESS: {
            const { data } = payload;
            return { ...state, dataCartList: data, loading: false };
        }
        case CART_LIST_BY_CARTID_FAILED: {
            const { err } = payload;
            return { ...state, err: err, dataCartList: null, loading: false };
        }
        case CART_LIST_BY_CARTID_PUT_REQ: {
            return { ...state, err: '', loading: true };
        }
        case CART_LIST_BY_CARTID_PUT_SUCCESS: {
            const { data } = payload;
            return { ...state, dataPutCartList: data, loading: false };
        }
        case CART_LIST_BY_CARTID_PUT_FAILED: {
            const { err } = payload;
            return { ...state, errPutCartList: err, loading: false };
        }
        case CART_LIST_BY_CARTID_DELETE_REQ: {
            return { ...state, err: '', loading: true };
        }
        case CART_LIST_BY_CARTID_DELETE_SUCCESS: {
            const { data } = payload;
            return { ...state, data: data, loading: false };
        }
        case CART_LIST_BY_CARTID_DELETE_FAILED: {
            const { err } = payload;
            return { ...state, err: err, loading: false };
        }
        case CART_BY_DETAILID_DELETE_REQ: {
            return { ...state, err: '', loading: true };
        }
        case CART_BY_DETAILID_DELETE_SUCCESS: {
            const { data } = payload;
            return { ...state, data: data, loading: false };
        }
        case CART_BY_DETAILID_DELETE_FAILED: {
            const { err } = payload;
            return { ...state, err: err, loading: false };
        }
        default:
            return state;
    }
};

export const purchaseSummary = (state = { ...initialState }, action) => {
    const { payload, type } = action;
    switch (type) {
        case PURCHASE_SUMMARY_REQ: {
            return { ...state, loading: true };
        }
        case PURCHASE_SUMMARY_SUCCESS: {
            const { data } = payload;
            return { ...state, data, loading: false };
        }
        case PURCHASE_SUMMARY_FAILED: {
            const { err } = payload;
            return { ...state, err, loading: false };
        }
        default:
            return state;
    }
};

export const attributeName = (state = { ...initialState }, action) => {
    const { payload, type } = action;
    switch (type) {
        case ATTRIBUTE_NAME_SUCCESS: {
            const { data } = payload;
            return { ...state, attributeName: data };
        }
        case ATTRIBUTE_NAME_FAILED: {
            const { err } = payload;
            return { ...state, err };
        }
        default:
            return state;
    }
};

export const searchByUserId = (state = { ...initialState }, action) => {
    const { payload, type } = action;
    switch (type) {
        case SEARCH_BY_USERID_REQ: {
            return { ...state, loading: true };
        }
        case SEARCH_BY_USERID_SUCCESS: {
            const { data } = payload;
            return { ...state, dataCart: data, loading: false };
        }
        case SEARCH_BY_USERID_FAILED: {
            const { err } = payload;
            return { ...state, err, loading: false };
        }
        default:
            return state;
    }
};

const cartReducer = combineReducers({
    cart: cart,
    listCart,
    purchaseSummary,
    attributeName,
    searchByUserId
});

export { cartReducer };