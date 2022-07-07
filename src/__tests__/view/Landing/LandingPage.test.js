import React from 'react';
import toJson from 'enzyme-to-json';
import Enzyme, { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import LandingPage from "views/LandingPage/Landing";

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureStore([]);


  
describe('Landing Report', () => {
    let store;
    let wrapper;
    let instance;


    beforeEach(() => {
        store = mockStore({
            promoNews: [], newsList: [], sorting: [], brandList: [],
            imagePromo: [], listProduct: [],
        })
    })
    
    it('renders correctly', () => {
        wrapper = renderer.create(
            <Provider store={store}>
                <LandingPage  />
            </Provider>
        )
        instance = wrapper.root

        expect(wrapper.toJSON()).toMatchSnapshot();
    });
    afterAll(() => {
        wrapper.unmount();
    })
});
