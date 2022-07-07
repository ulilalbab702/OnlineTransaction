import {
    USER_PROFILE_REQ,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAILED,
    CHANGE_PROFILE_REQ,
    CHANGE_PROFILE_SUCCESS,
    CHANGE_PROFILE_FAILED,
    IMAGE_PROFILE_GLOBAL,
} from "actions/actionTypes";
import { combineReducers } from "redux";

const initialState = {
    data: null,
    err: '',
    loading: false,
    imageGlobal: null,
    dataProfile: null,
    errProfile: null
};

export const userProfile = (state = { ...initialState }, action) => {
    const { payload, type } = action;
    switch (type) {
        case USER_PROFILE_REQ: {
            return { ...state, dataProfile: null, loading: true };
        }
        case USER_PROFILE_SUCCESS: {
            const { data } = payload;
            return { ...state, data, loading: false };
        }
        case USER_PROFILE_FAILED: {
            const { err } = payload;
            return { ...state, err };
        }
        case CHANGE_PROFILE_REQ: {
            return { ...state, dataProfile: null, loading: true };
        }
        case CHANGE_PROFILE_SUCCESS: {
            const { data } = payload;
            return { ...state, dataProfile: data, loading: false };
        }
        case CHANGE_PROFILE_FAILED: {
            const { err } = payload;
            return { ...state, dataProfile: null, errProfile: err };
        }
        case IMAGE_PROFILE_GLOBAL:
            return { ...state, error: '', imageGlobal: action.payload };
        default:
            return state;
    }
};

const userProfileReducer = combineReducers({
    userProfile: userProfile,
});

export { userProfileReducer };
