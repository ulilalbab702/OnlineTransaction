import {WorkOrderApi} from 'api';
import {
    REQUEST_TYPE,
    FETCH_LIST_JOBS_ASSIGNMENT,
    FETCH_EQUIPMENT_VALUE_GET,
    EQUIPMENT_VALUE_SUBMIT,
    SUCCESS_TYPE,
    FAILURE_TYPE,
    FETCH_JOB_DETAIL,
    SELECTED_JOB,
    UNHANDOVER_JOB,
    HANDOVER_JOB,
    FETCH_JOB_REPORT
} from 'actions/actionTypes'
import { setStorage } from 'utils/storage.helper';
import { JOB_STORAGE } from 'constants/storage';

const api = token => WorkOrderApi.newInstance(token);

export const listJobAssignment = (parameter,token) => async dispatch =>  {
    dispatch({type:`${FETCH_LIST_JOBS_ASSIGNMENT}${REQUEST_TYPE}`})
    try {
        const res = await api(token).listOfJobAssignment({parameter});
    dispatch({
        type:`${FETCH_LIST_JOBS_ASSIGNMENT}${SUCCESS_TYPE}`,
        payload:{data:res.data}
    });
    } catch (error) {
        dispatch({type:`${FETCH_LIST_JOBS_ASSIGNMENT}${FAILURE_TYPE}`})
    }
}
export const jobDetail = (woId,token) => async dispatch => {
    dispatch({type:`${FETCH_JOB_DETAIL}${REQUEST_TYPE}`})
    try {
        const res = await api(token).jobDetail(woId);
        dispatch({
            type:`${FETCH_JOB_DETAIL}${SUCCESS_TYPE}`,
            payload:{detail:res.data}
        });
    } catch (error) {
        dispatch({
            type:`${FETCH_JOB_DETAIL}${FAILURE_TYPE}`
        });
    }
}
export const equipmentValueGet = (WoId,token) => async dispatch => {
    
    dispatch({
        type:`${FETCH_EQUIPMENT_VALUE_GET}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).equipmentValueGet(WoId);
        dispatch({
            type:`${FETCH_EQUIPMENT_VALUE_GET}${SUCCESS_TYPE}`,
            payload:{jobTime:res.data}
        })
    } catch (error) {
        dispatch({
            type:`${FETCH_EQUIPMENT_VALUE_GET}${FAILURE_TYPE}`
        })
    }
}
export const equipmentValueSubmit = (parameterEquipment,token) => async dispatch => {
    dispatch({
        type:`${EQUIPMENT_VALUE_SUBMIT}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).equipmentValueSubmit(parameterEquipment);
        dispatch({
            type:`${EQUIPMENT_VALUE_SUBMIT}${SUCCESS_TYPE}`,
            payload:{data:res}
        })
    } catch (error) {
        dispatch({
            type:`${EQUIPMENT_VALUE_SUBMIT}${FAILURE_TYPE}`
        })
    }
}
export const selectedJob = (data) => async dispatch => {
    dispatch({
        type:`${SELECTED_JOB}${REQUEST_TYPE}`
    })
    try {
        setStorage(JOB_STORAGE,data);
        dispatch({
            type:`${SELECTED_JOB}${SUCCESS_TYPE}`,
            payload:{data:data}

        })
    } catch (error) {
        dispatch({
            type:`${SELECTED_JOB}${FAILURE_TYPE}`
        })
    }
}
export const unHandoverPi = (woId,token) => async dispatch => {
    dispatch({
        type:`${UNHANDOVER_JOB}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).unHandoverPi(woId)
        dispatch({
            type:`${UNHANDOVER_JOB}${SUCCESS_TYPE}`,
            payload:{status:res.status}
        })
    } catch (error) {
        dispatch({
            type:`${UNHANDOVER_JOB}${FAILURE_TYPE}`
        })
        
    }
}
export const handoverTrigger = (woId,token) => async dispatch => {
    dispatch({
        type:`${HANDOVER_JOB}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).handoverTrigger(woId)
        dispatch({
            type:`${HANDOVER_JOB}${SUCCESS_TYPE}`,
            payload:{data:res}
        })
    } catch (error) {
        dispatch({
            type:`${HANDOVER_JOB}${FAILURE_TYPE}`
        })
    }
}
export const listOfJobReport = (parameterReport,token) => async dispatch => {
    dispatch({
        type:`${FETCH_JOB_REPORT}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).listOfJobReport(parameterReport)
        dispatch({
            type:`${FETCH_JOB_REPORT}${SUCCESS_TYPE}`,
            payload:{data:res.data}
        })
    } catch (error) {
        dispatch({
            type:`${FETCH_JOB_REPORT}${FAILURE_TYPE}`
        })
    }
}