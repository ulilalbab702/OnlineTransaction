import React from "react";
import toJson from "enzyme-to-json";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ListNewsPage from "views/ListNewsPage/ListNewsPage";
import { listNewsDummy, detailNews } from "./../../../dummy/ListNews.dummy";

Enzyme.configure({ adapter: new Adapter() });
describe("List News Component", () => {
    const wrapper = shallow(
        <ListNewsPage
            listNewsData={listNewsDummy}
            dataNewsAll={detailNews}
        />
    );
    describe("List News Component", () => {
        it("Should match to snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});