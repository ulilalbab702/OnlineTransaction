import {
    TERM_CONDITION_REQ,
    TERM_CONDITION_SUCCESS,
    TERM_CONDITION_FAILED,
    PUT_TERM_CONDITION_REQ,
    PUT_TERM_CONDITION_SUCCESS,
    PUT_TERM_CONDITION_FAILED
} from "actions/actionTypes";
import { combineReducers } from "redux";

const initialState = {
    data: {},
    err: '',
    loading: false,
    updateData: null,
    updateErr: null,
    updateLoading: false,
};

export const termCondition = (state = { ...initialState }, action) => {
    const { payload, type } = action;
    switch (type) {
        case TERM_CONDITION_REQ: {
            return { ...state, loading: true };
        }
        case TERM_CONDITION_SUCCESS: {
            const { data } = payload;
            return { ...state, data };
        }
        case TERM_CONDITION_FAILED: {
            const { err } = payload;
            return { ...state, err, loading: false };
        }
        case PUT_TERM_CONDITION_REQ: {
            return { ...state, updateErr: null, updateData: null, updateLoading: true };
        }
        case PUT_TERM_CONDITION_SUCCESS: {
            const { data } = payload;
            return { ...state, updateErr: null, updateData: data, updateLoading: false };
        }
        case PUT_TERM_CONDITION_FAILED: {
            const { err } = payload;
            return { ...state, updateErr: err, updateData: null, updateLoading: false };
        }
        default:
            return state;
    }
};

const termConditionReducer = combineReducers({
    termCondition: termCondition,
});

export { termConditionReducer };
