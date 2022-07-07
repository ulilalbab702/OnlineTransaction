import { TransactionApi } from "api";
import {
    TRANSACTION_POST_REQ,
    TRANSACTION_POST_SUCCESS,
    TRANSACTION_POST_FAILED,
    REQUEST_TYPE,
    SUCCESS_TYPE,
    TRANSACTION_ORDER,
    TRANSACTION_DETAIL,
    FAILURE_TYPE,
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

const api = (token) => TransactionApi.newInstance(token);
export const postTransactionProcess = (token, body) => async (dispatch) => {
    dispatch({
        type: TRANSACTION_POST_REQ,
    });
    try {
        const res = await api(token).postTransaction(body);
        dispatch({
            type: TRANSACTION_POST_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: TRANSACTION_POST_FAILED,
            payload: { err: error },
        });
    }
};

export const getTransactionOrder = (data, token) => async (dispatch) => {
    dispatch({
        type: `${TRANSACTION_ORDER}${REQUEST_TYPE}`
    })
    try {
        const response = await api(token).getTransactionOrder(data)
        dispatch({
            type: `${TRANSACTION_ORDER}${SUCCESS_TYPE}`,
            payload: { data: response.data }
        })
    } catch (error) {
        dispatch({
            type: `${TRANSACTION_ORDER}${FAILURE_TYPE}`,
            payload: { err: error }
        })
    }
}
export const transactionDetails = (data, token) => async (dispatch) => {
    dispatch({
        type: `${TRANSACTION_DETAIL}${REQUEST_TYPE}`
    })
    try {
        const response = await api(token).transactionDetails(data)
        dispatch({
            type: `${TRANSACTION_DETAIL}${SUCCESS_TYPE}`,
            payload: { data: response.data }
        })
    } catch (error) {
        dispatch({
            type: `${TRANSACTION_DETAIL}${FAILURE_TYPE}`,
            payload: { err: error }
        })
    }
}

export const getTimeline = (token, params) => async (dispatch) => {
    dispatch({
        type: TIMELINE_GET_REQ
    });
    try {
        const response = await api(token).timelineGet(params);
        dispatch({
            type: TIMELINE_GET_SUCCESS,
            payload: { data: response.data }
        });
    } catch (error) {
        dispatch({
            type: TIMELINE_GET_FAILED,
            payload: { err: error }
        });
    }
}

export const getListCancelAction = (token) => async (dispatch) => {
    dispatch({
        type: LIST_CANCEL_REQ
    });
    try {
        const response = await api(token).getListCancel();
        dispatch({
            type: LIST_CANCEL_SUCCESS,
            payload: { data: response.data }
        });
    } catch (error) {
        dispatch({
            type: LIST_CANCEL_FAILED,
            payload: { err: error }
        });
    }
}

export const patchCancelReasonAction = (token, body) => async (dispatch) => {
    dispatch({
        type: CANCEL_REASON_PATCH_REQ
    });
    try {
        const response = await api(token).patchCancelReason(body);
        dispatch({
            type: CANCEL_REASON_PATCH_SUCCESS,
            payload: { data: response.data }
        });
    } catch (error) {
        dispatch({
            type: CANCEL_REASON_PATCH_FAILED,
            payload: { data: error }
        });
    }
}

export const downloadFakturPajak = (token, orderNo) => async (dispatch) => {
    dispatch({
        type: DOWNLOAD_FAKTUR_PAJAK_REQ
    });
    try {
        const response = await api(token).getDownloadFakturPajak(orderNo);
        dispatch({
            type: DOWNLOAD_FAKTUR_PAJAK_SUCCESS,
            payload: { data: response.data }
        });
    } catch (error) {
        dispatch({
            type: DOWNLOAD_FAKTUR_PAJAK_FAILED,
            payload: { data: error }
        });
    }
}

export const downloadInvoice = (token, orderNo) => async (dispatch) => {
    dispatch({
        type: DOWNLOAD_INVOICE_REQ
    });
    try {
        const response = await api(token).getDownloadInvoice(orderNo);
        dispatch({
            type: DOWNLOAD_INVOICE_SUCCESS,
            payload: { data: response.data }
        });
    } catch (error) {
        dispatch({
            type: DOWNLOAD_INVOICE_FAILED,
            payload: { data: error }
        });
    }
}

export const patchOrderReceivedAction = (token, body) => async (dispatch) => {
    dispatch({
        type: ORDER_RECEIVED_PATCH_REQ
    });
    try {
        const response = await api(token).patchOrderReceived(body);
        dispatch({
            type: ORDER_RECEIVED_PATCH_SUCCESS,
            payload: { data: response.status }
        });
    } catch (error) {
        dispatch({
            type: ORDER_RECEIVED_PATCH_FAILED,
            payload: { data: error }
        });
    }
}