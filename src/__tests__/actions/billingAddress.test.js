import {
    BILLING_ADDRESS_POST_REQ,
    BILLING_ADDRESS_POST_SUCCESS,
    BILLING_ADDRESS_POST_FAILED,
} from "actions/actionTypes";
import { listBillingAddressPost } from 'actions/billingAddress';
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
    it("Action Type Billing Address Post", () => {
        let expectedActions = [{ type: BILLING_ADDRESS_POST_REQ }];
        try {
            const id = "97f647a6-56b6-4aa9-bfa1-53830a474437";
            const data = [{
                fullName: "Test Integrasi",
                contactNumber: "088122345",
                email: "testintegrasi@unitedtractors.com",
                position: "string",
                addressLabel: "Kantor PT Global Service Indonesia",
                city: "Jakarta",
                address: "Jl Raya kaliabang Tengah, Ruko San Jaya, Blok A5 No 9,\r\nSebalah Indomaret",
                postalCode: "13920",
                locationLatitude: "3.669276961596295",
                locationLongitude: "102.4003031491451",
                isPrimary: true,
            }];
            store.dispatch(actions.listBillingAddressPost(id, data));
            expect(store.getActions()).toEqual(expectedActions);
        } catch (error) {
        }
    });
});
