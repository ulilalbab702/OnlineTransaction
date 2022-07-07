import {
   BILLING_ADDRESS_REQ,
   BILLING_ADDRESS_SUCCESS,
   BILLING_ADDRESS_FAILED,
   BILLING_ADDRESS_PUT_REQ,
   BILLING_ADDRESS_PUT_SUCCESS,
   BILLING_ADDRESS_PUT_FAILED,
   BILLING_ADDRESS_POST_REQ,
   BILLING_ADDRESS_POST_SUCCESS,
   BILLING_ADDRESS_POST_FAILED,
   CONTACT_INFORMATION_POST_SUCCESS,
   CONTACT_INFORMATION_POST_REQ,
   CONTACT_INFORMATION_POST_FAILED,
   INFO_BILLING_ADDRESS,
   SUCCESS_TYPE,
   CONTACT_INFORMATION_PUT_SUCCESS,
   CONTACT_INFORMATION_PUT_FAILED,
   CONTACT_INFORMATION_PUT_REQ,
   SEARCH_DISTRICT_FAILED,
   SEARCH_DISTRICT_REQ,
   SEARCH_DISTRICT_SUCCESS,
   POSTAL_CODE_FAILED,
   POSTAL_CODE_REQ,
   POSTAL_CODE_SUCCESS
} from "actions/actionTypes";
import { combineReducers } from "redux";

const initialState = {
   data: {},
   dataPut: null,
   errPut: null,
   dataPost: null,
   dataPutContactInfo: null,
   err: '',
   loading: false,
   districtList: null,
   postalcodeList: null,
   dataPostBilling: null,
   errPostBilling: null,
   dataCity: [],
   dataProvince: [],
   dataVillages: [],
   dataPostalCodes: []
};

export const billingAddress = (state = { ...initialState }, action) => {
   const { payload, type } = action;
   switch (type) {
      case BILLING_ADDRESS_REQ: {
         return { ...state, ...initialState };
      }
      case BILLING_ADDRESS_SUCCESS: {
         const { data } = payload;
         return { ...state, data };
      }
      case BILLING_ADDRESS_FAILED: {
         const { err } = payload;
         return { ...state, err };
      }
      case BILLING_ADDRESS_PUT_REQ: {
         return { ...state, dataPut: null, errPut: null, loading: true };
      }
      case BILLING_ADDRESS_PUT_SUCCESS: {
         const { data } = payload;
         return { ...state, dataPut: data, errPut: null, loading: false };
      }
      case BILLING_ADDRESS_PUT_FAILED: {
         const { err } = payload;
         return { ...state, errPut: err, dataPut: null, loading: false };
      }
      case BILLING_ADDRESS_POST_REQ: {
         return { ...state, dataPostBilling: null, errPostBilling: null, loading: true };
      }
      case BILLING_ADDRESS_POST_SUCCESS: {
         const { data } = payload;
         return { ...state, dataPostBilling: data, errPostBilling: null, loading: false };
      }
      case BILLING_ADDRESS_POST_FAILED: {
         const { err } = payload;
         return { ...state, dataPostBilling: null, errPostBilling: err, loading: false };
      }
      case CONTACT_INFORMATION_POST_SUCCESS: {
         const { data } = payload;
         return { ...state, dataPost: data, err: '', loading: false };
      }
      case CONTACT_INFORMATION_POST_REQ: {
         return { ...state, err: '', loading: true };
      }
      case CONTACT_INFORMATION_POST_FAILED: {
         const { err } = payload;
         return { ...state, err: err, loading: false };
      }
      case CONTACT_INFORMATION_PUT_REQ: {
         return { ...state, dataPutContactInfo: null, err: '', successPutContactInfo: null, loading: true };
      }
      case CONTACT_INFORMATION_PUT_SUCCESS: {
         const { data } = payload;
         return { ...state, dataPutContactInfo: data, err: '', successPutContactInfo: true, loading: false };
      }
      case CONTACT_INFORMATION_PUT_FAILED: {
         const { err } = payload;
         return { ...state, dataPutContactInfo: null, err: err, successPutContactInfo: false, loading: false };
      }
      default:
         return state;
   }
};

export const infoBilling = (state = {}, action) => {
   const { payload, type } = action;
   switch (type) {
      case `${INFO_BILLING_ADDRESS}${SUCCESS_TYPE}`: {
         return { ...state, ...payload }
      }

      default:
         return state;
   }
}

export const district = (state = { ...initialState }, action) => {
   const { payload, type } = action;
   switch (type) {
      case SEARCH_DISTRICT_REQ: {
         return { ...state, err: '', districtList: null, dataProvince: [], dataCity: [], dataVillages: [], dataPostalCodes: [], loading: true };
      }
      case SEARCH_DISTRICT_SUCCESS: {
         const { data } = payload;
         const tempDataProvince = [];
         const tempDataCity = [];
         const tempDataVillages = [];
         const tempDataPostalCode = [];
         for (let i = 0; data.length > i; i++) {
            if (!tempDataProvince.includes(data[i].provinceName)) {
               tempDataProvince.push(data[i].provinceName);
            }
            if (!tempDataCity.includes(data[i].cityName)) {
               tempDataCity.push(data[i].cityName)
            }
            if (data[i].postalCodes.length > 0) {
               for (let p = 0; data[i].postalCodes.length > p; p++) {
                  tempDataPostalCode.push(data[i].postalCodes[p])
               }
            }
            if (data[i].villages.length > 0) {
               for (let v = 0; data[i].villages.length > v; v++) {
                  tempDataVillages.push(data[i].villages[v])
               }
            }
         }
         return { ...state, districtList: data, dataProvince: tempDataProvince, dataCity: tempDataCity, dataVillages: tempDataVillages, dataPostalCodes: tempDataPostalCode, err: '', loading: false };
      }
      case SEARCH_DISTRICT_FAILED: {
         const { err } = payload;
         return { ...state, err: err, loading: false };
      }
      case POSTAL_CODE_REQ: {
         return { ...state, err: '', postalcodeList: null, dataProvince: [], dataCity: [], dataVillages: [], loading: true };
      }
      case POSTAL_CODE_SUCCESS: {
         const { data } = payload;
         const tempDataVillages = [];
         for (let i = 0; data.length > i; i++) {
            if (data[i].villages.length > 0) {
               for (let v = 0; data[i].villages.length > v; v++) {
                  tempDataVillages.push(data[i].villages[v])
               }
            }
         }
         return { ...state, postalcodeList: data, err: '', dataVillages: tempDataVillages, loading: false };
      }
      case POSTAL_CODE_FAILED: {
         const { err } = payload;
         return { ...state, err: err, loading: false };
      }
      default:
         return state;
   }
};

const billingAddressReducer = combineReducers({
   billingAddress: billingAddress,
   infoBilling,
   district
});

export { billingAddressReducer };
