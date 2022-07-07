import BaseApi from "api/base";
import apiConfig from 'config/api.config';

export default class DetailNewsApi extends BaseApi {
    static newInstance = token => {
        if (!this.api) this.api = new DetailNewsApi(apiConfig(token));
        return this.api;
    }
    detailNewsGet = (newsId) => {
        return this.axios.get(`/promotion/api/News/${newsId}`)
    }
    detailNewsAllGet = (PageNumber, Keyword, Title) => {
        return this.axios.get(`/promotion/api/News?pageSize=${3}&PageNumber=${PageNumber}&Keyword=${Keyword}&Title=${Title}`)
    }
}