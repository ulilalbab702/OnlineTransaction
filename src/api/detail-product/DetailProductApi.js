import BaseApi from "api/base";
import apiConfigOc from 'config/apiOc.config';
import axios from 'axios';

export default class DetailProductApi extends BaseApi {
  static newInstance = token => {
    if (!this.api) {
      this.api = new DetailProductApi(apiConfigOc(token));
    }
    return new DetailProductApi(apiConfigOc(token));
  }
  getDetailProduct = (id) => {
    return this.axios.get(`api/v1/catalog/product/${id}`)
  }
  getDetailList = (id, Keyword, Brand, Type, PlantCode, Filters, Sorts, PageNumber, PageSize) => {
    return this.axios.get(`api/v1/catalog/product?Id=${id}&Keyword=${Keyword}&Brand=${Brand}&Type=${Type}&PlantCode=${PlantCode}&Filters=${Filters}&Sorts=${Sorts}&PageNumber=${PageNumber}&PageSize=${PageSize}`)
  }
  getReviewProduct = (productId) => {
    return this.axios.get(`api/v1/catalog/review/${productId}`)
  }

}