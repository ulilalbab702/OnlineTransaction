import BaseApi from "api/base";
import apiConfig from 'config/api.config';

export default class UserProfileApi extends BaseApi {
    static newInstance = token => {
        if (!this.api) this.api = new UserProfileApi(apiConfig(token));
        return this.api;
    }
    postUserInfo = (data) => {
        return this.axios.get(`user-management/api/userinfo`, data)
    }
}