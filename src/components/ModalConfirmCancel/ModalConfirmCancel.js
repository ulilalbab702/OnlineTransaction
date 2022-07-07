import React, { useState } from "react";
import "./ModalConfirmCancel.scss";
import { Modal, DialogContent } from "@material-ui/core";
import { IconCaution, IconArrowDown, IconUTCall, IconMail, IconQuestion } from "assets/icons";

const ModalConfirmCancel = ({ isOpen, isClose, confirm, cancel, onSubmit }) => {

  return (
    <Modal className='modal-confirm-cancel' open={isOpen} onClose={isClose}>
      <DialogContent className='container-modal-cancel'>
        {confirm ?
          <div className='body-modal-cancel'>
            <p className='titleCancel'>Kamu yakin?</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={IconQuestion} className='iconCancel' />
            </div>
            <p className='textCancel'>Kamu ingin membatalkan barang ini ?</p>
            <div className='row-button-cancel'>
              <div className='cardCancel'>
                <p className='textBuy'>Kembali</p>
              </div>
              <div className='cardCancel' style={{ backgroundColor: '#ffd500' }}>
                <p className='textBuy'>Lanjutkan</p>
              </div>
            </div>
          </div>
          :
          <div className='body-modal-cancel'>
            <p className='titleCancel'>Huhu sayang sekali...</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={IconCaution} className='iconCancel' />
            </div>
            <p className='textCancel' >Transaksi ini tidak dapat dibatalkan karena telah diproses oleh tim logistik.</p>
            <p className='textCancel'>Butuh informasi tambahan? Kontak kami</p>
            <div className='rowContact'>
              <img src={IconUTCall} />
              <img src={IconMail}
                style={{ cursor: "pointer" }}
                alt='mail-icon'
                onClick={() => {
                  window.open("mailto:utmobileapp@unitedtractors.com?subject=Question for UT Connect Team");
                }}
              />
            </div>
          </div>}
      </DialogContent>
    </Modal>
  );
};

export default ModalConfirmCancel;
