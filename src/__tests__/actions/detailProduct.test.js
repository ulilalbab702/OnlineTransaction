import {
    DETAIL_PRODUCT_SUCCESS,
    DETAIL_PRODUCT_FAILED,
    DETAIL_PRODUCT_REQ,
    DETAIL_PRODUCT_RELATED_FAILED,
    DETAIL_PRODUCT_RELATED_REQ,
    DETAIL_PRODUCT_RELATED_SUCCESS,
  } from "actions/actionTypes";
  import {
    detailProductRelatedGet,
    detailProductGet
  } from "actions/detailProduct";
  import moxios from "moxios";
  import thunk from "redux-thunk";
  import configureMockStore from "redux-mock-store";
  import { DetailProductApi } from "api/";
  import * as actions from "../../actions/detailProduct";
  
  // Initialization
  const api = DetailProductApi.newInstance();
  const middleware = [thunk];
  const mockStore = configureMockStore(middleware);
  const initialState = {
  };
  describe("Detail Product get Service", () => {
    let store;
    beforeEach(() => {
      store = mockStore(initialState);
      moxios.install(api.axios);
    });
    afterEach(() => {
      moxios.uninstall(api.axios);
    });
    it("Action Type Detail Product by ID", () => {
      let expectedActions = [
        { type: DETAIL_PRODUCT_REQ },
      ];
      try {
        const id = 1
        store.dispatch(actions.detailProductGet(id));
        expect(store.getActions()).toEqual(expectedActions);
      } catch (error) {
      }
    });
    it("Action Type Detail Product Related List", () => {
      let expectedActions = [
        { type: DETAIL_PRODUCT_RELATED_REQ },
      ];
      try {
        store.dispatch(actions.detailProductRelatedGet(1, '', '', '', '', '', '', 1, 6));
        expect(store.getActions()).toEqual(expectedActions);
      } catch (error) {
      }
    }); 
  });