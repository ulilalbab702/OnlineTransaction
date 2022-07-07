import React from 'react';
import { InputBase, Paper } from '@material-ui/core';
import './SearchInputMini.scss';
import { Zoom, IconZoom } from 'assets/icons'

const SearchInputMini = ({ disabled, handleEnterKey, name, placeHolder }) => {
    return (
        <Paper
            className={'search-input-mini'}
            elevation={1}
        >
            <InputBase
                style={{ fontFamily: "SFProText-Bold" }}
                disabled={disabled}
                className='search-text'
                placeholder={placeHolder}
                value={name}
                onChange={(event) => handleEnterKey(event.target.value)}
            />
            <Paper className='search-card'>
                <img className='search-icon' alt='icon' src={IconZoom} />
            </Paper>
        </Paper>
    )

}
export default SearchInputMini;
