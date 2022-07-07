import { ListNewsApi, UploadDownloadApi, CategoryApi, CartApi } from "api";
import {
    LIST_NEWS_REQ,
    LIST_NEWS_SUCCESS,
    LIST_NEWS_FAILED,
    IMAGE_SLIDER_REQ,
    IMAGE_SLIDER_SUCCESS,
    IMAGE_SLIDER_FAILED,
    PROFILE_NEWS_REQ,
    PROFILE_NEWS_SUCCESS,
    PROFILE_NEWS_FAILED,
    MAIN_NEWS_REQ,
    MAIN_NEWS_SUCCESS,
    MAIN_NEWS_FAILED,
    LIST_NEWS_HOME_REQ,
    LIST_NEWS_HOME_SUCCESS,
    LIST_NEWS_HOME_FAILED,
    LIST_NEWS_ADDITIONAL_REQ,
    LIST_NEWS_ADDITIONAL_SUCCESS,
    LIST_NEWS_ADDITIONAL_FAILED,
    DOWNLOAD_CSV_FAILED,
    DOWNLOAD_CSV_REQ,
    DOWNLOAD_CSV_SUCCESS,
    UPLOAD_CSV_REQ,
    UPLOAD_CSV_FAILED,
    UPLOAD_CSV_SUCCESS,
    UPLOAD_FILE_REQ,
    UPLOAD_FILE_FAILED,
    UPLOAD_FILE_SUCCESS,
    BRANCH_LIST_REQ,
    BRANCH_LIST_FAILED,
    BRANCH_LIST_SUCCESS,
    SEARCH_SUGGESTION_LIST_REQ,
    SEARCH_SUGGESTION_LIST_SUCCESS,
    SEARCH_SUGGESTION_LIST_FAILED,
    CHECKSTOCK_FAILED,
    CHECKSTOCK_REQ,
    CHECKSTOCK_SUCCESS,
    CHECKPRICE_REQ,
    CHECKPRICE_SUCCESS,
    CHECKPRICE_FAILED,
    POST_CART_REQ,
    POST_CART_SUCCESS,
    POST_CART_FAILED
} from "actions/actionTypes";

const api = (token) => ListNewsApi.newInstance(token);
const apiUploadDwnload = (token) => UploadDownloadApi.newInstance(token);
const apiBranch = (token) => CategoryApi.newInstance(token);
const apiCart = (token) => CartApi.newInstance(token);

export const listNews = (attributValue, PageSize, PageNumber) => async (dispatch) => {
    try {
        const res = await api(null).listNewsGet(attributValue, PageSize, PageNumber);
        dispatch({
            type: LIST_NEWS_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: LIST_NEWS_FAILED,
            payload: error,
        });
    }
};
export const listNewsReq = () => (dispatch) => {
    dispatch({
        type: LIST_NEWS_REQ,
    });
}

export const listNewsHome = (attributValue, PageSize, PageNumber) => async (dispatch) => {
    dispatch({
        type: LIST_NEWS_HOME_REQ,
    });
    try {
        const res = await api(null).listNewsGet(attributValue, PageSize, PageNumber);
        dispatch({
            type: LIST_NEWS_HOME_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: LIST_NEWS_HOME_FAILED,
            payload: error,
        });
    }
};

export const listNewsAdditional = (attributValue, PageSize, PageNumber) => async (dispatch) => {
    dispatch({
        type: LIST_NEWS_ADDITIONAL_REQ,
    });
    try {
        const res = await api(null).listNewsGet(attributValue, PageSize, PageNumber);
        dispatch({
            type: LIST_NEWS_ADDITIONAL_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: LIST_NEWS_ADDITIONAL_FAILED,
            payload: error,
        });
    }
};

export const newsImageSlider = (AttributeValue) => async (dispatch) => {
    dispatch({
        type: IMAGE_SLIDER_REQ,
    });
    try {
        const res = await api(null).newsImageSliderGet(AttributeValue);
        dispatch({
            type: IMAGE_SLIDER_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: IMAGE_SLIDER_FAILED,
            payload: error
        });
    }
};

export const newsProfileNews = (AttributeValue) => async (dispatch) => {
    dispatch({
        type: PROFILE_NEWS_REQ,
    });
    try {
        const res = await api(null).newsProfileNewsGet(AttributeValue);
        dispatch({
            type: PROFILE_NEWS_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: PROFILE_NEWS_FAILED,
            payload: error
        });
    }
};

export const newsMainNews = (AttributeValue) => async (dispatch) => {
    dispatch({
        type: MAIN_NEWS_REQ,
    });
    try {
        const res = await api(null).newsMainNewsGet(AttributeValue);
        dispatch({
            type: MAIN_NEWS_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: MAIN_NEWS_FAILED,
            payload: error
        });
    }
};

export const getTemplate = (token) => async (dispatch) => {
    dispatch({
        type: DOWNLOAD_CSV_REQ,
    });
    let response = null
    try {
        const res = await apiUploadDwnload(token).getTemplate();
        if (res.data != null) {
            dispatch({
                type: DOWNLOAD_CSV_SUCCESS,
                payload: { data: res.data },
            });
            response = res.data
        }

    } catch (error) {
        dispatch({
            type: DOWNLOAD_CSV_FAILED,
            payload: error
        });
        response = '400'
    }
    return response
};

export const uploadCsvTemplate = (token, formData) => async (dispatch) => {
    dispatch({
        type: UPLOAD_CSV_REQ,
    });
    let response = null
    try {
        const res = await apiUploadDwnload(token).postCsv(formData);
        if (res.data != null) {
            dispatch({
                type: UPLOAD_CSV_SUCCESS,
                payload: { data: res.data },
            });
            response = res.data
        }
        return response
    } catch (error) {
        dispatch({
            type: UPLOAD_CSV_FAILED,
            payload: error
        });
        response = '400'
    }
    return response
};

export const uploadAttachment = (token, file) => async (dispatch) => {
    dispatch({
        type: UPLOAD_FILE_REQ,
    });
    let response = null
    try {
        const res = await apiUploadDwnload(token).postFile(file);
        if (res.data != null) {
            dispatch({
                type: UPLOAD_FILE_SUCCESS,
                payload: { data: res.data },
            });
            response = res.data
        }

    } catch (error) {
        response = '400'
        dispatch({
            type: UPLOAD_FILE_FAILED,
            payload: error
        });
    }
    return response
};

export const getBranchList = (token, IsGetAll, Description) => async (dispatch) => {
    dispatch({
        type: BRANCH_LIST_REQ,
    });
    let resp = null
    try {
        const res = await apiBranch(token).listBranchGet(IsGetAll, Description);
        if (res.data != null) {
            dispatch({
                type: BRANCH_LIST_SUCCESS,
                payload: { data: res.data },
            });
        }
        resp = res.data

    } catch (error) {
        dispatch({
            type: BRANCH_LIST_FAILED,
            payload: error
        });
        resp = '400'

    }
    return resp
};

export const getSearchSuggestionList = (token, keyword, id) => async (dispatch) => {
    dispatch({
        type: SEARCH_SUGGESTION_LIST_REQ,
    });
    try {

        const res = await apiBranch(token).getSearchSuggestion(keyword, id);
        if (res.data != null) {
            dispatch({
                type: SEARCH_SUGGESTION_LIST_SUCCESS,
                payload: { data: res.data },
            });
        }

    } catch (error) {
        dispatch({
            type: SEARCH_SUGGESTION_LIST_FAILED,
            payload: error
        });
    }
};

export const getCheckStock = (token, body) => async (dispatch) => {
    dispatch({
        type: CHECKSTOCK_REQ,
    });
    let response = null
    try {
        const res = await apiBranch(token).getCheckStock(body);
        if (res.data != null) {
            dispatch({
                type: CHECKSTOCK_SUCCESS,
                payload: { data: res.data },
            });
            response = res.data
        }
    } catch (error) {
        response = "400"
        dispatch({
            type: CHECKSTOCK_FAILED,
            payload: error
        });
    }
    return response
};

export const resetStock = () => (dispatch) => {
    dispatch({
        type: CHECKSTOCK_REQ,
    });
}

export const getCheckPrice = (token, body) => async (dispatch) => {
    dispatch({
        type: CHECKPRICE_REQ,
    });
    let resp = null
    try {
        const res = await apiBranch(token).getCheckPrice(body);
        if (res.data != null) {
            dispatch({
                type: CHECKPRICE_SUCCESS,
                payload: { data: res.data },
            });
            resp = res.data
        }
    } catch (error) {
        dispatch({
            type: CHECKPRICE_FAILED,
            payload: error
        });
        resp = '400'
    }
    return resp
};

export const postCartData = (token, body) => async (dispatch) => {
    dispatch({
        type: POST_CART_REQ,
    });
    let resp = null
    try {
        const res = await apiCart(token).postCartItem(body);
        if (res.data != null) {
            dispatch({
                type: POST_CART_SUCCESS,
                payload: { data: res.data },
            });
            resp = res.data
        }

    } catch (error) {
        dispatch({
            type: POST_CART_FAILED,
            payload: { data: error },
        });
        resp = '400'
    }
    return resp

};