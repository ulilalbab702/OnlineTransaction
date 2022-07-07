import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "./Autocomplete.scss";
import {
    SearchIcon,
    BuildingIcon,
    IconZoom
} from "assets/icons"
export class Autocomplete extends Component {
    static propTypes = {
        options: PropTypes.instanceOf(Array).isRequired
    };
    state = {
        activeOption: 0,
        filteredOptions: [],
        showOptions: false,
        userInput: '',
    };

    onChange = (e) => {
        const { options } = this.props;
        const userInput = e.currentTarget.value;

        const filteredOptions = options.filter(
            (optionName) =>
                optionName.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );

        this.setState({
            activeOption: 0,
            filteredOptions,
            showOptions: true,
            userInput: e.currentTarget.value
        });
    };

    onClick = (e) => {
        this.setState({
            activeOption: 0,
            filteredOptions: [],
            showOptions: false,
            userInput: e.currentTarget.innerText
        });
    };

    render() {
        const {
            onChange,
            onClick,
            onKeyDown,

            state: { activeOption, filteredOptions, showOptions, userInput }
        } = this;
        let optionList;
        if (showOptions && userInput) {
            if (filteredOptions.length) {
                optionList = (
                    <ul className="options">
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: '0.5rem', paddingTop: '1rem' }}>
                            <img className="iconZoom" src={IconZoom}></img>
                            <div className="textSearch">"{userInput}" in customer name</div>
                        </div>
                        {filteredOptions.map((optionName, index) => {
                            let className;
                            if (index === activeOption) {
                                className = 'option-active';
                            }
                            return (
                                <li className={className} key={optionName} onClick={onClick}>
                                    <img className="buildingIcon" src={BuildingIcon}></img>
                                    {optionName}
                                </li>
                            );
                        })}
                    </ul>
                );
            }
        }
        return (
            <React.Fragment>
                <div className="search">
                    <input
                        type="text"
                        className="search-box"
                        placeholder="Search Account Name"
                        onChange={onChange}
                        value={userInput}
                    />
                    <img className="searchIcon" src={SearchIcon}></img>
                </div>
                {optionList}
            </React.Fragment>
        );
    }
}
export default Autocomplete;