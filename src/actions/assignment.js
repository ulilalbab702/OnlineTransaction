import {AssignmentApi} from 'api'
import {
    REQUEST_TYPE,
    FETCH_LIST_MECHANIC,
    ASSIGN_JOB,
    UNASSIGN_JOB,
    SUCCESS_TYPE,
    FAILURE_TYPE,
    SUMMARY
} from 'actions/actionTypes'

const api = token => AssignmentApi.newInstance(token);
export const listOfMechanic = (token) => async dispatch => {
    dispatch({
        type:`${FETCH_LIST_MECHANIC}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).listMechanic(token);
        dispatch({
            type:`${FETCH_LIST_MECHANIC}${SUCCESS_TYPE}`,
            payload:{data:res.data}
        });
    } catch (error) {
        dispatch({
            type:`${FETCH_LIST_MECHANIC}${FAILURE_TYPE}`
        })
    } 
}
export const assignJob = (parameter,token) => async dispatch => {
    dispatch({
        type:`${ASSIGN_JOB}${REQUEST_TYPE}`
    });
    try {
        const res = await api(token).assignJob(parameter)
        dispatch({
            type:`${ASSIGN_JOB}${SUCCESS_TYPE}`,
            payload:{response:res.data}
        }); 
    } catch (error) {
        dispatch({
            type:`${ASSIGN_JOB}${FAILURE_TYPE}`
        });
    }
}

export const unassignJob = (workOrderId,token) => async dispatch => {
    dispatch({
        type:`${UNASSIGN_JOB}${REQUEST_TYPE}`
    });
    try {
        const res = await api(token).unassignJob(workOrderId)
        dispatch({
            type:`${UNASSIGN_JOB}${SUCCESS_TYPE}`,
            payload:{data:res}
        }); 
    } catch (error) {
        dispatch({
            type:`${UNASSIGN_JOB}${FAILURE_TYPE}`
        });
    }
}
export const assignmentSummary = (woId,token) => async dispatch =>{
    dispatch({
        type:`${SUMMARY}${REQUEST_TYPE}`
    })
    try {
        const res = await api(token).assignmentSummary(woId)
        dispatch({
            type:`${SUMMARY}${SUCCESS_TYPE}`,
            payload:{value:res.data}
        })  
    } catch (error) {
        dispatch({
            type:`${SUMMARY}${FAILURE_TYPE}`
        })
    }
}