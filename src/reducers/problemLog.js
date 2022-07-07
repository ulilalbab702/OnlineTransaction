import {
	// SUCCESS_TYPE,
	// COUNT_BY_SPV,
	// LIST_BY_SPV,
	// GET_DETAIL_PROBLEMLOG,
	// LIST_WORKCENTER_PERCENTAGE,
	// LIST_ACHIEVEMENT_PERCENTAGE,
	// LIST_PROBLEMLOG_MONITORING,
	// CLOSE_PROBLEMLOG_MONITORING,
	// FETCH_MASTER_DATA_PROBLEM_LOG,
	// FAILURE_TYPE,
	// DOWNLOAD_REPORT_PROBLEM_LOG,
	// SUBMIT_PROBLEMLOG,
	// REJECT_PROBLEMLOG,
	// RESET_INITIAL_STATE,
} from "actions/actionTypes";
import { combineReducers } from "redux";

const initialStateCount = {};
export const countBySpv = (state = { ...initialStateCount }, action) => {
	const { payload, type } = action;
	switch (type) {
		case `${COUNT_BY_SPV}${SUCCESS_TYPE}`:
			return { ...state, ...payload };
		default:
			return state;
	}
};

const initialStateList = {
	data: {},
};
export const listBySpv = (state = { ...initialStateList }, action) => {
	const { payload, type } = action;
	switch (type) {
		case `${LIST_BY_SPV}${SUCCESS_TYPE}`:
			return { ...state, ...payload };
		default:
			return state;
	}
};
const initialStateDetail = {
	detail: {},
};
export const problemLogGet = (state = { ...initialStateDetail }, action) => {
	const { payload, type } = action;
	switch (type) {
		case `${GET_DETAIL_PROBLEMLOG}${SUCCESS_TYPE}`:
			return { ...state, ...payload };
		default:
			return state;
	}
};

const initialStateWorkCenter = {
	data: [],
};
export const listWorkCenterPercentage = (
	state = { ...initialStateWorkCenter },
	action
) => {
	const { payload, type } = action;
	switch (type) {
		case `${LIST_WORKCENTER_PERCENTAGE}${SUCCESS_TYPE}`:
			return { ...state, ...payload };
		default:
			return state;
	}
};

const initialStateJobType = {
	data: [],
};
export const listAchievementPercentage = (
	state = { ...initialStateJobType },
	action
) => {
	const { payload, type } = action;
	switch (type) {
		case `${LIST_ACHIEVEMENT_PERCENTAGE}${SUCCESS_TYPE}`:
			return { ...state, ...payload };
		default:
			return state;
	}
};
const initialStateListMonitor = {
	data: {},
};
export const listMonitoring = (
	state = { ...initialStateListMonitor },
	action
) => {
	const { payload, type } = action;
	switch (type) {
		case `${LIST_PROBLEMLOG_MONITORING}${SUCCESS_TYPE}`:
			payload.data.UnitModels.unshift("All Unit Model");
			payload.data.ProbemTypes.unshift("All Problem");
			payload.data.ResponseTypes.unshift("All Responsibilty");
			return { ...state, ...payload };
		default:
			return state;
	}
};
const initialStateStatus = {
	status: "",
};
export const statusProblemLog = (state = { ...initialStateStatus }, action) => {
	const { payload, type } = action;
	switch (type) {
		case `${CLOSE_PROBLEMLOG_MONITORING}${SUCCESS_TYPE}`:
			return { ...state, ...payload };
		default:
			return state;
	}
};

const initialStateMasterData = {
	data: {},
};
export const masterDataProblemLog = (
	state = { ...initialStateMasterData },
	action
) => {
	const { payload, type } = action;
	switch (type) {
		case `${FETCH_MASTER_DATA_PROBLEM_LOG}${SUCCESS_TYPE}`:
			return { ...state, ...payload };
		default:
			return state;
	}
};
const initialStateDownloadReport = {
	data: {},
};
export const downloadReportProblemLog = (
	state = { ...initialStateDownloadReport },
	action
) => {
	const { payload, type } = action;
	switch (type) {
		case `${DOWNLOAD_REPORT_PROBLEM_LOG}${SUCCESS_TYPE}`:
			return { ...state, ...payload };
		case `${DOWNLOAD_REPORT_PROBLEM_LOG}${FAILURE_TYPE}`:
			return { ...state, ...payload };
		default:
			return state;
	}
};
const initialStateApprove = {
	response: {},
};
export const submitProblemLog = (
	state = { ...initialStateApprove },
	action
) => {
	const { payload, type } = action;
	switch (type) {
		case `${SUBMIT_PROBLEMLOG}${SUCCESS_TYPE}`:
			return { ...state, ...payload };
		case `${RESET_INITIAL_STATE}`:
			return initialStateApprove;
		default:
			return state;
	}
};
const initialStateReject = {
	response: {},
};
export const rejectProblemLog = (state = { ...initialStateReject }, action) => {
	const { payload, type } = action;
	switch (type) {
		case `${REJECT_PROBLEMLOG}${SUCCESS_TYPE}`:
			return { ...state, ...payload };
		case `${RESET_INITIAL_STATE}`:
			return initialStateReject;
		default:
			return state;
	}
};
const initialStateCloseProblemLog = {
	response: {},
};
export const closeProblemLog = (
	state = { ...initialStateCloseProblemLog },
	action
) => {
	const { payload, type } = action;
	switch (type) {
		case `${CLOSE_PROBLEMLOG_MONITORING}${SUCCESS_TYPE}`:
			return { ...state, ...payload };
		default:
			return state;
	}
};
const problemLogReducer = combineReducers({
	countBySpv: countBySpv,
	listBySpv: listBySpv,
	detailProblemLog: problemLogGet,
	listWorkCenterPercentage: listWorkCenterPercentage,
	listAchievementPercentage: listAchievementPercentage,
	listMonitoring: listMonitoring,
	submitProblemLog: submitProblemLog,
	rejectProblemLog: rejectProblemLog,
	statusProblemLog: statusProblemLog,
	master: masterDataProblemLog,
	downloadReportProblemLog: downloadReportProblemLog,
	closeProblemLog: closeProblemLog,
});
export { problemLogReducer };
