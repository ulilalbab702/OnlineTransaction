import React, { useState } from "react";
import "./ModalAccessDenied.scss";
import { Modal, DialogContent } from "@material-ui/core";
import { IconDenied, IconCautionYellow, IconSuccess, IconUTCall, IconMail } from "assets/icons";
import "react-sweet-progress/lib/style.css";

const ModalAccessDenied = ({ isOpen, isClose, errorText, title }) => {
  return (
    <Modal className='modal-upload' open={isOpen} onClose={isClose}>
      <DialogContent className="container-modall-denied">
        <div className="container-denied">
          <p className="title-denied">{title}</p>
          <img
            src={title === 'Huhu sayang sekali..' ? IconDenied : title === "Hore Selamat..." ? IconSuccess : IconCautionYellow}
            alt="denied-icon"
            style={{ width: "35%", alignSelf: "center" }}
          />
          <p className="title-message">
            {errorText}
          </p>
          <div
            className="btn-confirm-denied"
            onClick={() => isClose()}
          >
            <p className="title-confirm">OK</p>
          </div>
          <p className='mt-3 title-contact'>Butuh informasi tambahan? Kontak kami</p>
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
  );
};

export default ModalAccessDenied;
