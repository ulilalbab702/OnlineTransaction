import BaseApi from "api/base";
import apiConfig from 'config/api.config';

export default class BillingAddressApi extends BaseApi {
    static newInstance = token => {
        if (!this.api) this.api = new BillingAddressApi(apiConfig(token));
        return this.api;
    }
    getListBillingAddres = (userId) => {
        return this.axios.get(`user-management/api/user/billing?userId=${userId}`)
    }

    putListBillingAddres = (billingId, data) => {
        return this.axios.put(`user-management/api/user/billing/${billingId}`, data)
    }

    postBillingAddres = (userId, data) => {
        return this.axios.post(`user-management/api/user/billing?userId=${userId}`, data)
    }

    postListBillingAddres = (data) => {
        return this.axios.post(`user-management/api/user/info`, data)
    }
    putContactInformation = (data) => {
        return this.axios.put(`user-management/api/user/info`, data)
    }
    getInfoBillingAddress = (userId) => {
        return this.axios.get(`user-management/api/userinfo`, userId)
    }
    getSearchDistrict = (city) => {
        return this.axios.get(`v1/forwarder/DistrictSearch?Keyword=${city}`)
    }
    getSearchPostalCode = (postalcode) => {
        return this.axios.get(`v1/forwarder/DistrictSearch/ByPostalCode?PostalCode=${postalcode}`)
    }
}