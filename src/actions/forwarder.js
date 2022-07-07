import { ForwarderApi } from "api";
import {
    GET_TIMELINE_FORWARDER_REQ,
    GET_TIMELINE_FORWARDER_SUCCESS,
    GET_TIMELINE_FORWARDER_FAILED,
} from "actions/actionTypes";

const api = (token) => ForwarderApi.newInstance(token);

export const timelineForwarderGet = (token, ExternalNumber) => async (dispatch) => {
    dispatch({
        type: GET_TIMELINE_FORWARDER_REQ,
    });
    try {
        const res = await api(token).getForwarderTimeline(ExternalNumber);
        dispatch({
            type: GET_TIMELINE_FORWARDER_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: GET_TIMELINE_FORWARDER_FAILED,
            payload: { err: error },
        });
    }
};