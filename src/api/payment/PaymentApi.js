import BaseApi from "api/base";
import apiConfigOc from 'config/apiOc.config';

export default class PaymentApi extends BaseApi {
    static newInstance = token => {
        if (!this.api) {
            this.api = new PaymentApi(apiConfigOc(token));
        }
        return new PaymentApi(apiConfigOc(token));
    }
    getPayment = (params) => {
        return this.axios.get(`/api/v1/bank/account`, { params })
    }
    paymentDetails = (params) => {
        return this.axios.get(`/api/v1/bank/account/${params}`)
    }

    getPaymentMethod = () => {
        return this.axios.get(`/api/v1/catalog/paymentmethod`)
    }

    getShipmentMethode = (body) => {
        return this.axios.post(`api/v1/catalog/forwarder/shippingcost`, body )
    }
}