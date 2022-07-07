import BaseApi from "api/base";
import apiChangeProfile from 'config/apiChangeProfile.config';

export default class ChangeProfileApi extends BaseApi {
    static newInstance = token => {
        if (!this.api) this.api = new ChangeProfileApi(apiChangeProfile(token));
        return this.api;
    }
    changeProfilePic = (formData) => {
        return this.axios.post(`user-management/api/changephoto`, formData)
    }
}