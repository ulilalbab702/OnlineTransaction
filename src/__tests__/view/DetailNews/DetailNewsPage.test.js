import React from "react";
import toJson from "enzyme-to-json";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import DetailNewsPage from "views/DetailNewsPage/DetailNewsPage";
import { dataDetailNewsDummy, listDetailNewsDummy } from "./../../../dummy/DetailNews.dummy";

Enzyme.configure({ adapter: new Adapter() });
describe("Detail News Component", () => {
	const wrapper = shallow(
		<DetailNewsPage
			detailNewsData={dataDetailNewsDummy}
			newsListData={listDetailNewsDummy}

		/>
	);
	describe("Detail News Component", () => {
		it("Should match to snapshot", () => {
			expect(toJson(wrapper)).toMatchSnapshot();
		});
	});
});
