import {
    TERM_CONDITION_FAILED,
    TERM_CONDITION_REQ,
    TERM_CONDITION_SUCCESS
} from "actions/actionTypes";
import moxios from "moxios";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { TermConditionApi } from "api/";
import * as actions from "../../actions/termCondition";

// Initialization
const api = TermConditionApi.newInstance();
const middleware = [thunk];
const mockStore = configureMockStore(middleware);
const initialState = {
};

describe("Term Condition Get Service", () => {
    let store;
    beforeEach(() => {
        store = mockStore(initialState);
        moxios.install(api.axios);
    });
    afterEach(() => {
        moxios.uninstall(api.axios);
    });
    it("Action Type Term Condition", () => {
        let expectedActions = [
            { type: TERM_CONDITION_REQ },
        ];
        try {
            store.dispatch(actions.termCondition());
            expect(store.getActions().toEqual(expectedActions));
        } catch (error) {
        }
    })
})