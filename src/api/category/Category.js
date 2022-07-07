import BaseApi from "api/base";
import apiConfigOc from 'config/apiOc.config';
import CONST from 'constants/conditionCode';
export default class CategoryApi extends BaseApi {
    static newInstance = token => {
        if (!this.api) {
            this.api = new CategoryApi(apiConfigOc(token));
        }
        return new CategoryApi(apiConfigOc(token));
    }
    listCategoryGet = () => {
        return this.axios.get(`api/v1/catalog/category?PageSize=100`)
    }
    listBranchGet = (IsGetAll, Description) => {
        return this.axios.get(`api/v1/catalog/branch?PageSize=100&IsGetAll=${IsGetAll ? true : false}&Description=${Description ? Description : ""}`)
    }
    checkCustomer = () => {
        return this.axios.get(`api/v1/catalog/customer/code`)
    }
    getSearchSuggestion = (keyword, id) => {
        return this.axios.get(`api/v1/catalog/product/search-suggestion?keyword=${keyword}&size=${CONST.PAGE_SEARCH}&id=${id}`)
    }
    getCheckStock = (body) => {
        return this.axios.post(`api/v1/catalog/product/cekstock`, body)
    }
    getCheckPrice = (body) => {
        return this.axios.post(`api/v1/catalog/product/price`, body)
    }
    checkStatus = (code) => {
        return this.axios.get(`api/v1/catalog/customer/status`)
    }
}