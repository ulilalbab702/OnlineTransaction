import {
    SUCCESS_TYPE,
    TRANSACTION_ORDER,
    TRANSACTION_POST_FAILED,
    TRANSACTION_POST_REQ,
    TRANSACTION_DETAIL,
    TRANSACTION_POST_SUCCESS,
    TIMELINE_GET_REQ,
    TIMELINE_GET_SUCCESS,
    TIMELINE_GET_FAILED,
    LIST_CANCEL_REQ,
    LIST_CANCEL_SUCCESS,
    LIST_CANCEL_FAILED,
    CANCEL_REASON_PATCH_REQ,
    CANCEL_REASON_PATCH_SUCCESS,
    CANCEL_REASON_PATCH_FAILED,
    DOWNLOAD_FAKTUR_PAJAK_REQ,
    DOWNLOAD_FAKTUR_PAJAK_SUCCESS,
    DOWNLOAD_FAKTUR_PAJAK_FAILED,
    DOWNLOAD_INVOICE_REQ,
    DOWNLOAD_INVOICE_SUCCESS,
    DOWNLOAD_INVOICE_FAILED,
    ORDER_RECEIVED_PATCH_REQ,
    ORDER_RECEIVED_PATCH_SUCCESS,
    ORDER_RECEIVED_PATCH_FAILED,
} from "actions/actionTypes";
import { combineReducers } from "redux";

const initialState = {
    transactionSuccess: null
};

export const transaction = (state = { ...initialState }, action) => {
    const { payload, type } = action;
    switch (type) {
        case TRANSACTION_POST_SUCCESS: {
            const { data } = payload;
            return { ...state, transactionSuccess: data };
        }
        default:
            return state;
    }
};

export const transactionOrder = (state = {}, action) => {
    const { payload, type } = action;
    switch (type) {
        case `${TRANSACTION_ORDER}${SUCCESS_TYPE}`:
            return { ...state, ...payload.data }
        default:
            return state;
    }
}
export const transactionDetail = (state = {}, action) => {
    const { payload, type } = action;
    switch (type) {
        case `${TRANSACTION_DETAIL}${SUCCESS_TYPE}`:
            return { ...state, ...payload.data }
        default:
            return state;
    }
}

const initialStateTimeline = {
    data: null,
    error: null,
    loading: false,
};
export const timeline = (state = { ...initialStateTimeline }, action) => {
    const { payload, type } = action;
    switch (type) {
        case TIMELINE_GET_REQ: {
            return { ...state, data: null, error: null, loading: true }
        }
        case TIMELINE_GET_SUCCESS: {
            const { data } = payload;
            return { ...state, data: data, error: null, loading: false }
        }
        case TIMELINE_GET_FAILED: {
            const { error } = payload;
            return { ...state, data: null, error: error, loading: false }
        }
        default:
            return state;
    }
}

const initialStateCancel = {
    dataListCancel: null,
    dataPatchCancelReason: null,
    errorPatchCancelReason: null,
    errorListCancel: null,
    loading: false,
};
export const cancelOrder = (state = { ...initialStateCancel }, action) => {
    const { payload, type } = action;
    switch (type) {
        case LIST_CANCEL_REQ: {
            return { ...state, dataListCancel: null, errorListCancel: null, loading: true }
        }
        case LIST_CANCEL_SUCCESS: {
            const { data } = payload;
            return { ...state, dataListCancel: data, loading: false }
        }
        case LIST_CANCEL_FAILED: {
            const { error } = payload;
            return { ...state, errorListCancel: error, loading: false }
        }
        case CANCEL_REASON_PATCH_REQ: {
            return { ...state, dataPatchCancelReason: null, errorPatchCancelReason: null, loading: true }
        }
        case CANCEL_REASON_PATCH_SUCCESS: {
            const { data } = payload;
            return { ...state, dataPatchCancelReason: data, loading: false }
        }
        case CANCEL_REASON_PATCH_FAILED: {
            const { data } = payload;
            return { ...state, errorPatchCancelReason: data, loading: false }
        }
        default:
            return state;
    }
}

const initialStateFakturPajakInvoice = {
    successFakturPajak: null,
    successInvoice: null,
    loadingFakturPajak: false,
    loadingInvoice: false,
    error: null,
}
export const fakturPajakInvoice = (state = { ...initialStateFakturPajakInvoice }, action) => {
    const { payload, type } = action;
    switch (type) {
        case DOWNLOAD_FAKTUR_PAJAK_REQ: {
            return { ...state, successFakturPajak: null, error: null, loadingFakturPajak: true }
        }
        case DOWNLOAD_FAKTUR_PAJAK_SUCCESS: {
            const { data } = payload;
            return { ...state, successFakturPajak: data, error: null, loadingFakturPajak: false }
        }
        case DOWNLOAD_FAKTUR_PAJAK_FAILED: {
            const { error } = payload;
            return { ...state, successFakturPajak: null, error: error, loadingFakturPajak: false }
        }
        case DOWNLOAD_INVOICE_REQ: {
            return { ...state, successInvoice: null, error: null, loadingInvoice: true }
        }
        case DOWNLOAD_INVOICE_SUCCESS: {
            const { data } = payload;
            return { ...state, successInvoice: data, error: null, loadingInvoice: false }
        }
        case DOWNLOAD_INVOICE_FAILED: {
            const { error } = payload;
            return { ...state, successInvoice: null, error: error, loadingInvoice: false }
        }
        default:
            return state;
    }
}

const initialStateOrderReceived = {
    dataPatchOrderReceived: null,
    errorPatchOrderReceived: null,
    loading: false,
};
export const orderReceived = (state = { ...initialStateOrderReceived }, action) => {
    const { payload, type } = action;
    switch (type) {
        case ORDER_RECEIVED_PATCH_REQ: {
            return { ...state, dataPatchOrderReceived: null, errorPatchOrderReceived: null, loading: true }
        }
        case ORDER_RECEIVED_PATCH_SUCCESS: {
            const { data } = payload;
            return { ...state, dataPatchOrderReceived: data, loading: false }
        }
        case ORDER_RECEIVED_PATCH_FAILED: {
            const { data } = payload;
            return { ...state, errorPatchOrderReceived: data, loading: false }
        }
        default:
            return state;
    }
}

const transactionReducer = combineReducers({
    transaction,
    transactionOrder,
    transactionDetail,
    timeline,
    cancelOrder,
    fakturPajakInvoice,
    orderReceived
});

export { transactionReducer };