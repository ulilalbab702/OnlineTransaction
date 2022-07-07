import BaseApi from "api/base";
import apiConfigOc from "config/apiOc.config";

export default class WishlistApi extends BaseApi {
    static newInstance = token => {
        if (!this.api) {
            this.api = new WishlistApi(apiConfigOc(token));
        }
        return new WishlistApi(apiConfigOc(token));
    }
    getWishlist = (Filters) => {
        return this.axios.get(`api/v1/catalog/product?ShowWishlist=true&MaterialName=${Filters}`)
    }
    postWishlist = (body) => {
        return this.axios.post(`api/v1/catalog/wishlist`, body)
    }
    deleteWishlist = (body) => {
        const arr = { productId: body[0] }
        return this.axios.delete(`api/v1/catalog/wishlist`, {
            data: arr
        })
    }
    deleteBulkWishlist = (body) => {
        const arr = []
        for (let i = 0; body.length > i; i++) {
            const newArr = {
                productId: body[i]
            }
            arr.push(newArr);
        }
        return this.axios.delete('api/v1/catalog/wishlist/bulk', {
            data: arr
        })
    }
};