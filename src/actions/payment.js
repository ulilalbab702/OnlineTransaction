import { PaymentApi } from "api";
import {
    PAYMENT_FAILED,
    PAYMENT_REQ,
    PAYMENT_SUCCESS,
    PAYMENT_METHOD_REQ,
    PAYMENT_METHOD_SUCCESS,
    PAYMENT_METHOD_FAILED,
    SHIPMENT_METHOD_REQ,
    SHIPMENT_METHOD_SUCCESS,
    SHIPMENT_METHOD_FAILED
} from "actions/actionTypes";

const api = (token) => PaymentApi.newInstance(token);

export const listPayment = (param) => async (dispatch) => {
    dispatch({
        type: PAYMENT_REQ,
    });
    try {
        const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjRGNERFRDU3Qzg0NzQxNTI0MTAzOEVENUVDOEExNDM2MjhEQ0Y0NEQiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJUMDN0VjhoSFFWSkJBNDdWN0lvVU5pamM5RTAifQ.eyJuYmYiOjE2MzIyOTM1NzksImV4cCI6MTYzMjM3OTk3OSwiaXNzIjoiaHR0cHM6Ly9kZXYtYWtzLnVuaXRlZHRyYWN0b3JzLmNvbTozMTg2MyIsImF1ZCI6WyJodHRwczovL2Rldi1ha3MudW5pdGVkdHJhY3RvcnMuY29tOjMxODYzL3Jlc291cmNlcyIsImVxdWlwbWVudG1vbml0b3JpbmdzZXJ2aWNlIiwiZmluYW5jaWFsc2VydmljZSIsIm1zdXRtIiwibm90aWZpY2F0aW9uc2VydmljZSIsIm9yZGVyY2F0YWxvZ3NlcnZpY2UiLCJvcmRlcnRyYWNraW5nc2VydmljZSIsIm9yZGVydHJhbnNhY3Rpb25zZXJ2aWNlIiwicHJvbW90aW9uc2VydmljZSIsInRpY2tldGluZ3NlcnZpY2UiLCJ1c2VybWFuYWdlbWVudHNlcnZpY2UiXSwiY2xpZW50X2lkIjoiY3VzdG9tZXJwb3J0YWwiLCJzdWIiOiJkMjFlOTA0YS02ZGU2LTQ1YzAtZWRkYi0wOGQ5MmYzNzFjNDciLCJhdXRoX3RpbWUiOjE2MzIyOTM1NzYsImlkcCI6ImxvY2FsIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InRlc3R1dGNvbm5lY3RAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZ2l2ZW5uYW1lIjoidGVzdHV0Y29ubmVjdCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3N1cm5hbWUiOiJ0ZXN0dXRjb25uZWN0IiwiY3VzdG9tZXJfY29kZSI6IjIwNzczIiwicm9sZV9sZXZlbCI6IjUiLCJyb2xlX25hbWUiOlsiQWRtaW4gQ3VzdG9tZXJfTUFESEFOSSBUQUxBVEFIIE5VU0FOVEFSQSIsIlBPVF9NQURIQU5JIl0sImF1dGhlbnRpY2F0b3IiOiJub25lIiwic2NvcGUiOlsiZXF1aXBtZW50bW9uaXRvcmluZ3NlcnZpY2UiLCJmaW5hbmNpYWxzZXJ2aWNlIiwibXN1dG0iLCJub3RpZmljYXRpb25zZXJ2aWNlIiwib3JkZXJjYXRhbG9nc2VydmljZSIsIm9yZGVydHJhY2tpbmdzZXJ2aWNlIiwib3JkZXJ0cmFuc2FjdGlvbnNlcnZpY2UiLCJwcm9tb3Rpb25zZXJ2aWNlIiwidGlja2V0aW5nc2VydmljZSIsInVzZXJtYW5hZ2VtZW50c2VydmljZSIsIm9mZmxpbmVfYWNjZXNzIl0sImFtciI6WyJwYXNzd29yZCJdfQ.uxYEB0NRKpPomzRLYwcSJwXQdIYuBgMFcPK7e-OWVUxyfJ_4IwPbBmVIJ5E1gXlic0f5cYJ0GCEX-Dou25KLVfBnH_ZZS2EWoRY7RNBh2aHlh98COlnqcrqwzzekcgXkRuHWA824bVqbxctxGby2PrwmugJxBYxVzhE02SuNbhLSXA5inXvaewDjBq1Yeo6IvYsJ93VP0P-UtSjr17k10lrl0vUxXCmP7KkoJFccArvxcrA-J0pQmf1vC6M2WF0AdxOK9xtQtSCfCrkJNftuDeGGtLsryadYYx3YBgCYhwjYJWE-XwR_lYKzj8_uMp-u_twxmVzz94ijB99vfpq9mQ'
        const res = await api(token).getPayment(param);
        dispatch({
            type: PAYMENT_SUCCESS,
            payload: { data: res.data },
        });
    } catch (error) {
        dispatch({
            type: PAYMENT_FAILED,
            payload: error,
        });
    }
};

export const getListPaymentMethod = (token) => async (dispatch) => {
    dispatch({
        type: PAYMENT_METHOD_REQ
    });
    try {
        const res = await api(token).getPaymentMethod();
        dispatch({
            type: PAYMENT_METHOD_SUCCESS,
            payload: { data: res.data }
        });
    } catch (error) {
        dispatch({
            type: PAYMENT_METHOD_FAILED,
            payload: error
        });
    }
}

export const getListShipmentMethod = (token, body) => async (dispatch) => {
    dispatch({
        type: SHIPMENT_METHOD_REQ
    });
    try {
        const res = await api(token).getShipmentMethode(body);
        dispatch({
            type: SHIPMENT_METHOD_SUCCESS,
            payload: { data: res.data }
        });
    } catch (error) {
        dispatch({
            type: SHIPMENT_METHOD_FAILED,
            payload: error
        });
    }
}
