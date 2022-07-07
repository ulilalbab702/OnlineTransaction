import React from 'react';
import { Popover } from '@material-ui/core';
import { selectConditionIcon } from 'utils/checksheet.helper';

export default class ConditionGroup extends React.PureComponent {
    render(){
        const {masterChecksheet,Measurement} = this.props
        return(
            <Popover 
                id='popover-group-condition'
                open={this.props.isOpen}
                anchorEl={this.props.anchorEl}
                onClose={this.props.onClose}
                anchorOrigin={{
                    vertical:'top',
                    horizontal:'left'
                    }}
                transformOrigin={{
                    vertical:'top',
                    horizontal:'left'
                }}
            >
                <div className='popover-group-condition'>
                    <div className='group-condition-popover'>
                        {
                            masterChecksheet.MConditions.map((field) => {
                                if(field.Measurement === Measurement) {
                                    return (
                                        <div className='group-condition-group' onClick={() => this.props.onClick(field)}>
                                            <img className='group-condition-icon' alt='condition icon' src={selectConditionIcon(Measurement,field.Code,field.Desc)}/>
                                            <div className='group-label-level'>{field.Desc}</div>
                                        </div>
                                    )
                                }
                                return null;
                            })
                        }
                    </div>
                </div>
            </Popover>
        )
    }
}