import { Data } from "@react-google-maps/api";
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
    LIST_NEWS_ADDITIONAL_FAILED,
    LIST_NEWS_ADDITIONAL_REQ,
    LIST_NEWS_ADDITIONAL_SUCCESS,
    DOWNLOAD_CSV_FAILED,
    DOWNLOAD_CSV_SUCCESS,
    DOWNLOAD_CSV_REQ,
    UPLOAD_CSV_FAILED,
    UPLOAD_CSV_SUCCESS,
    UPLOAD_CSV_REQ,
    UPLOAD_FILE_FAILED,
    UPLOAD_FILE_REQ,
    UPLOAD_FILE_SUCCESS,
    BRANCH_LIST_FAILED,
    BRANCH_LIST_REQ,
    BRANCH_LIST_SUCCESS,
    SEARCH_SUGGESTION_LIST_FAILED,
    SEARCH_SUGGESTION_LIST_REQ,
    SEARCH_SUGGESTION_LIST_SUCCESS,
    CHECKSTOCK_SUCCESS,
    CHECKSTOCK_REQ,
    CHECKPRICE_SUCCESS,
    POST_CART_FAILED,
    POST_CART_REQ,
    POST_CART_SUCCESS,
    CART_LIST_SUCCESS
} from "actions/actionTypes";
import { combineReducers } from "redux";

const initialState = {
    data: {
        data: [],
    },
    newsHome: {
        data: []
    },
    newsAdditional: {
        data: []
    },
    loadingNews: false,
    loadingAdditional: false,
    downloadFile: null,
    uploadCsv: null,
    branchList: null,
    suggestionList: [],
    stockList: [],
    priceList: null,
    uploadPdf: null,
    cartData: null,
    loadingCart: false,
    errorCartData: null,
};

export const listNews = (state = { ...initialState }, action) => {
    const { payload, type } = action;
    switch (type) {
        case LIST_NEWS_SUCCESS: {
            const { data } = payload;
            return {
                ...state,
                loadingNews: false,
                ...data,
                data: {
                    ...state.data,
                    data: [...state.data.data, ...data.data]
                },
            };
        }
        case UPLOAD_FILE_SUCCESS: {
            const { data } = payload;
            return {
                ...state,
                uploadPdf: data
            };
        }
        case POST_CART_REQ: {
            return {
                ...state,
                cartData: null,
                loadingCart: true,
            };  
        }
        case POST_CART_SUCCESS: {
            const { data } = payload;
            return {
                ...state,
                cartData: data,
                loadingCart: false,
            };
        }
        case POST_CART_FAILED: {
            const { data } = payload;
            return {
                ...state,
                cartData: null,
                loadingCart: false,
                errorCartData: data
            };
        }
        case BRANCH_LIST_REQ: {
            return {
                ...state,
                branchList: null
            };
        }
        case BRANCH_LIST_SUCCESS: {
            const { data } = payload;
            return {
                ...state,
                branchList: data
            };
        }
        case CHECKPRICE_SUCCESS: {
            const { data } = payload;
            return {
                ...state,
                priceList: data
            };
        }
        case SEARCH_SUGGESTION_LIST_SUCCESS: {
            const { data } = payload;
            return {
                ...state,
                suggestionList: data
            };
        }
        case CHECKSTOCK_REQ: {
            return {
                ...state,
                stockList: []
            };
        }
        case CHECKSTOCK_SUCCESS: {
            const { data } = payload;
            return {
                ...state,
                stockList: data
            };
        }
        case DOWNLOAD_CSV_SUCCESS: {
            const { data } = payload;
            return {
                ...state,
                downloadFile: data
            };
        }
        case UPLOAD_CSV_SUCCESS: {
            const { data } = payload;
            return {
                ...state,
                uploadCsv: data
            };
        }
        case LIST_NEWS_REQ: {
            return {
                ...state, data: {
                    data: []
                }
            }
        }
        case LIST_NEWS_HOME_FAILED: {
            return {
                ...state, loadingNews: false,
            }
        }
        case LIST_NEWS_HOME_SUCCESS: {
            const { data } = payload;
            return {
                ...state,
                loadingNews: false,
                newsHome: {
                    data
                },
            };
        }
        case LIST_NEWS_HOME_REQ: {
            return {
                ...state,
                loadingNews: true,
                newsHome: {
                    data: []
                }
            }
        }
        case LIST_NEWS_ADDITIONAL_SUCCESS: {
            const { data } = payload;
            return {
                ...state,
                loadingAdditional: false,
                newsAdditional: {
                    data
                },
            };
        }
        case LIST_NEWS_ADDITIONAL_REQ: {
            return {
                ...state,
                loadingAdditional: true,
                newsAdditional: {
                    data: []
                }
            }
        }
        case LIST_NEWS_ADDITIONAL_FAILED: {
            return {
                ...state,
                loadingAdditional: false,
            }
        }
        default:
            return state;
    }
};

export const newsImageSlider = (state = { ...initialState }, action) => {
    const { payload, type } = action;
    switch (type) {
        case IMAGE_SLIDER_SUCCESS: {
            const { data } = payload;
            return { ...state, data };
        }
        default:
            return state;
    }
};

export const newsProfileNews = (state = { ...initialState }, action) => {
    const { payload, type } = action;
    switch (type) {
        case PROFILE_NEWS_SUCCESS: {
            const { data } = payload;
            return { ...state, data };
        }
        default:
            return state;
    }
};

export const newsMainNews = (state = { ...initialState }, action) => {
    const { payload, type } = action;
    switch (type) {
        case MAIN_NEWS_SUCCESS: {
            const { data } = payload;
            return { ...state, data };
        }
        default:
            return state;
    }
};

const listNewsReducer = combineReducers({
    listNews: listNews,
    newsImageSlider: newsImageSlider,
    newsProfileNews: newsProfileNews,
    newsMainNews: newsMainNews
});

export { listNewsReducer }
