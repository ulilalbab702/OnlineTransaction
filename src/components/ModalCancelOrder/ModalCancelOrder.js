import React, { useState } from "react";
import "./ModalCancelOrder.scss";
import { Modal, DialogContent } from "@material-ui/core";
import { IconCancelOrder, IconArrowDown } from "assets/icons";
import { Input } from "reactstrap";
import "react-sweet-progress/lib/style.css";

const ModalCancelOrder = ({ isOpen, isClose, cancel, listCancel, onSubmit }) => {
  const [optionClicked, setOptionClicked] = useState(false)
  const [error, setError] = useState(false)
  const [cancelReason, setCancelReason] = useState("")

  const handleChangeOption = (item) => {
    setOptionClicked(false)
    setCancelReason(item)
  }

  const handleClickOption = () => {
    setError(false)
    if (optionClicked) {
      setOptionClicked(false)
    } else {
      setOptionClicked(true)
    }
  }

  const handleClickModal = () => {
    if (optionClicked) {
      setOptionClicked(false)
    }
  }

  const handleSubmit = (reason) => {
    if (reason) {
      onSubmit(reason)
      isClose()
    } else {
      setError(true)
    }
  }

  const handleCancel = () => {
    setCancelReason("")
    cancel()
  }

  return (
    <Modal className='modal-upload-cancel' open={isOpen} onClose={isClose}>
      <DialogContent className='container-modal-cancel' onClick={() => handleClickModal()}>
        <div className='body-modal-cancel'>
          <p className='titleCancel'>Batalkan Pesanan</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={IconCancelOrder} className='iconCancel' />
          </div>

          <p className='titleCancel'>Alasan Membatalkan Pesanan</p>
          <div className='containerSelect'>
            <Input
              type='select'
              className='input-custom'
              value={cancelReason}
              onChange={(event) => setCancelReason(event.target.value)}>
              <option />
              {listCancel && listCancel.map((item) => {
                return (
                  <option>{item}</option>
                )
              })}
            </Input>
          </div>
          <div className='header-button-cancel'>
            <div className='cardCancel' onClick={() => handleCancel()}>
              <p className='textBuy'>Kembali</p>
            </div>
            <div className='cardCancel' style={{ backgroundColor: '#ffd500' }} onClick={() => handleSubmit(cancelReason)}>
              <p className='textBuy'>Kirim</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Modal>
  );
};

export default ModalCancelOrder;
