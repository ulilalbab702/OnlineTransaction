import { BillingAddresApi } from "api";
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
  CONTACT_INFORMATION_POST_REQ,
  CONTACT_INFORMATION_POST_SUCCESS,
  CONTACT_INFORMATION_POST_FAILED,
  INFO_BILLING_ADDRESS,
  REQUEST_TYPE,
  SUCCESS_TYPE,
  FAILURE_TYPE,
  CONTACT_INFORMATION_PUT_REQ,
  CONTACT_INFORMATION_PUT_SUCCESS,
  CONTACT_INFORMATION_PUT_FAILED,
  SEARCH_DISTRICT_FAILED,
  SEARCH_DISTRICT_REQ,
  SEARCH_DISTRICT_SUCCESS,
  POSTAL_CODE_FAILED,
  POSTAL_CODE_REQ,
  POSTAL_CODE_SUCCESS
} from "actions/actionTypes";

const api = (token) => BillingAddresApi.newInstance(token);
export const listBillingAddressGet = (userId, token) => async (dispatch) => {
  dispatch({
    type: BILLING_ADDRESS_REQ,
  });
  try {
    const res = await api(token).getListBillingAddres(userId);
    dispatch({
      type: BILLING_ADDRESS_SUCCESS,
      payload: { data: res.data },
    });
  } catch (error) {
    dispatch({
      type: BILLING_ADDRESS_FAILED,
      payload: { err: error },
    });
  }
};

export const getInfoBillingAddress = (userId, token) => async (dispatch) => {
  dispatch({
    type: `${INFO_BILLING_ADDRESS}${REQUEST_TYPE}`
  });
  try {
    const res = await api(token).getInfoBillingAddress(userId);
    dispatch({
      type: `${INFO_BILLING_ADDRESS}${SUCCESS_TYPE}`,
      payload: { data: res.data }
    })
  } catch (error) {
    dispatch({
      type: `${INFO_BILLING_ADDRESS}${FAILURE_TYPE}`,
      payload: { err: error }
    })
  }
}

export const listBillingAddressPut = (token, billingId, item, changeStatus) => async (dispatch) => {
  dispatch({
    type: BILLING_ADDRESS_PUT_REQ,
  });
  try {
    const data = {
      fullName: item.fullName,
      contactNumber: item.contactNumber,
      addressLabel: item.addressLabel,
      city: item.city,
      province: item.province,
      districts: item.districts,
      address: item.address,
      postalCode: item.postalCode,
      isPrimary: changeStatus ? true : item.isPrimary,
      village: item.village,
      status: true,
    }
    const res = await api(token).putListBillingAddres(billingId, data);
    dispatch({
      type: BILLING_ADDRESS_PUT_SUCCESS,
      payload: { data: res },
    });
  } catch (error) {
    dispatch({
      type: BILLING_ADDRESS_PUT_FAILED,
      payload: { err: error },
    });
  }
};

export const billingAddressDelete = (token, billingId) => async (dispatch) => {
  dispatch({
    type: BILLING_ADDRESS_PUT_REQ,
  });
  try {
    const data = {
      status: false
    };
    const res = await api(token).putListBillingAddres(billingId, data);
    dispatch({
      type: BILLING_ADDRESS_PUT_SUCCESS,
      payload: { data: res },
    });
  } catch (error) {
    dispatch({
      type: BILLING_ADDRESS_PUT_FAILED,
      payload: { err: error },
    });
  }
};

export const billingAddressPost = (token, userId, item) => async (dispatch) => {
  dispatch({
    type: BILLING_ADDRESS_POST_REQ,
  });
  try {
    const data = [
      {
        fullName: item.fullName,
        contactNumber: item.contactNumber,
        addressLabel: item.addressLabel,
        city: item.city,
        province: item.province,
        districts: item.districts,
        address: item.address,
        postalCode: item.postalCode,
        village: item.village,
        isPrimary: true
      }
    ]
    const res = await api(token).postBillingAddres(userId, data);
    dispatch({
      type: BILLING_ADDRESS_POST_SUCCESS,
      payload: { data: res },
    });
  } catch (error) {
    dispatch({
      type: BILLING_ADDRESS_POST_FAILED,
      payload: { err: error },
    });
  }
};

export const listBillingAddressPost = (data, token) => async (dispatch) => {
  dispatch({
    type: CONTACT_INFORMATION_POST_REQ,
  });
  let response = null
  try {
    const res = await api(token).postListBillingAddres(data);
    if (res.data != null) {
      dispatch({
        type: CONTACT_INFORMATION_POST_SUCCESS,
        payload: { data: res.data },
      });
      response = res.data
    }
  } catch (error) {
    response = '400'
    dispatch({
      type: CONTACT_INFORMATION_POST_FAILED,
      payload: { err: error },
    });
  }
  return response
};

export const contactInformationPut = (data, token) => async (dispatch) => {
  dispatch({
    type: CONTACT_INFORMATION_PUT_REQ,
  });
  let response = null
  try {
    const res = await api(token).putContactInformation(data);
    if (res.data != null) {
      dispatch({
        type: CONTACT_INFORMATION_PUT_SUCCESS,
        payload: { data: res.data },
      });
      response = res.data
    }
  } catch (error) {
    response = '400'
    dispatch({
      type: CONTACT_INFORMATION_PUT_FAILED,
      payload: { err: error },
    });
  }
  return response
};

export const getSearchDistrict = (city) => async (dispatch) => {
  dispatch({
    type: SEARCH_DISTRICT_REQ,
  });
  let response = null
  try {
    const res = await api().getSearchDistrict(city);
    if (res.data != null) {
      dispatch({
        type: SEARCH_DISTRICT_SUCCESS,
        payload: { data: res.data },
      });
      response = res.data
    }
  } catch (error) {
    response = "400"
    dispatch({
      type: SEARCH_DISTRICT_FAILED,
      payload: error
    });
  }
  return response
};

export const getSearchPostalCode = (postalcode) => async (dispatch) => {
  dispatch({
    type: POSTAL_CODE_REQ,
  });
  let response = null
  try {
    const res = await api().getSearchPostalCode(postalcode);
    if (res.data != null) {
      dispatch({
        type: POSTAL_CODE_SUCCESS,
        payload: { data: res.data },
      });
      response = res.data
    }
  } catch (error) {
    response = "400"
    dispatch({
      type: POSTAL_CODE_FAILED,
      payload: error
    });
  }
  return response
};

export const resetDistrict = () => (dispatch) => {
  dispatch({
    type: SEARCH_DISTRICT_REQ,
  });
}

export const resetPostalcode = () => (dispatch) => {
  dispatch({
    type: POSTAL_CODE_REQ,
  });
}