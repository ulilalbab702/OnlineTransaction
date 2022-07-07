import {
    SUCCESS_TYPE,
    FETCH_LIST_MECHANIC,
    ASSIGN_JOB,
    UNASSIGN_JOB,
    SUMMARY,
} from 'actions/actionTypes';
import { combineReducers } from 'redux';

const initialState = {
    data:[],
};

export const listofMechanic = (state = {...initialState},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${FETCH_LIST_MECHANIC}${SUCCESS_TYPE}`:{
            const {data} = payload
            return {...state,data}
        }
        default:
            return state;
    }
}

const initialStateAssignJob = {response:false}
export const assignJob = (state = {...initialStateAssignJob},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${ASSIGN_JOB}${SUCCESS_TYPE}`:{
            return {
                response:payload
            }
        }
        default:
            return state;
    }
}

const initialStateUnassignJob = {
    data:{}
}
export const unassignJob = (state = {...initialStateUnassignJob},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${UNASSIGN_JOB}${SUCCESS_TYPE}`:
            return {...state,...payload}
        
        default:
            return state;
    }
}
const initialStateSummary = {
    value:{}
}
export const assignmentSummary = (state = {...initialStateSummary},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${SUMMARY}${SUCCESS_TYPE}`:
            return {...state,...payload};
        default:
            return state;
    }
}

const assignmentReducer = combineReducers({
    listOfMechanic:listofMechanic,
    assignJob:assignJob,
    unassignJob:unassignJob,
    summary:assignmentSummary,
})

export {assignmentReducer};