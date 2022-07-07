import React from "react";
import "./ModalSuccessCreateOrder.scss";
import { Modal, DialogContent } from "@material-ui/core";
import { IconUTCall, IconMail, IconSuccess } from "assets/icons";

const ModalSuccessCreateOrder = ({ isOpen, isClose, toOrderList, isOnetime }) => {
  return (
    <Modal className='modal-upload' open={isOpen} onClose={isClose}>
      <DialogContent className="container-modall-denied">
        <div className="container-denied">
          <p className="title-denied">Hore Selamat...</p>
          <img
            src={IconSuccess}
            alt="denied-icon"
            style={{ width: "35%", alignSelf: "center" }}
          />
          <p className="title-message">{
            isOnetime ? "Transaksi anda berhasil dibuat, silahkan lakukan pembayaran" : "Pesanan kamu telah sukses terbuat"
          }</p>
          <div className="btn-success-order" onClick={toOrderList}>
            <p className="title-confirm">Ok</p>
          </div>
        </div>
      </DialogContent>
    </Modal>
  );
};

export default ModalSuccessCreateOrder;
