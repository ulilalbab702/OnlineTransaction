import BaseApi from 'api/base';
import apiConfig from 'config/api.config';

export default class WorkOrderApi extends BaseApi {
    static newInstance = token => {
        if(!this.api) this.api = new WorkOrderApi(apiConfig(token));
        return this.api;
    }
    listOfJobAssignment = ({parameter}) => {
        return this.axios.post(`/dca/v1/workorder/listofjobassignment`, parameter)
    }
    jobDetail = (Id) => {
        return this.axios.post(`/dca/v1/workorder/jobdetail`,{Id})
    }
    equipmentValueGet = (WoId) => {
        return this.axios.post(`/dca/v1/workorder/equipmentvalue/get`,{WoId})
    }
    equipmentValueSubmit = (parameterEquipment) => {
        return this.axios.post(`/dca/v1/workorder/equipmentvalue/submit`,{EquipmentIdentity:parameterEquipment})
    }
    unHandoverPi = (Id) => {
        return this.axios.post(`/dca/v1/workorder/unhandover`,{Id,Device:2})
    }
    handoverTrigger = (Id) => {
        return this.axios.post(`/dca/v1/workorder/handover`,{Id,Device:2})
    }
    listOfJobReport = (parameterReport) => {
        return this.axios.post(`/dca/v1/workorder/listofjobreport`,parameterReport)
    }
}