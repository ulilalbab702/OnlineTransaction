import {TrackingApi} from 'api';
import {
    SUCCESS_TYPE,
    REQUEST_TYPE,
    FAILURE_TYPE,
    STAGING_INFO,
    ASSIGN_TRACKING,
} from 'actions/actionTypes';

const api = token => TrackingApi.newInstance(token);
export const stagingInfo = (woId,token) => async dispatch => {
    dispatch({
        type:`${STAGING_INFO}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).stagingInfo(woId)
        dispatch({
            type:`${STAGING_INFO}${SUCCESS_TYPE}`,
            payload:res.data
        })
        
    } catch (error) {
        dispatch({
            type:`${STAGING_INFO}${FAILURE_TYPE}`
        })
    }
}
export const fixingassignstaging = (trackingParams,token) => async dispatch => {
    dispatch({
        type:`${ASSIGN_TRACKING}${REQUEST_TYPE}`,
    })
    try {
        const res = await api(token).fixingassignstaging(trackingParams)
        dispatch({
            type:`${ASSIGN_TRACKING}${SUCCESS_TYPE}`,
            payload:{response:res}
        })
    } catch (error) {
        dispatch({
            type:`${ASSIGN_TRACKING}${FAILURE_TYPE}`
        })
    }
}