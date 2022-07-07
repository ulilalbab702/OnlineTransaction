import React from 'react';
import { InputBase, Paper } from '@material-ui/core';
import './SearchInput.scss';
import { Zoom, IconZoom } from 'assets/icons';
import { MENU } from 'constants/menu';


export default class SearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            screenLocation: MENU.LIST_PRODUCT
        }
    }

    handleChange = (e) => {
        if (this.props.path !== MENU.LIST_PRODUCT) {
            this.props.push(this.state.screenLocation)
            // this.setState({ screenLocation: '/Home/ListProduct', value: '' }, () => this.props.push(this.state.screenLocation))
        }
        localStorage.setItem("SEARCH_PRODUCT", JSON.stringify(e.target.value));
        this.setState({ value: e.target.value })
    }

    render() {
        const information = this.props.displayMode === 'web' ? this.props.webInfo : 'Cari Produk';
        return (
            <Paper
                className={this.props.className || 'search-input'}
                elevation={1}
            >
                <InputBase
                    className='search-text'
                    placeholder={information}
                    value={this.state.value}
                    onChange={this.handleChange}
                />
                <Paper className='search-card'>
                    <img className='search-icon' alt='icon' src={IconZoom} />
                </Paper>
            </Paper>
        )
    }
}