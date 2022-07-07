import React from "react";
import toJson from "enzyme-to-json";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import DetailProductPage from "views/DetailProduct/DetailProductPage";
import { listDetailProductDummy, dataDetailProductDummy } from "./../../dummy/DetailProduct.dummy";

Enzyme.configure({ adapter: new Adapter() });
describe("Detail Product Component", () => {
	const wrapper = shallow(
		<DetailProductPage 
            detailProduct={dataDetailProductDummy}
			detailProductRelated={listDetailProductDummy}
		/>
	);
	describe("Detail Product Component", () => {
		it("Should match to snapshot", () => {
			expect(toJson(wrapper)).toMatchSnapshot();
		});
	});
});
