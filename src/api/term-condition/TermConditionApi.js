import BaseApi from "api/base";
import apiConfig from 'config/api.config';

export default class TermConditionApi extends BaseApi {
    static newInstance = token => {
        if (!this.api) this.api = new TermConditionApi(apiConfig(token));
        return this.api;
    }
    getTermCondition = () => {
        return this.axios.get(`user-management/api/termandcondition`)
    }
    updateTermCondition = (version) => {
        return this.axios.put(`user-management/api/user/termandcondition/${version}`)
    }
}