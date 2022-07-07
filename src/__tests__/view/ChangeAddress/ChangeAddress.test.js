import React from "react";
import toJson from "enzyme-to-json";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ChangeAddressPage from "views/ChangeAddress/ChangeAddress";
import { dataBillingAddressDummy } from "../../../dummy/ChangeAddress.dummy";

Enzyme.configure({ adapter: new Adapter() });
describe("Change Address Component", () => {
	const wrapper = shallow(
		<ChangeAddressPage 
			billingAddressList={dataBillingAddressDummy}
		/>
	);
	describe("Change Address Component Component", () => {
		it("Should match to snapshot", () => {
			expect(toJson(wrapper)).toMatchSnapshot();
		});
	});
});
