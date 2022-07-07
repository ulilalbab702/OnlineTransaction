import React from 'react';
import {
    Modal,
    DialogContent,
    CircularProgress
} from '@material-ui/core';
import CloseButton from 'components/CloseButton';
import { Success } from 'assets/images';
import { CheckedGood } from 'assets/icons';
import './ConfirmationModal.scss';


export default class ConfirmationModal extends React.PureComponent {
    _renderLoadingScreen = () => {
        const { isLoading } = this.props
        return (
            <>
                {
                    isLoading && <CircularProgress size={100} className="circular-progress" />
                }
            </>
        )
    }
    render() {
        const { isSuccess, message } = this.props
        return (
            <>
                {this._renderLoadingScreen()}
                <Modal
                    open={this.props.open}
                    onClose={this.props.onClose}
                    className='modal-container'
                >
                    <DialogContent className='confirmation-modal-content'>
                        <div className='confirmation-modal'>
                            <CloseButton onClose={this.props.onClose} />
                            {
                                isSuccess ?
                                    (
                                        <div className='confirmation-container'>
                                            <p className='confirmation-title'>Berhasil</p>
                                            <img className='confirmation-image' alt='success icon' src={Success} />
                                            <p className='confirmation-caption'>Selamat!</p>
                                            <p className='confirmation-caption'>{message}</p>
                                        </div>
                                    ) : (
                                        <div className='confirmation-container'>
                                            <p className='confirmation-title'>Gagal</p>
                                            <img className='confirmation-image' alt='failed icon' src={CheckedGood} />
                                            <p className='confirmation-caption'>{this.props.errorMessage || 'Something is wrong'}</p>
                                        </div>
                                    )
                            }
                        </div>
                    </DialogContent>
                </Modal>
            </>
        )
    }
}