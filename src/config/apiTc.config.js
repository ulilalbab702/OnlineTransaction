import * as axios from 'axios';
import { getStorage } from 'utils/storage.helper';
const dotenv = require('dotenv');
dotenv.config();

const OCP_CLINET_ID = process.env.REACT_APP_OCP_CLIENT

//Set to true for enabling logging axios request and response
const logging = true;

const axiosConfigTc = {
    timeout: 30000,
    baseURL: process.env.REACT_APP_API_URL_TC,
    headers: {
        Accept: 'application/json,application/pdf,application/octet-stream'
    },
}
//Initial Config API
const apiConfigTc = () => {
    const token = getStorage("USER")?.tokenResponse?.accessToken;

    if (OCP_CLINET_ID) axiosConfigTc.headers['Ocp-Apim-Subscription-Key'] = OCP_CLINET_ID;
    
    if (token) axiosConfigTc.headers.Authorization = `Bearer ${token}`;
    if (process.env.NODE_ENV === 'development') {
    }
    const axiosApi = axios.create(axiosConfigTc);
    if (logging) {
        axiosApi.interceptors.request.use(request => {
            if (process.env.NODE_ENV === 'development') {
            }
            return request;
        })
        axiosApi.interceptors.response.use(response => {
            if (process.env.NODE_ENV === 'development') {
            }
            return response;
        })
    }
    return axiosApi;
};


export default apiConfigTc;