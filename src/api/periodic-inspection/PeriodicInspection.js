import BaseApi from 'api/base';
import apiConfig from 'config/api.config';

export default class PeriodicInspectionApi extends BaseApi {
    static newInstance = token => {
        if(!this.api) this.api = new PeriodicInspectionApi(apiConfig(token));
        return this.api;
    }
    formUnitModel = (unitModel) => {
        return this.axios.get(`/dca/v1/periodicinspection/formquestions/${unitModel}`)
    }
    checksheetMasterValidation = (unitModel) => {
        return this.axios.post(`/dca/v1/periodicinspection/checksheetmastervalidation`,unitModel)
    }
    getCheckSheetValue = (WoId) => {
        return this.axios.post(`/dca/v1/periodicinspection/getchecksheetvalue`,{WoId})
    }
    formApprove = (WoId) => {
        return this.axios.post(`/dca/v1/periodicinspection/approve`,{WoId})
    }
    formSubmitCheckSheetValue = (data) => {
        return this.axios.post(`/dca/v1/periodicinspection/submitchecksheetvalue`,data)
    }
    downloadReportPI = (periodicReport) => {
        return this.axios.post(`/dca/v1/periodicinspection/downloadreport`,periodicReport,{responseType: 'blob'})
    }
}