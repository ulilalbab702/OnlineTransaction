import React from 'react';
import './NoteButton.scss';
export default class NoteButton extends React.PureComponent {
    render(){
        return(
            <div className='note-container'>
                <div className='btn-label'>Note</div>
                <div className='btn-note-problems'>{'+'}</div>
            </div>
        )
    }
}