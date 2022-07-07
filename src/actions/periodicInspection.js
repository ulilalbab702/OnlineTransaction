import {PeriodicInspectionApi} from 'api'
import {
    REQUEST_TYPE,
    SUCCESS_TYPE,
    FAILURE_TYPE,
    FETCH_FORM_UNIT_MODEL,
    GET_CHECKSHEET_VALUE,
    APPROVE_PERIODIC_INSPECTION,
    SUBMIT_PERIODIC_INSPECTION,
    DOWNLOAD_REPORT_PI,
    CHECKSHEET_VALIDATION,
    RESET_INITIAL_STATE
} from 'actions/actionTypes'

const api = token => PeriodicInspectionApi.newInstance(token);
export const formUnitModel = (unitModel,token) => async dispatch => {
    dispatch({
        type:`${FETCH_FORM_UNIT_MODEL}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).formUnitModel(unitModel)
        dispatch({
            type:`${FETCH_FORM_UNIT_MODEL}${SUCCESS_TYPE}`,
            payload:{data:res.data}
        })
    } catch (error) {
        dispatch({
            type:`${FETCH_FORM_UNIT_MODEL}${FAILURE_TYPE}`
        })
    }
}

export const getCheckSheetValue = (woId,token) => async dispatch => {
    dispatch({
        type:`${GET_CHECKSHEET_VALUE}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).getCheckSheetValue(woId)
        dispatch({
            type:`${GET_CHECKSHEET_VALUE}${SUCCESS_TYPE}`,
            payload:{data:res.data}
        })
    } catch (error) {
        dispatch({
            type:`${GET_CHECKSHEET_VALUE}${FAILURE_TYPE}`
        })
    }
}

export const formApprove = (workOrderId,token) => async dispatch => {
    dispatch({
        type:`${APPROVE_PERIODIC_INSPECTION}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).formApprove(workOrderId)
        dispatch({
            type:`${APPROVE_PERIODIC_INSPECTION}${SUCCESS_TYPE}`,
            payload:{response:res}
        })
    } catch (error) {
        dispatch({
            type:`${APPROVE_PERIODIC_INSPECTION}${FAILURE_TYPE}`
        })
    }
}

export const formSubmit = (data,token) => async dispatch => {
    dispatch({
        type:`${SUBMIT_PERIODIC_INSPECTION}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).formSubmitCheckSheetValue(data)
        dispatch({
            type:`${SUBMIT_PERIODIC_INSPECTION}${SUCCESS_TYPE}`,
            payload:{status:res.status}
        })
    } catch (error) {
        dispatch({
            type:`${SUBMIT_PERIODIC_INSPECTION}${FAILURE_TYPE}`
        })
        
    }
}
export const downloadReportPI = (piReport,token) => async dispatch => {
    dispatch({
        type:`${DOWNLOAD_REPORT_PI}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).downloadReportPI(piReport)
        dispatch({
            type:`${DOWNLOAD_REPORT_PI}${SUCCESS_TYPE}`,
            payload:{data:res}
        })
    } catch (error) {
        dispatch({
            type:`${DOWNLOAD_REPORT_PI}${FAILURE_TYPE}`
        })
    }
}
export const checksheetMasterValidation = (unitModel,token) => async dispatch => {
    dispatch({
        type:`${CHECKSHEET_VALIDATION}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).checksheetMasterValidation(unitModel)
        dispatch({
            type:`${CHECKSHEET_VALIDATION}${SUCCESS_TYPE}`,
            payload:{data:res.data}
        })
    } catch (error) {
        dispatch({
            type:`${CHECKSHEET_VALIDATION}${FAILURE_TYPE}`
        })
        
    }
}

export const clearDownloadStore = () => dispatch => {
    dispatch({
        type:`${RESET_INITIAL_STATE}`
    })
}