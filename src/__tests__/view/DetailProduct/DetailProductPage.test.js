import React from 'react';
import toJson from 'enzyme-to-json';
import Enzyme, { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import DetailProductPage from "views/DetailProduct/DetailProductPage";

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureStore([]);

describe('Detail Product Report', () => {
    let store;
    let wrapper;
    let instance;

    beforeEach(() => {
        store = mockStore({
            listProduct: [], listItem: [],
        })
    })
    it('renders correctly', () => {
        wrapper = renderer.create(
            <Provider store={store}>
                <DetailProductPage />
            </Provider>
        )
        instance = wrapper.root

        expect(wrapper.toJSON()).toMatchSnapshot();
    });
    afterAll(() => {
        wrapper.unmount();
    })
});
