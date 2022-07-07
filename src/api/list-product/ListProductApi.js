import BaseApi from "api/base";
import apiConfigOc from 'config/apiOc.config';
import CONST from 'constants/conditionCode';

export default class ListProductApi extends BaseApi {
    static newInstance = token => {
        if (!this.api) this.api = new ListProductApi(apiConfigOc(token));
        return this.api;
    }
    getListProduct = (params, pageSize) => {
        return this.axios.get(`api/v1/catalog/product?PageSize=${pageSize}`, {params})
    }
}
