import React from "react";
import toJson from "enzyme-to-json";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ListProductPage from "views/ListProduct/ListProduct";
import { listProductDummy } from "./../../../dummy/ListProductDummy";

Enzyme.configure({ adapter: new Adapter() });
describe("List Product Component", () => {
    const wrapper = shallow(
        <ListProductPage
            listProductData={listProductDummy}
        />
    );
    describe("List Product Component", () => {
        it("Should match to snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        })
    })
})