import {
    IMAGE_SLIDER_REQ,
    IMAGE_SLIDER_SUCCESS,
    IMAGE_SLIDER_FAILED,
    PROFILE_NEWS_REQ,
    PROFILE_NEWS_SUCCESS,
    PROFILE_NEWS_FAILED,
    MAIN_NEWS_REQ,
    MAIN_NEWS_SUCCESS,
    MAIN_NEWS_FAILED,
} from "actions/actionTypes";
import {
    newsImageSlider,
    newsProfileNews,
    newsMainNews
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
describe("Image Slider News Service", () => {
    let store;
    beforeEach(() => {
        store = mockStore(initialState);
        moxios.install(api.axios);
    });
    afterEach(() => {
        moxios.uninstall(api.axios);
    });
    it("Action Type Image Slider News", () => {
        let expectedActions = [
            { type: IMAGE_SLIDER_REQ }
        ];
        try {
            store.dispatch(actions.newsImageSlider('Image Slider'));
            expect(store.getActions()).toEqual(expectedActions);
        } catch (error) {
        }
    });
    it("Action Type Profile News", () => {
        let expectedActions = [
            { type: PROFILE_NEWS_REQ },
        ];
        try {
            store.dispatch(actions.newsProfileNews('Profile News'));
            expect(store.getActions()).toEqual(expectedActions);
        } catch (error) {
        }
    });
    it("Action Type Main News", () => {
        let expectedActions = [
            { type: MAIN_NEWS_REQ },
        ];
        try {
            store.dispatch(actions.newsMainNews('Main News'));
            expect(store.getActions()).toEqual(expectedActions);
        } catch (error) {
        }
    });
});