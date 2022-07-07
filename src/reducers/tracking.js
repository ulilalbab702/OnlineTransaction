import {
    SUCCESS_TYPE,
    STAGING_INFO,
    ASSIGN_TRACKING,
} from 'actions/actionTypes';
import { combineReducers } from 'redux';

const initialStateStaging = {
    data:[]
}
export const stagingInfo = (state={...initialStateStaging},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${STAGING_INFO}${SUCCESS_TYPE}`:
            return {data:payload}
        default:
            return state;
    }
}
const initialStateAssignTracking = {
    response:{}
}
export const fixingassignstaging = (state = {...initialStateAssignTracking},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${ASSIGN_TRACKING}${SUCCESS_TYPE}`:
            return {...state,...payload}
        default:
            return state;
    }
}

const trackingReducer = combineReducers({
    stagingInfo:stagingInfo,
    fixingassignstaging:fixingassignstaging
})

export {trackingReducer}