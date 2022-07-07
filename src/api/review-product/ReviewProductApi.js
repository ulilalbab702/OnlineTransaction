import BaseApi from "api/base";
import apiConfigOc from 'config/apiOc.config';

export default class ReviewProductApi extends BaseApi {
    static newInstance = token => {
        if (!this.api) this.api = new ReviewProductApi(apiConfigOc(token));
        return this.api;
    }
    postReviewProduct = (body) => {
        return this.axios.post(`api/v1/catalog/review`, body)
    }
}