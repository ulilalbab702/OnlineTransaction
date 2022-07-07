import React from "react";
import "./ModalSuccessAddress.style.scss";
import { Modal, DialogContent } from "@material-ui/core";
import { SuccessSignUp } from "assets/images";

const ModalSuccessAddress = ({ isOpen, isClose, title, description }) => {
  return (
    <Modal className='modal-upload' open={isOpen} onClose={isClose}>
      <DialogContent className="container-modall-susscess-address">
        <div className="container-success-address">
          <p className="title-success-address">{title}</p>
          <img
            src={SuccessSignUp}
            alt="success-address-icon"
            style={{ width: "35%", alignSelf: "center" }}
          />
          <p className="title-message-success-address">{description}</p>
          <div className="btn-success-address" onClick={isClose}>
            <p className="confirm-success-address">OK</p>
          </div>
        </div>
      </DialogContent>
    </Modal>
  );
};

export default ModalSuccessAddress;
