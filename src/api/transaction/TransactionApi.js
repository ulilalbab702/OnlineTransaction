import BaseApi from "api/base";
import apiConfigTc from 'config/apiTc.config';

export default class TransactionApi extends BaseApi {
    static newInstance = token => {
        if (!this.api) this.api = new TransactionApi(apiConfigTc(token));
        return this.api;
    }

    postTransaction = (body) => {
        return this.axios.post(`api/v1/transaction/order`, body)
    }
    getTransactionOrder = (params) => {
        return this.axios.get(`api/v1/transaction/order?PageSize=5`, { params })
    }
    transactionDetails = (params) => {
        return this.axios.get(`api/v1/transaction/order/${params}`)
    }
    timelineGet = (params) => {
        return this.axios.get(`api/v1/transaction/timelineTransaction/${params}`)
    }
    getListCancel = () => {
        return this.axios.get(`api/v1/cancelreason?PageSize=100`)
    }
    patchCancelReason = (body) => {
        return this.axios.patch(`api/v1/transaction/cancel`, body)
    }
    getDownloadInvoice = (orderNo) => {
        return this.axios.get(`api/v1/transaction/download-invoice?order_no=${orderNo}`, { responseType: 'blob' })
    }
    getDownloadFakturPajak = (orderNo) => {
        return this.axios.get(`api/v1/transaction/download-fp?order_no=${orderNo}`, { responseType: 'blob' })
    }
    patchOrderReceived = (body) => {
        return this.axios.patch(`api/v1/transaction/complete`, body)
    }
}