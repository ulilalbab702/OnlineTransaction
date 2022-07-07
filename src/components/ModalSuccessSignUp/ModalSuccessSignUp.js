import React, { Component, useState } from 'react';
import './ModalSuccessSignUp.scss';
import {
    Modal,
    DialogContent,
} from '@material-ui/core';
import { IconSuccess, IconUTCall, IconMail } from 'assets/icons';

const ModalSuccessSignUp = ({ isOpen, isClose, isSuccessSignUp }) => {
    const [succes, setSuccess] = useState(false);

    return (
        <Modal open={isOpen} onClose={isClose} className='modal-container'>
            <DialogContent className='container-modal-denied'>
                <div className='container-denied'>
                    <p className='title-denied'>Hore selamat...</p>
                    <img src={IconSuccess} alt='denied-icon' className='iconModal' />
                    <p className='title-message'>Email verifikasi telah dikirimkan ke email kamu, silahkan verifikasi</p>
                    <div className='btn-confirm-denied' onClick={() => isSuccessSignUp(false)}>
                        <p className='title-confirm'>OK</p>
                    </div>
                    <p className='title-contact'>Butuh informasi tambahan? Kontak kami</p>
                    <div className='container-footer-contact'>
                        <img className='marginIcon' src={IconUTCall} alt='ut-call-icon' />
                        <img
                            style={{ cursor: "pointer" }}
                            src={IconMail}
                            alt='mail-icon'
                            onClick={() => {
                                window.open("mailto:utmobileapp@unitedtractors.com?subject=Question for UT Connect Team");
                            }}
                        />
                    </div>
                </div>
            </DialogContent>
        </Modal>
    )
}

export default ModalSuccessSignUp;