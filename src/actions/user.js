import { AccountApi } from 'api'
import {
    FAILURE_TYPE,
    GET_USER_TYPE,
    LOGIN_TYPE,
    REQUEST_TYPE,
    SUCCESS_TYPE,
    SIGNUP,
    FORGOT_PASSWORD,
    VERIFY_CODE,
    CHANGE_PASSWORD,
    CLEAR_ERROR,
    RELEASE_BLOCKED_LOGIN
} from './actionTypes';
import {
    setStorage
} from 'utils/storage.helper';
import { USER_STORAGE } from 'constants/storage';
import { getStorage } from 'utils/storage.helper';

export const getUser = () => dispatch => {
    dispatch({ type: `${GET_USER_TYPE}${REQUEST_TYPE}` });
    const user = getStorage(USER_STORAGE);
    if (user) {
        dispatch({
            type: `${GET_USER_TYPE}${SUCCESS_TYPE}`,
            payload: { data: user },
        });
    } else {
        dispatch({
            type: `${GET_USER_TYPE}${FAILURE_TYPE}`,
            payload: { message: null },
        });
    }
};

export const login = (data) => async dispatch => {
    const api = AccountApi.newInstance();
    dispatch({ type: `${LOGIN_TYPE}${REQUEST_TYPE}` });
    try {
        const response = await api.login(data)
        setStorage(USER_STORAGE, response.data);
        dispatch({ type: CLEAR_ERROR })
        dispatch({ type: RELEASE_BLOCKED_LOGIN })
        dispatch({
            type: `${LOGIN_TYPE}${SUCCESS_TYPE}`,
            payload: {
                statusCode: response.status,
                data: response.data,
            },
        });
    } catch (error) {
        dispatch({
            type: `${LOGIN_TYPE}${FAILURE_TYPE}`,
            payload: { message: true }
        });
    }
};
export const loginGoogle = (data) => async dispatch => {
    const api = AccountApi.newInstance();
    dispatch({ type: `${LOGIN_TYPE}${REQUEST_TYPE}` });
    try {
        const response = await api.loginGoogle(data)
        setStorage(USER_STORAGE, response.data);
        dispatch({ type: CLEAR_ERROR })
        dispatch({ type: RELEASE_BLOCKED_LOGIN })
        dispatch({
            type: `${LOGIN_TYPE}${SUCCESS_TYPE}`,
            payload: {
                statusCode: response.status,
                data: response.data,
            },
        });
    } catch (error) {
        dispatch({
            type: `${LOGIN_TYPE}${FAILURE_TYPE}`,
            payload: { message: true }
        });
    }
};
export const signup = (data) => async dispatch => {
    const api = AccountApi.newInstance();
    dispatch({
        type: `${SIGNUP}${REQUEST_TYPE}`
    })
    try {
        const response = await api.signup(data)
        dispatch({
            type: `${SIGNUP}${SUCCESS_TYPE}`,
            payload: { data: response.data }
        })
    } catch (error) {
        dispatch({
            type: `${SIGNUP}${FAILURE_TYPE}`,
            payload: { error: error?.response?.data }
        })
    }
}
export const forgotPassword = (data) => async dispatch => {
    const api = AccountApi.newInstance();
    dispatch({
        type: `${FORGOT_PASSWORD}${REQUEST_TYPE}`
    })
    let response = null
    try {
        const response = await api.forgotPassword({ email: data.email, applicationId: process.env.REACT_APP_APPLICATION_ID })
        if (response.data != null) {
            dispatch({
                type: `${FORGOT_PASSWORD}${SUCCESS_TYPE}`,
                payload: { data: response }
            })
            response = response.status
        }
    } catch (error) {
        if (JSON.stringify(error) != "{}") {
            response = '400'
            dispatch({
                type: `${FORGOT_PASSWORD}${FAILURE_TYPE}`,
                payload: { error: error?.response?.data }
            })
        }
    }
    return response;
}
export const verifyCode = (data) => async dispatch => {
    const api = AccountApi.newInstance();
    dispatch({
        type: `${VERIFY_CODE}${REQUEST_TYPE}`
    })
    let res = null
    try {
        const response = await api.verifyCode(data)
        dispatch({
            type: `${VERIFY_CODE}${SUCCESS_TYPE}`,
            payload: { data: response.status }
        })
        res = response.status
    } catch (error) {
        if (error.status !== 200) {
            res = error.response.data
        }
    }
    return res
}

export const changePassword = (data) => async dispatch => {
    const api = AccountApi.newInstance();
    dispatch({
        type: `${CHANGE_PASSWORD}${REQUEST_TYPE}`
    })
    let res = null
    try {
        const response = await api.changePassword(data)
        dispatch({
            type: `${CHANGE_PASSWORD}${SUCCESS_TYPE}`,
            payload: { data: response }
        })
        res = response.status
    } catch (error) {
        if (error.status !== 200) {
            res = error.response.data
        }
    }
    return res
}
