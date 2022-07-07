import BaseApi from 'api/base';
import apiConfig from 'config/api.config';

export default class AssignmentApi extends BaseApi{
    static newInstance = token => {
        if(!this.api) this.api = new AssignmentApi(apiConfig(token));
        return this.api;
    }
    listMechanic = () => {
        return this.axios.get(`/dca/v1/assignment/listofmechanics`)
    }

    assignJob = (parameter) => {
        return this.axios.post(`/dca/v1/assignment/assignjob`,parameter)
    }
    unassignJob = (WoIds) => {
        return this.axios.post(`/dca/v1/assignment/unassignjob`,{WoIds})
    }
    // note : value is the request paramater to server 
    assignmentSummary = (WoId) => {
        return this.axios.post(`/dca/v1/assignment/summary`,{WoId})
    }
}