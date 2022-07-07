import {
    SUCCESS_TYPE,
    FETCH_LIST_JOBS_ASSIGNMENT,
    FETCH_JOB_DETAIL,
    FETCH_EQUIPMENT_VALUE_GET,
    FETCH_JOB_REPORT,
    HANDOVER_JOB
} from 'actions/actionTypes';
import { combineReducers } from 'redux';

const initialState = {
    data:{},
};

export const listJobAssignmentReducer = (state = {...initialState},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${FETCH_LIST_JOBS_ASSIGNMENT}${SUCCESS_TYPE}`:{
            const {data} = payload
            data.JobTypes.unshift('All Job')
            data.UnitModels.unshift('All Unit Model')
            data.Customers.unshift('All Customers')
            return {...state,data}
        }
        default:
            return state;
    }
}
const initialStateUnitIdentity = {
    detail:{}
}
export const jobDetail = (state={...initialStateUnitIdentity},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${FETCH_JOB_DETAIL}${SUCCESS_TYPE}`:{
            return {...state,...payload}
        }
        default:
            return state;
    }
}

const initialStateEquipmentValueGet = {
    jobTime:{}
};
export const equipmentValueGet = (state={...initialStateEquipmentValueGet},action) => {
    const {payload,type} = action
    switch (type) {
        case `${FETCH_EQUIPMENT_VALUE_GET}${SUCCESS_TYPE}`:
        return {...state, ...payload}
        default:
            return state;
    }
}

const initialStateJobReport = {
    data:{}
}
export const listOfJobReport = (state = {...initialStateJobReport},action) => {
    const {payload,type} = action
    switch (type) {
        case `${FETCH_JOB_REPORT}${SUCCESS_TYPE}`:
            payload.data.JobTypes.unshift('All Job')
            payload.data.UnitModels.unshift('All Unit Model')
            payload.data.Customers.unshift('All Customers')
            return {...state,...payload}
        default:
            return state;
    }
}
const initialStateHandOver = {
    data:{}
}
export const handoverTrigger = (state = {...initialStateHandOver},action) => {
    const {payload,type} = action
    switch (type) {
        case `${HANDOVER_JOB}${SUCCESS_TYPE}`:
            return {...state,...payload}
        default:
            return state;
    }
}
const workOrderReducer = combineReducers({
    listJobAssignment:listJobAssignmentReducer,
    jobDetail:jobDetail,
    equipmentValueGet:equipmentValueGet,
    listOfJobReport:listOfJobReport,
    handoverTrigger:handoverTrigger
})

export {workOrderReducer};