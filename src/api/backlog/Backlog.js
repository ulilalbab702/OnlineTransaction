import BaseApi from "api/base";
import apiConfig from 'config/api.config';

export default class BacklogApi extends BaseApi {
    static newInstance = token => {
        if(!this.api) this.api = new BacklogApi(apiConfig(token));
        return this.api;
    }
    summaryBacklog = (backlogParameter) => {
        return this.axios.post(`/dca/v1/backlog/bes/summary`,backlogParameter)
    }
    listBacklog = (backlogParameter) => {
        return this.axios.post(`/dca/v1/backlog/bes/list`,backlogParameter)
    }
    getChoicesBacklog = () => {
        return this.axios.get(`/dca/v1/backlog/bes/getchoices`)
    }
    detailBacklog = (Id) => {
        return this.axios.post(`/dca/v1/backlog/bes/detail`,{Id})
    }
    getSpecificObjectChoices = (ObjectPartCode) => {
        return this.axios.post(`/dca/v1/backlog/bes/getspecificobjectchoices`,{ObjectPartCode})
    }
    sparePartValidation = (sparePart) => {
        return this.axios.post(`/dca/v1/backlog/bes/sparepartvalidation`,sparePart)
    }
    searchSparePart = (sparePart) => {
        return this.axios.get(`/dca/v1/backlog/bes/sparepart/${sparePart}`)
    }
    besApprove = (Id) => {
        return this.axios.post(`/dca/v1/backlog/bes/approve`,{Id})
    }
    besReject = (Id) => {
        return this.axios.post(`/dca/v1/backlog/bes/reject`,{Id})
    }
    submitBacklog = (backlogParams) => {
        return this.axios.post(`/dca/v1/backlog/bes/submit`,{BacklogDatas:[backlogParams]})
    }
    approveBms = (Id) => {
        return this.axios.post(`/dca/v1/backlog/bms/approve`,{Id})
    }
    bmsAchievement = () => {
        return this.axios.get(`/dca/v1/backlog/bms/achievement`)
    }
    bmsAchievementWorkCenter = (workCenter) => {
        return this.axios.get(`/dca/v1/backlog/bms/achievement/${workCenter}`)
    }
    bmsAchievementByUnitModel = (backlogParams) => {
        return this.axios.post(`/dca/v1/backlog/bms/listbyunitmodel`,backlogParams)
    }
    bmsAchievementUnitCode = (backlogParams) => {
        return this.axios.post(`/dca/v1/backlog/bms/listbyunitmodeldetail`,backlogParams)
    }
    bmsAchievementDetail = (Id) => {
        return this.axios.post(`/dca/v1/backlog/bes/detail`,{Id})
    }
    webSubmitBacklog = (backlogParams) => {
        return this.axios.post(`/dca/v1/backlog/bes/websubmit`,{BacklogData:backlogParams})
    }
    downloadReportBacklog = (backlogReport) => {
        return this.axios.post(`/dca/v1/backlog/downloadreport`,backlogReport,{responseType: 'blob'})
    }
}