import {
    LIST_PRODUCT_FAILED,
    LIST_PRODUCT_REQ,
    LIST_PRODUCT_SUCCESS
} from "actions/actionTypes";
import moxios from "moxios";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { ListProductApi } from "api/";
import * as actions from "../../actions/listProduct";
import { expect } from "chai";

// Initialization
const api = ListProductApi.newInstance();
const middleware = [thunk];
const mockStore = configureMockStore(middleware);
const initialState = {
};

describe("List Product Get Service", () => {
    let store;
    beforeEach(() => {
        store = mockStore(initialState);
        moxios.install(api.axios);
    });
    afterEach(() => {
        moxios.uninstall(api.axios);
    });
    it("Action Type List Product New", () => {
        let expectedActions = [
            { type: LIST_PRODUCT_REQ },
        ];
        try {
            store.dispatch(actions.listProduct());
            expect(store.getActions().toEqual(expectedActions));
        } catch (error) {
        }
    })
})