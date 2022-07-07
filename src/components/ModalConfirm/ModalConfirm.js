import React, { useState } from "react";
import "./ModalConfirm.scss";
import { Modal, DialogContent } from "@material-ui/core";
import { IconCaution, IconUTCall, IconMail } from "assets/icons";
import "react-sweet-progress/lib/style.css";

const ModalConfirm = ({ isOpen, isClose, cancel, submit, title, dialogTitle, titleButtonCancel, titleButtonContinue }) => {
  return (
    <Modal className='modal-confirm-del' open={isOpen} onClose={isClose}>
      <DialogContent className='container-modal-upload'>
        <div className='upload-modal-body'>
          <p className='titleUpload'>{title}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={IconCaution} className='iconModal' />
          </div>

          <p className='titleAvailable'>{dialogTitle}</p>
          <div className='header-button-upload'>
            <div className='cardCancel' onClick={() => cancel()} style={{ cursor: 'pointer' }}>
              <p className='textBuy'>{titleButtonCancel}</p>
            </div>
            <div className='cardSubmit' onClick={() => submit()} style={{ cursor: 'pointer' }}>
              <p className='textBuy'>{titleButtonContinue}</p>
            </div>
          </div>
          <p className='mt-4 title-contact'>Butuh informasi tambahan? Kontak kami</p>
          <div className='container-footer-contact'>
            <img className='marginIcon' src={IconUTCall} alt='ut-call-icon' />
            <img src={IconMail} alt='mail-icon'
              style={{ cursor: "pointer" }}
              onClick={() => {
                window.open("mailto:utmobileapp@unitedtractors.com?subject=Question for UT Connect Team");
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Modal>
  );
};

export default ModalConfirm;
