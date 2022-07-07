import {
    SUCCESS_TYPE,
    SUMMARY_BACKLOG,
    LIST_BACKLOG,
    DETAIL_BACKLOG,
    MASTER_DATA_BACKLOG,
    GET_SPECIFIC_OBJECT_CHOICES,
    VALIDATE_SPARE_PART,
    SEARCH_SPARE_PART,
    BMS_ACHIEVEMENT,
    BMS_ACHIEVEMENT_BY_WORK_CENTER,
    BMS_ACHIEVEMENT_BY_UNIT_MODEL,
    BMS_ACHIEVEMENT_BY_UNIT_CODE,
    BMS_ACHIEVEMENT_DETAIL,
    BMS_WEB_SUBMIT,
    SUBMIT_BACKLOG,
    DOWNLOAD_REPORT_BACKLOG,
    APPROVE_BES,
    APPROVE_BMS,
    REJECT_BES,
    RESET_INITIAL_STATE,
} from 'actions/actionTypes';
import { combineReducers } from 'redux';
const initialStateBacklog = {
    data:{}
}
export const summaryBacklog = (state = {...initialStateBacklog},action) => {
    const {payload,type} = action
    switch (type) {
        case `${SUMMARY_BACKLOG}${SUCCESS_TYPE}`:
            return {...state,...payload}
    
        default:
            return state;
    }
}
const initialStateListBacklog = {
    data:{}
}
export const listBacklog = (state = {...initialStateListBacklog},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${LIST_BACKLOG}${SUCCESS_TYPE}`:
            return {...state,...payload}
        default:
            return state;
    }
}
const initialStateDetailBacklog = {
    data:{}
}
export const detailBacklog = (state = {...initialStateDetailBacklog},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${DETAIL_BACKLOG}${SUCCESS_TYPE}`:
            return {...state, ...payload}
        default:
            return state;
    }
}
const initialStateGetChoices = {
    data:{}
}
export const getChoices = (state = {...initialStateGetChoices},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${MASTER_DATA_BACKLOG}${SUCCESS_TYPE}`:
            return {...state,...payload};
    
        default:
            return state;
    }
}
const initialSpecificObject = {
    data:[]
}
export const getSpecificObjectChoices = (state = {...initialSpecificObject},action) => {
    const {payload,type}= action;
    switch (type) {
        case `${GET_SPECIFIC_OBJECT_CHOICES}${SUCCESS_TYPE}`:
            return {...state,...payload}
        default:
            return state;
    }
}
const initialSparePartValidation = {
    response:'',
    data:[]
}
export const sparePartValidation = (state = {...initialSparePartValidation},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${VALIDATE_SPARE_PART}${SUCCESS_TYPE}`:
            return {...state,...payload}
        default:
            return state;
    }
}
const initialStateSparePart = {
    data:[]
}
export const sparePartSearch = (state = {initialStateSparePart},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${SEARCH_SPARE_PART}${SUCCESS_TYPE}`:
            return {...state,...payload}
        default:
            return state;
    }
}
const initialStateAchievement = {
    data:[]
}
export const bmsAchievement = (state = {...initialStateAchievement},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${BMS_ACHIEVEMENT}${SUCCESS_TYPE}`:
            return {...state,...payload}
    
        default:
            return state;
    }
}
const initialStateWorkCenter = {
    data:[]
}
export const bmsAchievementUnitModel = (state = {...initialStateWorkCenter},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${BMS_ACHIEVEMENT_BY_WORK_CENTER}${SUCCESS_TYPE}`:
            return {...state,...payload}
    
        default:
            return state;
    }
}
const initialStateUnitCode = {
    data:{}
}
export const bmsAchievementUnitCode = (state = {...initialStateUnitCode},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${BMS_ACHIEVEMENT_BY_UNIT_MODEL}${SUCCESS_TYPE}`:
            return {...state,...payload}
        default:
            return state;
    }
}
const initialStateBmsList = {
    data:{}
}
export const bmsAchievementList = (state = {...initialStateBmsList},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${BMS_ACHIEVEMENT_BY_UNIT_CODE}${SUCCESS_TYPE}`:
            payload.data.PrioritiesFilter.unshift('All Priority')
            payload.data.StatusFilter.unshift('All Status')
            payload.data.ResponsibilitiesFilter.unshift('All Responsibility')
            return {...state,...payload}
        default:
            return state;
    }
}
const initialStateBmsDetail = {
    data:{}
}
export const bmsAchievementDetail = (state = {...initialStateBmsDetail},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${BMS_ACHIEVEMENT_DETAIL}${SUCCESS_TYPE}`:
            return {...state,...payload}
        default:
            return state;
    }
}
const initialStateWebSubmit = {
    response:{}
}
export const webSubmitBacklog = (state = {...initialStateWebSubmit},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${BMS_WEB_SUBMIT}${SUCCESS_TYPE}`:
            return {...state,...payload};
        case `${RESET_INITIAL_STATE}`:
            return initialStateWebSubmit
        default:
            return state;
    }
}
const initialStateSubmitBms = {
    response:{}
}
export const submitBacklog = (state = {...initialStateSubmitBms},action) => {
    const {payload,type} = action;
    switch(type){
        case `${SUBMIT_BACKLOG}${SUCCESS_TYPE}}`:
            return {...state,...payload};
        case `${RESET_INITIAL_STATE}`:
            return initialStateSubmitBms
        default:
            return state;
    }
}
const initialStateDownload = {
    data:{}
}
export const downloadReportBacklog = (state = {...initialStateDownload},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${DOWNLOAD_REPORT_BACKLOG}${SUCCESS_TYPE}`:
            return {...state,...payload}
        case `${RESET_INITIAL_STATE}`:
            return initialStateDownload
        default:
            return state;
    }
}
const initialStateApprove = {
    response:{}
}
export const besApprove = (state = {...initialStateApprove},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${APPROVE_BES}${SUCCESS_TYPE}`:
            return {...state,...payload}
        case `${APPROVE_BMS}${SUCCESS_TYPE}`:
            return {...state,...payload}
        case `${RESET_INITIAL_STATE}`:
            return initialStateApprove
        default:
            return state;
    }
}
export const besReject = (state ={...initialStateApprove},action) => {
    const {payload,type} = action;
    switch (type) {
        case `${REJECT_BES}${SUCCESS_TYPE}`:
            return {...state,...payload}
        case `${RESET_INITIAL_STATE}`:
            return initialStateApprove
        default:
            return state;
    }
}
const backlogReducer = combineReducers({
    summaryBacklog:summaryBacklog,
    listBacklog:listBacklog,
    detailBacklog:detailBacklog,
    masterDataBacklog:getChoices,
    masterSpecificObjectPart:getSpecificObjectChoices,
    sparePartValidation:sparePartValidation,
    dataSparePart:sparePartSearch,
    bmsAchievement:bmsAchievement,
    bmsAchievementUnitModel:bmsAchievementUnitModel,
    bmsAchievementUnitCode:bmsAchievementUnitCode,
    bmsAchievementList:bmsAchievementList,
    bmsAchievementDetail:bmsAchievementDetail,
    submitBacklog:submitBacklog,
    webSubmitBacklog:webSubmitBacklog,
    downloadReportBacklog:downloadReportBacklog,
    besApprove:besApprove,
    besReject:besReject
})
export {backlogReducer}