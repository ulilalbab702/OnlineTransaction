import React from "react";
import "./ModalSuccessAddBucket.scss";
import { Modal, DialogContent } from "@material-ui/core";
import { IconUTCall, IconMail, } from "assets/icons";
import stagingSuccess from 'assets/icons/stagingSuccess.png'

const ModalAccessDenied = ({ isOpen, toHome, toBucket }) => {
  return (
    <Modal className='modal-upload' open={isOpen}>
      <DialogContent className="container-modall-denied">
        <div className="mb-0 container-denied">
          <p className="title-denied">Berhasil ditambahkan</p>
          <img
            src={stagingSuccess}
            alt="denied-icon"
            style={{ width: "45%", alignSelf: "center" }}
          />
          <p className="title-message">Lihat barang anda di keranjang</p>
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <div
              className="btn"
              style={{ backgroundColor: '#D8D8D8' }}
              onClick={toHome}
            >
              <p className="title-confirm">Kembali</p>
            </div>
            <div
              className="btn"
              style={{ backgroundColor: '#ffd500' }}
              onClick={toBucket}
            >
              <p className="title-confirm">Lanjutkan</p>
            </div>
          </div>
          <p className='mt-3 title-contact'>Butuh informasi tambahan? Kontak kami</p>
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

export default ModalAccessDenied;
