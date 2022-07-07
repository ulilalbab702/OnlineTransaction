import { VoucherApi } from "api";
import {
    VOUCHER_ALL_REQ,
    VOUCHER_ALL_SUCCESS,
    VOUCHER_ALL_FAILED,
    VOUCHER_DETAIL_REQ,
    VOUCHER_DETAIL_SUCCESS,
    VOUCHER_DETAIL_FAILED,
    CLAIM_VOUCHER_REQ,
    CLAIM_VOUCHER_SUCCESS,
    CLAIM_VOUCHER_FAILED,
    VOUCHER_CLAIMED_REQ,
    VOUCHER_CLAIMED_SUCCESS,
    VOUCHER_CLAIMED_FAILED,
} from "actions/actionTypes"

const api = (token) => VoucherApi.newInstance(token);

export const voucherList = (token, PageSize) => async (dispatch) => {
    dispatch({
        type: VOUCHER_ALL_REQ
    });
    try {
        const res = await api(token).voucherAllGet(PageSize);
        dispatch({
            type: VOUCHER_ALL_SUCCESS,
            payload: { data: res.data }
        });
    } catch (error) {
        dispatch({
            type: VOUCHER_ALL_FAILED,
            payload: error
        });
    }
};

export const voucherDetail = (token, id) => async (dispatch) => {
    dispatch({
        type: VOUCHER_DETAIL_REQ
    });
    try {
        const res = await api(token).VoucherDetailGet(id);
        dispatch({
            type: VOUCHER_DETAIL_SUCCESS,
            payload: { data: res.data }
        });
    } catch (error) {
        dispatch({
            type: VOUCHER_DETAIL_FAILED,
            payload: error
        });
    }
};

export const voucherClaim = (token, body) => async (dispatch) => {
    dispatch({
        type: CLAIM_VOUCHER_REQ,
    });
    try {
        const res = await api(token).VoucherClaimPost(body);
        dispatch({
            type: CLAIM_VOUCHER_SUCCESS,
            payload: { data: res.data }
        });
    } catch (error) {
        dispatch({
            type: CLAIM_VOUCHER_FAILED,
            payload: error
        });
    }
};

export const voucherClaimedList = (token, code) => async (dispatch) => {
    dispatch({
        type: VOUCHER_CLAIMED_REQ
    });
    try {
        const res = await api(token).voucherClaimedGet(code);
        dispatch({
            type: VOUCHER_CLAIMED_SUCCESS,
            payload: { data: res.data }
        });
    } catch (error) {
        dispatch({
            type: VOUCHER_CLAIMED_FAILED,
            payload: error
        });
    }
};