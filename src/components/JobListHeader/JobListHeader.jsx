import React from 'react';
import { TableSortLabel, Tooltip, TableCell } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import './JobListHeader.scss'
export default class JobListHeader extends React.Component {
    render(){
        return (
            <TableCell 
                align='center' 
                className='table-cell'
            >
                <Tooltip
                    title='Sort'
                    placement='bottom-end'
                    enterDelay={this.props.delay}
                >
                    <TableSortLabel
                        active={this.props.isActive}
                        IconComponent={this.props.isAscending ? KeyboardArrowUp :KeyboardArrowDown}
                        onClick={this.props.onClick}
                    >
                    {this.props.name}
                    </TableSortLabel>
                </Tooltip>
            </TableCell>
        )
    }
}