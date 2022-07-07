import { BrandApi } from "api";
import {
    BRAND_REQ,
    BRAND_SUCCESS,
    BRAND_FAILED,
    SET_CLICK_CHAT
} from "actions/actionTypes";

const api = (token) => BrandApi.newInstance(token);
export const listBrand = () => async (dispatch) => {
    dispatch({
        type: BRAND_REQ,
    });
    try {
        const res = await api(null).listBrandGet();
        dispatch({
            type: BRAND_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: BRAND_FAILED,
            payload: error,
        });
    }
};

export const setClick = value => {
    return {
        type: SET_CLICK_CHAT,
        payload: value
    }
}