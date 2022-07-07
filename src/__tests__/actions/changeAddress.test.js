import {
  BILLING_ADDRESS_SUCCESS,
  BILLING_ADDRESS_REQ,
  BILLING_ADDRESS_FAILED,
  BILLING_ADDRESS_PUT_SUCCESS,
  BILLING_ADDRESS_PUT_REQ,
  BILLING_ADDRESS_PUT_FAILED,
} from "actions/actionTypes";
import { listBillingAddressGet, listBillingAddressPut } from "actions/billingAddress";
import moxios from "moxios";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { DetailNewsApi } from "api/";
import * as actions from "../../actions/billingAddress";

// Initialization
const api = DetailNewsApi.newInstance();
const middleware = [thunk];
const mockStore = configureMockStore(middleware);
const initialState = {};
describe("Billing Address Service", () => {
  let store;
  beforeEach(() => {
    store = mockStore(initialState);
    moxios.install(api.axios);
  });
  afterEach(() => {
    moxios.uninstall(api.axios);
  });
  it("Action Type Billing Address List", () => {
    let expectedActions = [{ type: BILLING_ADDRESS_REQ }];
    try {
      const id = "97f647a6-56b6-4aa9-bfa1-53830a474437";
      store.dispatch(actions.listBillingAddressGet(id));
      expect(store.getActions()).toEqual(expectedActions);
    } catch (error) {
    }
  });
  it("Action Type Billing Address Put", () => {
    let expectedActions = [{ type: BILLING_ADDRESS_PUT_REQ }];
    try {
      const id = "97f647a6-56b6-4aa9-bfa1-53830a474437";
      const billingId = "bbc23959-d18a-480e-cf3c-08d8bb5f8bb8";
      const data = {
        billingId: "bbc23959-d18a-480e-cf3c-08d8bb5f8bb8",
        fullName: "Indah Kurnia",
        contactNumber: "088615246576",
        email: "indahks@unitedtractors.com",
        position: "string",
        addressLabel: "Kantor PT Global Service Indonesia",
        city: "Jakarta",
        address: "Jl Raya kaliabang Tengah, Ruko San Jaya, Blok A5 No 9,\r\nSebalah Indomaret",
        postalCode: "13920",
        locationLatitude: "3.669276961596295",
        locationLongitude: "102.4003031491451",
        isPrimary: true,
      };
      store.dispatch(actions.listBillingAddressPut(billingId, id, data));
      expect(store.getActions()).toEqual(expectedActions);
    } catch (error) {
    }
  });
});
