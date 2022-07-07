import { TermConditionApi } from "api";
import {
    TERM_CONDITION_REQ,
    TERM_CONDITION_SUCCESS,
    TERM_CONDITION_FAILED,
    PUT_TERM_CONDITION_REQ,
    PUT_TERM_CONDITION_SUCCESS,
    PUT_TERM_CONDITION_FAILED,
} from "actions/actionTypes";

const api = (token) => TermConditionApi.newInstance(token);
export const termConditionGet = (token) => async (dispatch) => {
    dispatch({
        type: TERM_CONDITION_REQ,
    });
    try {
        const res = await api(token).getTermCondition();
        dispatch({
            type: TERM_CONDITION_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: TERM_CONDITION_FAILED,
            payload: error,
        });
    }
};

export const updateTermCondition = (token, version) => async (dispatch) => {
    dispatch({
        type: PUT_TERM_CONDITION_REQ,
    });
    try {
        const res = await api(token).updateTermCondition(version);
        dispatch({
            type: PUT_TERM_CONDITION_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: PUT_TERM_CONDITION_FAILED,
            payload: error,
        });
    }
};
