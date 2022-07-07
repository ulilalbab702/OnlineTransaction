import BaseApi from "api/base";
import apiConfigOc from 'config/apiOc.config';

export default class CartApi extends BaseApi {
    static newInstance = token => {
        if (!this.api) {
            this.api = new CartApi(apiConfigOc(token));
        }
        return new CartApi(apiConfigOc(token));
    }
    getCartList = () => {
        return this.axios.get(`api/v1/catalog/cart`)
    }
    getPurchaseSummary = (cartId) => {
        return this.axios.get(`api/v1/catalog/cart/purchase-summary?cartId=${cartId}`)
    }
    getAttributeName = (name) => {
        return this.axios.get(`api/v1/attribute?Name=${name}&PageSize=100`)
    }
    getSearchByUserId = (userId) => {
        return this.axios.get(`api/v1/catalog/cart/search-by-userid?userId=${userId}`)
    }
    getCartListByCartId = (cartId) => {
        return this.axios.get(`api/v1/catalog/cart/${cartId}`)
    }
    putCartListByCartId = (cartId, data) => {
        return this.axios.put(`api/v1/catalog/cart/${cartId}`, data)
    }
    postCartItem = (body) => {
        return this.axios.post(`api/v1/catalog/cart`, body)
    }
    getCartDetail = (id) => {
        return this.axios.get(`api/v1/catalog/cart/${id}`)
    }
    postCompleteOrder = (body) => {
        return this.axios.post(`api/v1/catalog/integration/complete-order`, body)
    }
    putChangeStatus = (id, status) => {
        return this.axios.put(`api/v1/catalog/cart/change-status?cartId=${id}&StatusOrder=${status}`)
    }
    postUploadattachment = (body) => {
        return this.axios.post(`api/v1/catalog/integration/uploadattachment`, body)
    }
    deleteAllCart = (cartId, body) => {
        return this.axios.delete(`api/v1/catalog/cart/${cartId}`, body)
    }
    deleteCartDetail = (cartId) => {
        return this.axios.delete(`api/v1/catalog/cart/detail/${cartId}`)
    }
    getPurchaseCheckout  = (cartId) => {
        return this.axios.get(`api/v1/catalog/cart/purchase-summary/checkout?cartId=${cartId}`)
    }
    getCheckoutProduct = (cartId) => {
        return this.axios.get(`api/v1/catalog/cart/${cartId}/checkout`)
    }
   
}