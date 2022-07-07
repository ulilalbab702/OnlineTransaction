import BaseApi from '../base/';
import apiConfig from 'config/api.config';

export default class TrackingApi extends BaseApi {
    static newInstance = () => {
        if (!this.trackingApi) this.trackingApi = new TrackingApi(apiConfig());
        return this.trackingApi;
    };
    stagingInfo = (WoId) => {
        return this.axios.post(`/dca/v1/tracking/staginginfo`,{WoId})
    }
    fixingassignstaging = (trackingParams) => {
        return this.axios.post(`/dca/v1/tracking/fixingassignstaging`,trackingParams)
    }
}