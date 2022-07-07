import {
    RELEASE_BLOCKED_LOGIN,
    SET_BLOCK_LOGIN,
    COUNT_FAILED_LOGIN,
    COUNT_DOWN_TIMER_LOCK,
    INITIAL_FAILED_LOGIN_STATUS
} from "actions/actionTypes";
import { combineReducers } from "redux";

const initialState = {
    failed_count: 0,
    lock_login: false,
    timer_lock: {
        minute: 0,
        second: 10
    }
};

export const blockedLogin = (state = { ...initialState }, action) => {
    const { payload, type } = action;
    let loginLocked = false
    if(localStorage.getItem('loginLocked') !== null) loginLocked = localStorage.getItem('loginLocked').toLowerCase() == 'true';
    
    const timer = JSON.parse(localStorage.getItem('loginTimer'));
    switch (type) {
        case INITIAL_FAILED_LOGIN_STATUS: {
            return { ...state, 
                failed_count: loginLocked ? 3 : 0,
                lock_login: loginLocked,
                timer_lock: timer
            };
        }
        case RELEASE_BLOCKED_LOGIN: {
            return { ...state, 
                failed_count: 0,
                lock_login: false,
                timer_lock: {
                    minute: 0,
                    second: 10
                } 
            };
        }
        case SET_BLOCK_LOGIN: {
            return { ...state, 
                failed_count: 3,
                lock_login: true,
                timer_lock: {
                    minute: 0,
                    second: 10
                } 
            };
        }
        case COUNT_FAILED_LOGIN: {
            const { data } = payload;
            return { ...state, 
                failed_count: data.failed_login
            };
        }
        case COUNT_DOWN_TIMER_LOCK: {
            const { data } = payload;
            return { ...state, 
                timer_lock: {
                    minute: data.minute,
                    second: data.second
                } 
            };
        }
        default:
            return state;
    }
};


const blockedLoginReducer = combineReducers({
    blockedLogin,
});

export { blockedLoginReducer };
