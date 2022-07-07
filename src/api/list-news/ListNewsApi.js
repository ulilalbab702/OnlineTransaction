import BaseApi from "api/base";
import apiConfig from 'config/api.config';

export default class ListNewsApi extends BaseApi {
    static newInstance = token => {
        if (!this.api) this.api = new ListNewsApi(apiConfig(token));
        return this.api;
    }
    listNewsGet = (attributValue, PageSize, PageNumber) => {
        return this.axios.get(`/promotion/api/News?AttributeValue=${attributValue}&PageSize=${PageSize}&PageNumber=${PageNumber}`)
    }
    newsImageSliderGet = (AttributeValue) => {
        return this.axios.get(`/promotion/api/News?AttributeValue=${AttributeValue}`)
    }
    newsProfileNewsGet = (AttributeValue) => {
        return this.axios.get(`/promotion/api/News?AttributeValue=${AttributeValue}`)
    }
    newsMainNewsGet = (AttributeValue) => {
        return this.axios.get(`/promotion/api/News?AttributeValue=${AttributeValue}`)
    }
}