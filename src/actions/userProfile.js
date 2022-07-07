import { UserProfileApi, ChangeProfileApi } from "api";
import {
    USER_PROFILE_REQ,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAILED,
    CHANGE_PROFILE_REQ,
    CHANGE_PROFILE_SUCCESS,
    CHANGE_PROFILE_FAILED,
    IMAGE_PROFILE_GLOBAL,
} from "actions/actionTypes";

export const listUserProfileGet = (token, userId) => async (dispatch) => {
    const api = (token) => UserProfileApi.newInstance(token);
    dispatch({
        type: USER_PROFILE_REQ,
    });
    try {
        const data = {
            userId: userId,
            clientId: 'usermanagement'
        }
        const res = await api(token).postUserInfo(data);
        dispatch({
            type: USER_PROFILE_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: USER_PROFILE_FAILED,
            payload: error
        });
    }
};

export const ChangeProfilFunc = (token, userId, file) => async (dispatch) => {
    const api = (token) => ChangeProfileApi.newInstance(token);
    dispatch({
        type: CHANGE_PROFILE_REQ,
    });
    try {
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("file", file);
        formData.append("clientId", "customerportal")
        const res = await api(token).changeProfilePic(formData)
        dispatch({
            type: CHANGE_PROFILE_SUCCESS,
            payload: { data: res }
        });
    } catch (error) {
        dispatch({
            type: CHANGE_PROFILE_FAILED,
            payload: { err: error }
        })
    }
};

export const setimageGlobal = (text) => ({
    type: IMAGE_PROFILE_GLOBAL,
    payload: text,
});