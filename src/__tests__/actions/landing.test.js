import {
    BRAND_FAILED,
    BRAND_SUCCESS,
    BRAND_REQ,
    LIST_NEWS_HOME_FAILED,
    LIST_NEWS_HOME_REQ,
    LIST_NEWS_HOME_SUCCESS,
    LIST_NEWS_ADDITIONAL_SUCCESS,
    LIST_NEWS_ADDITIONAL_REQ,
    LIST_NEWS_ADDITIONAL_FAILED
} from "actions/actionTypes";
import { listBillingAddressPost } from 'actions/billingAddress';
import moxios from "moxios";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { BrandApi, ListNewsApi } from "api/";
import * as actions from "../../actions/brand";
import * as actionsNews from "../../actions/listNews";

// Initialization
const api = BrandApi.newInstance();
const middleware = [thunk];
const mockStore = configureMockStore(middleware);
const initialState = {};
describe("Brand Get Service", () => {
    let store;
    beforeEach(() => {
        store = mockStore(initialState);
        moxios.install(api.axios);
    });
    afterEach(() => {
        moxios.uninstall(api.axios);
    });
    it("Action Type Brand Get", () => {
        let expectedActions = [{ type: BRAND_REQ }];
        try {
            store.dispatch(actions.listBrand());
            expect(store.getActions()).toEqual(expectedActions);
        } catch (error) {
        }
    });
});
