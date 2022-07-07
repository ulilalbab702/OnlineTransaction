import {
    SUCCESS_TYPE,
    FAILURE_TYPE,
    CHECK_CUSTOMER,
    CHECK_STATUS
} from "actions/actionTypes";
import { combineReducers } from "redux";

export const customerCode = (state = null, action) => {
    const { payload, type } = action;
    switch (type) {
        case `${CHECK_CUSTOMER}${SUCCESS_TYPE}`: {
            return { ...state, ...payload.data };
        }
        case `CLEAR_STORE`:
            return state = null;
        default:
            return state;
    }
};

export const errorCustomer = (state = null, action) => {
    const { payload, type } = action;
    switch (type) {
        case `${CHECK_CUSTOMER}${FAILURE_TYPE}`: {
            return { ...state, ...payload };
        }
        case `CLEAR_ERROR`: {
            return state = null
        }
        default:
            return state;
    }
}

export const customerStatus = (state = null, action) => {
    const { payload, type } = action;
    switch (type) {
        case `${CHECK_STATUS}${SUCCESS_TYPE}`: {
            return { ...state, ...payload.data };
        }
        case `CLEAR_STORE`:
            return state = null;
        default:
            return state;
    }
};

export const errorStatus = (state = null, action) => {
    const { payload, type } = action;
    switch (type) {
        case `${CHECK_STATUS}${FAILURE_TYPE}`: {
            return { ...state, ...payload };
        }
        case `CLEAR_ERROR`: {
            return state = null
        }
        default:
            return state;
    }
}

const categoryReducer = combineReducers({
    customerCode,
    errorCustomer,
    customerStatus,
    errorStatus
});

export { categoryReducer };
