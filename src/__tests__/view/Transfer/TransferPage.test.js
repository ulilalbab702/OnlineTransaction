import React from "react";
import toJson from "enzyme-to-json";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import TransferPage from "views/TransferPage/TransferPage";

Enzyme.configure({ adapter: new Adapter() });
describe("Transfer Page Component", () => {
    const wrapper = shallow(
        <TransferPage />
    );
    describe("Transfer Page Component", () => {
        it("Should match to snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});