import BaseApi from 'api/base';
import apiConfig from 'config/api.config';

export default class ProblemLogApi extends BaseApi {
    static newInstance = token => {
        if(!this.api) this.api = new ProblemLogApi(apiConfig(token));
        return this.api;
    }
    masterDataProblemLog = () => {
        return this.axios.get(`/dca/v1/problemlog/masterdata`)
    }
    countBySpv = (WoId) => {
        return this.axios.post(`/dca/v1/problemlog/countbyspv`,{WoId})
    }
    listBySpv = (params) => {
        return this.axios.post(`/dca/v1/problemlog/listbyspv`,params)
    }
    problemLogGet = (Id) => {
        return this.axios.post(`/dca/v1/problemlog/get`,{Id})
    }
    submitProblemLog = (Id) => {
        return this.axios.put(`/dca/v1/problemlog/approve`,{Id})
    }
    rejectProblemLog = (Id) => {
        return this.axios.put(`/dca/v1/problemlog/reject`,{Id})
    }
    listWorkCenterPercentage = () => {
        return this.axios.post(`dca/v1/problemlog/listworkcenterpercentage`)
    }
    listAchievementPercentage = (WorkCenterCode) => {
        return this.axios.post(`dca/v1/problemlog/listachievementpercentage`,{WorkCenterCode})
    }
    listMonitor = (parameter) => {
        return this.axios.post(`dca/v1/problemlog/listmonitor`,parameter)
    }
    closeProblemLog = (data) => {
        return this.axios.put(`dca/v1/problemlog/close`,data)
    }
    updateProblemLog = (data) => {
        return this.axios.put(`dca/v1/problemlog/update`,data)
    }
    downloadReportProblemLog = (problemLogReport) => {
        return this.axios.post(`dca/v1/problemlog/report`,problemLogReport,{responseType: 'blob'})
    }
    handoverProblemLog = (WoId) => {
        return this.axios.post(`dca/v1/problemlog/handover`,{WoId})
    }
}