import React from 'react';
import { Modal, DialogContent } from '@material-ui/core';
import CloseButton from 'components/CloseButton';
import './ProceedConfirmation.scss';

export default class ProceedConfirmation extends React.PureComponent {
    render(){
    return (
        <Modal
            open={this.props.open}
            onClose={this.props.onClose}
            className="modal-container"
        >
            <DialogContent className="confirmation-modal-content">
            <div className="proceed-confirmation-modal">
                <CloseButton onClose={this.props.onClose}/>
                <div className='confirmation-container'>
                    <p className='confirmation-title'>
                        {this.props.message || 'Do You Want To Proceed ?'}
                    </p>
                    <div className='btn-confirmation'>
                        <div className='btn-no' onClick={this.props.onClose}>No</div>
                        <div className='btn-yes' onClick={this.props.onProceed}>Yes</div>
                    </div>
                </div>
                </div>
            </DialogContent>
        </Modal>
    )}
}