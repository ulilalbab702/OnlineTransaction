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
} from "actions/actionTypes";
import { combineReducers } from "redux";

const initialState = {
    data: null,
    dataDetail: null,
    dataClaimed: null,
    loading: false,
    error: null,
    claimLoading: false,
    claimSuccess: null,
}

export const voucher = (state = { ...initialState }, action) => {
    const { payload, type } = action;
    switch (type) {
        case VOUCHER_ALL_REQ: {
            return { ...state, data: null, error: null, claimSuccess: null, loading: true };
        };
        case VOUCHER_ALL_SUCCESS: {
            const { data } = payload;
            return { ...state, data: data, error: null, loading: false }
        }
        case VOUCHER_ALL_FAILED: {
            const { error } = payload;
            return { ...state, data: null, error: error, loading: false }
        }
        case VOUCHER_DETAIL_REQ: {
            return { ...state, dataDetail: null, error: null, claimSuccess: null, loading: true }
        }
        case VOUCHER_DETAIL_SUCCESS: {
            const { data } = payload;
            return { ...state, dataDetail: data, error: null, loading: false }
        }
        case VOUCHER_DETAIL_FAILED: {
            const { error } = payload;
            return { ...state, dataDetail: null, error: error, loading: false }
        }
        case CLAIM_VOUCHER_REQ: {
            return { ...state, claimSuccess: null, error: null, claimLoading: true }
        }
        case CLAIM_VOUCHER_SUCCESS: {
            return { ...state, claimSuccess: true, error: null, claimLoading: false }
        }
        case CLAIM_VOUCHER_FAILED: {
            const { error } = payload;
            return { ...state, claimSuccess: false, error: error, claimLoading: false }
        }
        case VOUCHER_CLAIMED_REQ: {
            return { ...state, dataClaimed: null, error: null, loading: true }
        }
        case VOUCHER_CLAIMED_SUCCESS: {
            const { data } = payload;
            return { ...state, dataClaimed: data, error: null, loading: false }
        }
        case VOUCHER_CLAIMED_FAILED: {
            const { error } = payload;
            return { ...state, dataClaimed: null, error: error, loading: false }
        }
        default:
            return state;
    }
};

const voucherReducer = combineReducers({
    voucher,
});

export { voucherReducer };