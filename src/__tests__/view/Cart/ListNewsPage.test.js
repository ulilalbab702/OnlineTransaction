import React from "react";
import toJson from "enzyme-to-json";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import BucketListPage from "views/BucketListPage/BucketListPage";
import { cartDummyList } from "./../../../dummy/Cart.dummy";

Enzyme.configure({ adapter: new Adapter() });
describe("Cart List Component", () => {
    const wrapper = shallow(
        <BucketListPage
                cartList={cartDummyList}
        />
    );
    describe("Cart List Component", () => {
        it("Should match to snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});