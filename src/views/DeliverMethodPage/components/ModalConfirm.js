import React from "react";
import "./ModalConfirm.scss";
import { Modal, DialogContent } from "@material-ui/core";
import { IconMail, IconUTCall, IconCautionYellow } from "assets/icons";

const ModalConfirmOrder = ({ isOpen, isClose, cancel, continueOrder }) => {
  return (
    <Modal className='modal-confirmBL' open={isOpen} onClose={isClose}>
      <DialogContent className='container-modal-shippment'>
        <div className='confirm-modal-body'>
          <p className='titleConfirm'>Kamu Yakin?</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={IconCautionYellow} className='iconModal' />
          </div>
          <h5 className='titleConfirmNotAva'>
            Ada barang yang tidak tersedia di Keranjang kamu.
          </h5>
          <div className='header-button-upload'>
            <div className='cardCancel' onClick={continueOrder} style={{ cursor: 'pointer' }}>
              <p className='textSave'>Bayar sekarang</p>
            </div>
            <div className='cardSave' onClick={cancel} style={{ cursor: 'pointer' }}>
              <p className='textSave'>Periksa kembali</p>
            </div>
          </div>
          <p className='mt-4 title-contact'>Butuh informasi tambahan? Kontak kami</p>
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

export default ModalConfirmOrder;
