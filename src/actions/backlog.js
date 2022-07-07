import {BacklogApi} from 'api'
import {
    REQUEST_TYPE,
    SUMMARY_BACKLOG,
    LIST_BACKLOG,
    DETAIL_BACKLOG,
    MASTER_DATA_BACKLOG,
    GET_SPECIFIC_OBJECT_CHOICES,
    VALIDATE_SPARE_PART,
    SEARCH_SPARE_PART,
    SUCCESS_TYPE,
    FAILURE_TYPE,
    APPROVE_BES,
    REJECT_BES,
    SUBMIT_BACKLOG,
    APPROVE_BMS,
    BMS_ACHIEVEMENT,
    BMS_ACHIEVEMENT_BY_WORK_CENTER,
    BMS_ACHIEVEMENT_BY_UNIT_MODEL,
    BMS_ACHIEVEMENT_BY_UNIT_CODE,
    BMS_ACHIEVEMENT_DETAIL,
    BMS_WEB_SUBMIT,
    DOWNLOAD_REPORT_BACKLOG,
    RESET_INITIAL_STATE
} from 'actions/actionTypes'

const api = token => BacklogApi.newInstance(token);

export const summaryBacklog = (backlogParameter,token) => async dispatch => {
    dispatch({
        type:`${SUMMARY_BACKLOG}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).summaryBacklog(backlogParameter)
        dispatch({
            type:`${SUMMARY_BACKLOG}${SUCCESS_TYPE}`,
            payload:{data:res.data}
        })
    } catch (error) {
        dispatch({
            type:`${SUMMARY_BACKLOG}${FAILURE_TYPE}`
        })
    }
}
export const listBacklog = (backlogParameter,token) => async dispatch => {
    dispatch({
        type:`${LIST_BACKLOG}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).listBacklog(backlogParameter)
        dispatch({
            type:`${LIST_BACKLOG}${SUCCESS_TYPE}`,
            payload:{data:res.data}
        })
    } catch (error) {
        dispatch({
            type:`${LIST_BACKLOG},${FAILURE_TYPE}`
        })   
    }
}
export const detailBacklog = (workOrderId,token) => async dispatch => {
    dispatch({
        type:`${DETAIL_BACKLOG}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).detailBacklog(workOrderId)
        dispatch({
            type:`${DETAIL_BACKLOG}${SUCCESS_TYPE}`,
            payload:{data:res.data}
        })
    } catch (error) {
        dispatch({
            type:`${DETAIL_BACKLOG}${FAILURE_TYPE}`
        })
    }
}
export const getChoices = (token) => async dispatch => {
    dispatch({
        type:`${MASTER_DATA_BACKLOG}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).getChoicesBacklog()
        dispatch({
            type:`${MASTER_DATA_BACKLOG}${SUCCESS_TYPE}`,
            payload:{data:res.data}
        })
    } catch (error) {
        dispatch({
            type:`${MASTER_DATA_BACKLOG}${FAILURE_TYPE}`
        })
        
    }
}
export const getSpecificObjectChoices = (backlogParameter,token) => async dispatch => {
    dispatch({
        type:`${GET_SPECIFIC_OBJECT_CHOICES}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).getSpecificObjectChoices(backlogParameter)
        dispatch({
            type:`${GET_SPECIFIC_OBJECT_CHOICES}${SUCCESS_TYPE}`,
            payload:{data:res.data}
        })
    } catch (error) {
        dispatch({
            type:`${GET_SPECIFIC_OBJECT_CHOICES}${FAILURE_TYPE}`
        })
    }
}
export const sparePartValidation = (sparePart,token) => async dispatch => {
    dispatch({
        type:`${VALIDATE_SPARE_PART}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).sparePartValidation({PartNumbers:sparePart})
        dispatch({
            type:`${VALIDATE_SPARE_PART}${SUCCESS_TYPE}`,
            payload:{
                data:res.data,
                response:res.status
            }
        })
    } catch (error) {
        dispatch({
            type:`${VALIDATE_SPARE_PART}${FAILURE_TYPE}`
        })
    }
}
export const searchSparePart = (sparePart,token) => async dispatch => {
    dispatch({
        type:`${SEARCH_SPARE_PART}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).searchSparePart(sparePart)
        dispatch({
            type:`${SEARCH_SPARE_PART}${SUCCESS_TYPE}`,
            payload:{data:res.data}
        })
    } catch (error) {
        dispatch({
            type:`${SEARCH_SPARE_PART}${FAILURE_TYPE}`
        })
    }
}
export const besApprove = (backlogId,token) => async dispatch => {
    dispatch({
        type:`${APPROVE_BES}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).besApprove(backlogId)
        dispatch({
            type:`${APPROVE_BES}${SUCCESS_TYPE}`,
            payload:{response:res.data}
        })
    } catch (error) {
        dispatch({
            type:`${APPROVE_BES}${FAILURE_TYPE}`
        }) 
    }
}
export const besReject = (backlogId,token) => async dispatch => {
    dispatch({
        type:`${REJECT_BES}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).besReject(backlogId)
        dispatch({
            type:`${REJECT_BES}${SUCCESS_TYPE}`,
            payload:{response:res}
        })
    } catch (error) {
        dispatch({
            type:`${REJECT_BES}${FAILURE_TYPE}`
        }) 
    }
}
export const submitBacklog = (backlogParams,token) => async dispatch => {
    dispatch({
        type:`${SUBMIT_BACKLOG}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).submitBacklog(backlogParams)
        dispatch({
            type:`${SUBMIT_BACKLOG}${SUCCESS_TYPE}`,
            payload:{response:res}
        })
    } catch (error) {
        dispatch({
            type:`${SUBMIT_BACKLOG}${FAILURE_TYPE}`
        })
    }
}
export const approveBms = (backlogId,token) => async dispatch => {
    dispatch({
        type:`${APPROVE_BMS}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).approveBms(backlogId)
        dispatch({
            type:`${APPROVE_BMS}${SUCCESS_TYPE}`,
            payload:{response:res}
        })
    } catch (error) {
        dispatch({
            type:`${APPROVE_BMS}${FAILURE_TYPE}`
        })
    }
}
export const bmsAchievement = (token) => async dispatch => {
    dispatch({
        type:`${BMS_ACHIEVEMENT}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).bmsAchievement()
        dispatch({
            type:`${BMS_ACHIEVEMENT}${SUCCESS_TYPE}`,
            payload:{data:res.data}
        })
    } catch (error) {
        dispatch({
            type:`${BMS_ACHIEVEMENT}${FAILURE_TYPE}`
        })
    }
}
export const bmsAchievementWorkCenter = (workCenter,token) => async dispatch => {
    dispatch({
        type:`${BMS_ACHIEVEMENT_BY_WORK_CENTER}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).bmsAchievementWorkCenter(workCenter)
        dispatch({
            type:`${BMS_ACHIEVEMENT_BY_WORK_CENTER}${SUCCESS_TYPE}`,
            payload:{data:res.data}
        })
    } catch (error) {
        dispatch({
            type:`${BMS_ACHIEVEMENT_BY_WORK_CENTER}${FAILURE_TYPE}`
        })
    }
}
export const bmsAchievementUnitModel = (backlogParams,token) => async dispatch => {
    dispatch({
        type:`${BMS_ACHIEVEMENT_BY_UNIT_MODEL}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).bmsAchievementByUnitModel(backlogParams)
        dispatch({
            type:`${BMS_ACHIEVEMENT_BY_UNIT_MODEL}${SUCCESS_TYPE}`,
            payload:{data:res.data}
        })
    } catch (error) {
        dispatch({
            type:`${BMS_ACHIEVEMENT_BY_UNIT_MODEL}${FAILURE_TYPE}`
        })
    }
}
export const bmsAchievementUnitCode = (backlogParams,token) => async dispatch => {
    dispatch({
        type:`${BMS_ACHIEVEMENT_BY_UNIT_CODE}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).bmsAchievementUnitCode(backlogParams)
        dispatch({
            type:`${BMS_ACHIEVEMENT_BY_UNIT_CODE}${SUCCESS_TYPE}`,
            payload:{data:res.data}
        })
    } catch (error) {
        dispatch({
            type:`${BMS_ACHIEVEMENT_BY_UNIT_CODE}${FAILURE_TYPE}`
        })
        
    }
}
export const bmsAchievementDetail = (backlogId,token) => async dispatch => {
    dispatch({
        type:`${BMS_ACHIEVEMENT_DETAIL}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).bmsAchievementDetail(backlogId)
        dispatch({
            type:`${BMS_ACHIEVEMENT_DETAIL}${SUCCESS_TYPE}`,
            payload:{data:res.data}
        })
    } catch (error) {
        dispatch({
            type:`${BMS_ACHIEVEMENT_DETAIL}${FAILURE_TYPE}`
        })
    }
}
export const webSubmitBacklog = (backlogParams,token) => async dispatch => {
    dispatch({
        type:`${BMS_WEB_SUBMIT}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).webSubmitBacklog(backlogParams)
        dispatch({
            type:`${BMS_WEB_SUBMIT}${SUCCESS_TYPE}`,
            payload:{response:res}
        })
    } catch (error) {
        dispatch({
            type:`${BMS_WEB_SUBMIT}${FAILURE_TYPE}`
        })
    }
}
export const downloadReportBacklog = (backlogReport,token) => async dispatch => {    
    
    dispatch({
        type:`${DOWNLOAD_REPORT_BACKLOG}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).downloadReportBacklog(backlogReport)
        dispatch({
            type:`${DOWNLOAD_REPORT_BACKLOG}${SUCCESS_TYPE}`,
            payload:{data:res}
        })
    } catch (error) {
        dispatch({
            type:`${DOWNLOAD_REPORT_BACKLOG}${FAILURE_TYPE}`,
        })
    }
}
export const clearState = () => dispatch =>  {
    dispatch({
        type:`${RESET_INITIAL_STATE}`
    })
}