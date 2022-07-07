import {
    INITIAL_FAILED_LOGIN_STATUS,
    RELEASE_BLOCKED_LOGIN,
    SET_BLOCK_LOGIN,
    COUNT_FAILED_LOGIN,
    COUNT_DOWN_TIMER_LOCK,
} from "actions/actionTypes";

export const initialBlockedLoginStatus = () => (dispatch) => {
    dispatch({
        type: INITIAL_FAILED_LOGIN_STATUS,
    });
};

export const releaseBlockedLogin = () => (dispatch) => {
    dispatch({
        type: RELEASE_BLOCKED_LOGIN,
    });
};

export const blockLogin = () => (dispatch) => {
    dispatch({
        type: SET_BLOCK_LOGIN,
    });
};

export const countFailedLogin = (failed_login) => (dispatch) => {
    dispatch({
        type: COUNT_FAILED_LOGIN,
        payload: { data: { failed_login } },
    });
}

export const countDownTimerLock = (timer) => (dispatch) => {
    dispatch({
        type: COUNT_DOWN_TIMER_LOCK,
        payload: { data: { minute: timer.minute, second: timer.second } },
    });
}