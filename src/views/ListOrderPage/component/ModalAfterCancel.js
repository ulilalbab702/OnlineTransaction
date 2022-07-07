import React, { useState } from "react";
import "./ModalAfterCancel.style.scss";
import { Modal, DialogContent } from "@material-ui/core";
import {
    IconSuccess,
    IconDenied,
    IconUTCall,
    IconMail
} from "assets/icons";

const ModalAfterCancel = ({ isOpen, isClose, data }) => {
    return (
        <Modal className='modal-after-cancel'
            open={isOpen}
            onClose={isClose}>
            <DialogContent style={{ overflow: 'hidden' }} className='container-modal-cancell'>
                <div className='cancel-modal-body'>
                    <p className='titleCancell'>{data ? 'Pesanan dibatalkan' : 'Huhu sayang sekali...'}</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={data ? IconSuccess : IconDenied} className='iconModall' />
                    </div>
                    <h5 className='titleAvailablee'>
                        {data ? 'Pesanan kamu berhasil dibatalkan' : 'Pesanan kamu gagal dibatalkan, silahkan coba kembali'}
                    </h5>
                    <div className='header-button-uploadd'>
                        <div className='btnn' style={{ backgroundColor: '#ffd500' }}
                            onClick={isClose}>
                            <p>OK</p>
                        </div>
                    </div>
                    <div className="con-more-info-cancel">
                        <span>Butuh informasi tambahan? Kontak kami</span>
                        <div className="con-more-info-imagee">
                            <img className='marginIcon' src={IconUTCall} alt="ut-call" />
                            <img style={{ cursor: 'pointer' }} src={IconMail} alt="mail-icon" onClick={() => { window.open('mailto:utmobileapp@unitedtractors.com?subject=Question for UT Connect Team') }} />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Modal>
    );
};

export default ModalAfterCancel;
