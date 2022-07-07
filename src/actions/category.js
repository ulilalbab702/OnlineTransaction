import { CategoryApi } from "api";
import {
    CATEGORY_REQ,
    CATEGORY_SUCCESS,
    CATEGORY_FAILED,
    REQUEST_TYPE,
    SUCCESS_TYPE,
    FAILURE_TYPE,
    CHECK_CUSTOMER,
    CHECK_STATUS
} from "actions/actionTypes";

const api = (token) => CategoryApi.newInstance(token);
export const listCategory = () => async (dispatch) => {
    dispatch({
        type: CATEGORY_REQ,
    });
    try {
        const res = await api(null).listCategoryGet();
        dispatch({
            type: CATEGORY_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: CATEGORY_FAILED,
            payload: error,
        });
    }
};

export const checkCustomer = (token) => async (dispatch) => {
    dispatch({
        type: `${CHECK_CUSTOMER}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).checkCustomer();
        dispatch({
            type: `${CHECK_CUSTOMER}${SUCCESS_TYPE}`,
            payload: { data: res.data }
        })
    } catch (error) {
        dispatch({
            type: `${CHECK_CUSTOMER}${FAILURE_TYPE}`,
            payload: { error: true }
        })
    }
}
export const clearError = () => {
    return {
        type: 'CLEAR_ERROR'
    }
}
export const clearStore = () => {
    return {
        type: 'CLEAR_STORE'
    }

};

export const checkStatus = (token) => async (dispatch) => {
    dispatch({
        type: `${CHECK_STATUS}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).checkStatus();
        dispatch({
            type: `${CHECK_STATUS}${SUCCESS_TYPE}`,
            payload: { data: res.data }
        })
    } catch (error) {
        dispatch({
            type: `${CHECK_STATUS}${FAILURE_TYPE}`,
            payload: { error: true }
        })
    }
}