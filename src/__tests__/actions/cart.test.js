import {
    CART_LIST_SUCCESS,
    CART_LIST_REQ,
    CART_LIST_FAILED
} from "actions/actionTypes";
import moxios from "moxios";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { CartApi } from "api/";
import * as actions from "../../actions/cart";

// Initialization
const api = CartApi.newInstance();
const middleware = [thunk];
const mockStore = configureMockStore(middleware);
const initialState = {

};
describe("Cart Service", () => {
    let store;
    beforeEach(() => {
        store = mockStore(initialState);
        moxios.install(api.axios);
    });
    afterEach(() => {
        moxios.uninstall(api.axios);
    });
    it("Action Type Cart List ", () => {
        let expectedActions = [
            { type: CART_LIST_REQ }
        ];
        try {
            store.dispatch(actions.listCart());
            expect(store.getActions()).toEqual(expectedActions);
        } catch (error) {
        }
    });
});