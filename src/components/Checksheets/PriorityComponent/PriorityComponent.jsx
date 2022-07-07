import React from 'react';
import './PriorityComponent.scss'

export default class PriorityComponent extends React.PureComponent{
    render(){
        return(
            <div className='priority-container'>
                <div className='btn-label'>Priority</div>
                <div className='btn-priority-problems'>
                {/* Create condition for style button */}
                    <div className='priority-black-text'>
                    {'Priority'}
                    </div>
                </div>
            </div>
        )
    }
}