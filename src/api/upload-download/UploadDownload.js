import BaseApi from "api/base";
import apiUpload from 'config/apiUpload.config';

export default class UploadDownloadApi extends BaseApi {
    static newInstance = token => {
        if (!this.api) this.api = new UploadDownloadApi(apiUpload(token));
        return this.api;
    }
    getTemplate = () => {
        return this.axios.get(`api/v1/catalog/template`)
    }
    postCsv = (formData) => {
        return this.axios.post(`api/v1/catalog/uploaditem`, formData)
    }
    postFile = (file) => {
        return this.axios.post(`api/v1/catalog/uploadattachment`, file)
    }
}