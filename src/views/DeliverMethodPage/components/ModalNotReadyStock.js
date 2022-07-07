import React from "react";
import "./ModalNotReadyStock.style.scss";
import { Modal, DialogContent } from "@material-ui/core";
import { IconDenied, IconCautionYellow, IconSuccess, IconUTCall, IconMail } from "assets/icons";
import "react-sweet-progress/lib/style.css";

const ModalNotReadyStock = ({ isOpen, isClose, onSubmit }) => {
  return (
    <Modal className='modal-upload' open={isOpen} onClose={isClose}>
      <DialogContent className="container-modall-not-ready-stock">
        <div className="container-denied">
          <p className="title-denied">Huhu sayang sekali...</p>
          <img
            src={IconDenied}
            alt="denied-icon"
            style={{ width: "35%", alignSelf: "center" }}
          />
          <p className="title-message">
            Ada barang yang tidak tersedia di keranjang kamu
          </p>
          <div
            className="btn-confirm-denied"
            onClick={onSubmit}
          >
            <p className="title-confirm">Periksa keranjang</p>
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

export default ModalNotReadyStock;