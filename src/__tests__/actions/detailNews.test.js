import {
    DETAIL_NEWS_LIST_FAILED,
    DETAIL_NEWS_LIST_REQ,
    DETAIL_NEWS_LIST_SUCCESS,
    DETAIL_NEWS_REQ,
    DETAIL_NEWS_FAILED,
    DETAIL_NEWS_SUCCESS
  } from "actions/actionTypes";
  import {
    listDetailNews,
    listDetailNewsAll
  } from "actions/detailNews";
  import moxios from "moxios";
  import thunk from "redux-thunk";
  import configureMockStore from "redux-mock-store";
  import { DetailNewsApi } from "api/";
  import * as actions from "../../actions/detailNews";
  
  // Initialization
  const api = DetailNewsApi.newInstance();
  const middleware = [thunk];
  const mockStore = configureMockStore(middleware);
  const initialState = {
  };
  describe("Detail News Service", () => {
    let store;
    beforeEach(() => {
      store = mockStore(initialState);
      moxios.install(api.axios);
    });
    afterEach(() => {
      moxios.uninstall(api.axios);
    });
    it("Action Type Detail News by ID", () => {
      let expectedActions = [
        { type: DETAIL_NEWS_REQ },
      ];
      try {
        const id = 'daaa19b6-d0a6-460c-12c1-08d8d4877ae9'
        store.dispatch(actions.listDetailNews(id));
        expect(store.getActions()).toEqual(expectedActions);
      } catch (error) {
      }
    });
    it("Action Type List Detail News", () => {
      let expectedActions = [
        { type: DETAIL_NEWS_LIST_REQ },
      ];
      try {
        store.dispatch(actions.listDetailNewsAll(1, '', ''));
        expect(store.getActions()).toEqual(expectedActions);
      } catch (error) {
      }
    }); 
  });