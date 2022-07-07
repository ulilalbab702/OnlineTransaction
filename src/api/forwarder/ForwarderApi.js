import BaseApi from "api/base";
import apiConfig from 'config/api.config';

export default class ForwarderApi extends BaseApi {
    static newInstance = token => {
        if (!this.api) this.api = new ForwarderApi(apiConfig(token));
        return this.api;
    }
    getForwarderTimeline = (ExternalNumber) => {
        return this.axios.get(`v1/forwarder/ForwarderServiceAKS/GetSingleTracking?ExternalNumber=${ExternalNumber}`)
    }
}