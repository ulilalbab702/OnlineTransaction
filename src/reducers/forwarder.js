import { combineReducers } from "redux";
import {
    GET_TIMELINE_FORWARDER_REQ,
    GET_TIMELINE_FORWARDER_SUCCESS,
    GET_TIMELINE_FORWARDER_FAILED,
} from "actions/actionTypes";

const initialState = {
    dataTimeline: null,
    loading: false,
    error: null,
};

export const forwarder = (state = { ...initialState }, action) => {
    const { payload, type } = action;
    switch (type) {
        case GET_TIMELINE_FORWARDER_REQ: {
            return { ...state, dataTimeline: null, error: null, loading: true }
        };
        case GET_TIMELINE_FORWARDER_SUCCESS: {
            const { data } = payload;
            return { ...state, dataTimeline: data, error: null, loading: false }
        };
        case GET_TIMELINE_FORWARDER_FAILED: {
            const { err } = payload;
            return { ...state, dataTimeline: null, error: err, loading: false }
        };
        default:
            return state;
    }
};

const forwarderReducer = combineReducers({
    forwarder,
});

export { forwarderReducer };