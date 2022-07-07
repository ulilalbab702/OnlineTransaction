import {
  PAYMENT_REQ,
  PAYMENT_SUCCESS,
  PAYMENT_FAILED,
  PAYMENT_METHOD_REQ,
  PAYMENT_METHOD_SUCCESS,
  PAYMENT_METHOD_FAILED,
  SHIPMENT_METHOD_REQ,
  SHIPMENT_METHOD_SUCCESS,
  SHIPMENT_METHOD_FAILED
} from "actions/actionTypes";
import { combineReducers } from "redux";

const initialState = {
  data: {
    data: [],
  },
  dataPaymentMethod: null,
  error: null,
  loading: false,
  loadingShipment: false,
  dataShipment: null,
  errorShipment: null
};

export const listPayment = (state = { ...initialState }, action) => {
  const { payload, type } = action;
  switch (type) {
    case PAYMENT_REQ: {
      return { ...state, loading: true, };
    }
    case PAYMENT_SUCCESS: {
      const { data } = payload;
      return { ...state, data: data };
    }
    case PAYMENT_FAILED: {
      return { ...state, loading: false, };
    }
    case PAYMENT_METHOD_REQ: {
      return { ...state, dataPaymentMethod: null, error: null, loading: true }
    }
    case PAYMENT_METHOD_SUCCESS: {
      const { data } = payload;
      return { ...state, dataPaymentMethod: data, error: null, loading: false }
    }
    case PAYMENT_METHOD_FAILED: {
      const { error } = payload;
      return { ...state, dataPaymentMethod: null, error: error, loading: false }
    }
    case SHIPMENT_METHOD_REQ: {
      return { ...state, dataShipment: null, errorShipment: null, loadingShipment: true }
    }
    case SHIPMENT_METHOD_SUCCESS: {
      const { data } = payload;
      return { ...state, dataShipment: data, errorShipment: null, loadingShipment: false }
    }
    case SHIPMENT_METHOD_FAILED: {
      const { error } = payload;
      return { ...state, dataShipment: null, errorShipment: error, loadingShipment: false }
    }
    default:
      return state;
  }
};

const listPaymentReducer = combineReducers({
  listPayment,
});

export { listPaymentReducer };
