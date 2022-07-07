import React from "react";
import toJson from "enzyme-to-json";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import BillingAddress from "views/BillingAddress/BillingAddress";
import { dataBillingAddressDummy } from "../../../dummy/BillingAddress.dummy";

Enzyme.configure({ adapter: new Adapter() });
describe("Change Address Component", () => {
    const wrapper = shallow(
        <BillingAddress
            data={dataBillingAddressDummy}
        />
    );
    describe("Change Address Component Component", () => {
        it("Should match to snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});
