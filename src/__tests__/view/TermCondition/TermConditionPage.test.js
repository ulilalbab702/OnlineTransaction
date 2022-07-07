import React from "react";
import toJson from "enzyme-to-json";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import TermConditionPage from "views/TermConditionPage/TermConditionPage";
import { dataTermConditionDummy } from "../../../dummy/TermCondition.dummy";

Enzyme.configure({ adapter: new Adapter() });
describe("Term Condition Page Component", () => {
    const wrapper = shallow(
        <TermConditionPage
            dataTermCondition={dataTermConditionDummy}
        />
    );
    describe("Term Condition Page Component", () => {
        it("Should match to snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});