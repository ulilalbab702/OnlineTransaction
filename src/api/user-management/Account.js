import BaseApi from '../base/';
import apiConfig from 'config/api.config';

const userManagementService = 'online-transaction/api/login';
class AccountApi extends BaseApi {
    static newInstance = () => {
        if (!this.accountApi) this.accountApi = new AccountApi(apiConfig());
        return this.accountApi;
    };
    login = (data) => {
        return this.axios.post(`${userManagementService}`, data);
    };
    loginGoogle = (data) => {
        return this.axios.post(`${userManagementService}/social`, data);
    };
    signup = (data) => {
        return this.axios.post(`${userManagementService}/social`, data)
    }
    forgotPassword = (params) => {
        return this.axios.post(`online-transaction/api/forgotpassword/gettoken`,params)
    }
    verifyCode = (params) => {
        return this.axios.post(`user-management/api/forgotpassword/validatetoken`,params)
    }
    changePassword = (data) => {
        return this.axios.post(`online-transaction/api/forgotpassword/change`,data)
    }
    refreshToken = (data) => {
        return this.axios.post(`online-transaction/api/refreshtoken`, { refreshToken: data })
    }
}

export default AccountApi