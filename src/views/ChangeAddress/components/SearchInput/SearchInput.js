import React from 'react';
import { InputBase, Paper } from '@material-ui/core';
import './SearchInput.scss';

const SearchInput = ({ handleEnterKey, name, placeHolder }) => {
    return (
        <Paper
            className={'search-input-address'}
            elevation={1}
        >
            <InputBase
                className='search-text-address'
                placeholder="Kecamatan"
                value={name}
                onChange={(event) => handleEnterKey(event.target.value)}
            />
        </Paper>
    )

}
export default SearchInput;
