import BaseApi from "api/base";
import apiConfig from "config/api.config";

export default class VoucherApi extends BaseApi {
    static newInstance = token => {
        if(!this.api) this.api = new VoucherApi(apiConfig(token));
        return this.api;
    }
    voucherAllGet = (PageSize) => {
        return this.axios.get(`/promotion/api/Voucher?${PageSize ? `PageSize=${PageSize}` : ''}`)
    }
    VoucherDetailGet = (id) => {
        return this.axios.get(`/promotion/api/Voucher/${id}`)
    }
    VoucherClaimPost = (body) => {
        return this.axios.post(`/promotion/api/Voucher/Claim`, body)
    }
    voucherClaimedGet = (code) => {
        return this.axios.get(`/promotion/api/Voucher/ClaimbyUser?VoucherCode=${code}`)
    }
}