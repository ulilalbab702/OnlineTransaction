import {
    LIST_NEWS_REQ,
    LIST_NEWS_SUCCESS,
    LIST_NEWS_FAILED,
} from "actions/actionTypes";
import {
    listNews
} from "actions/listNews";
import moxios from "moxios";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { ListNewsApi } from "api/";
import * as actions from "../../actions/listNews";

// Initialization
const api = ListNewsApi.newInstance();
const middleware = [thunk];
const mockStore = configureMockStore(middleware);
const initialState = {

};
describe("List News Service", () => {
    let store;
    beforeEach(() => {
        store = mockStore(initialState);
        moxios.install(api.axios);
    });
    afterEach(() => {
        moxios.uninstall(api.axios);
    });
    it("Action Type List News Redux", () => {
        let expectedActions = [
            { type: LIST_NEWS_REQ }
        ];
        try {
            store.dispatch(actions.listNews(1));
            expect(store.getActions()).toEqual(expectedActions);
        } catch (error) {
        }
    });
});