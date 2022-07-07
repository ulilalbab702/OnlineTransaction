import {
    SUCCESS_TYPE,
    FETCH_FORM_UNIT_MODEL,
    GET_CHECKSHEET_VALUE,
    APPROVE_PERIODIC_INSPECTION,
    DOWNLOAD_REPORT_PI,
    CHECKSHEET_VALIDATION,
    RESET_INITIAL_STATE
} from 'actions/actionTypes';
import { combineReducers } from 'redux';

const initialStateUnitModel = {
    data:{}
}
export const formUnitModel = (state = {...initialStateUnitModel},action) => {
const {payload,type} = action;
    switch (type) {
        case `${FETCH_FORM_UNIT_MODEL}${SUCCESS_TYPE}`:
            return {...state,...payload}
        default:
            return state;
    }
}
const initialStateValidation = {
    data:[]
}
export const checksheetModelValidation = (state = {...initialStateValidation},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${CHECKSHEET_VALIDATION}${SUCCESS_TYPE}`:
            return {...state,...payload}
        default:
            return state;
    }
}

const initialStateCheckSheet = {
    data:{}
}
export const getCheckSheetValue = (state = {...initialStateCheckSheet},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${GET_CHECKSHEET_VALUE}${SUCCESS_TYPE}`:
            return {...state,...payload};
    
        default:
            return state;
    }
}
const initialStateApprove = {
    response:{}
}
export const formApprove = (state = {...initialStateApprove},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${APPROVE_PERIODIC_INSPECTION}${SUCCESS_TYPE}`:
            return {...state,...payload}
        default:
            return state;
    }
}
const initialStateDownloadReport = {
    data:{}
}
export const downloadReportPI = (state={...initialStateDownloadReport},action) => {
    const {payload,type}=action;
    switch (type) {
        case `${DOWNLOAD_REPORT_PI}${SUCCESS_TYPE}`:
            return {...state,...payload}
        case `${RESET_INITIAL_STATE}`:
            return initialStateDownloadReport
        default:
            return state;
    }
}
const periodicInspectionReducer = combineReducers ({
    formUnitModel:formUnitModel,
    getCheckSheetValue:getCheckSheetValue,
    formApprove:formApprove,
    downloadReportPI:downloadReportPI,
    checksheetModelValidation:checksheetModelValidation
})
export {periodicInspectionReducer}