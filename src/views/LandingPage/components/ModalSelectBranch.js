import React, { useState } from "react";
import "./ModalSelectBranch.scss";
import { Modal, DialogContent } from "@material-ui/core";
import { InputBase, Paper } from "@material-ui/core";
import { Save } from "@material-ui/icons";

const ModalSelectBranch = ({ item, isOpen, isClose, save }) => {
  const [selectedTabBranch, setTabBranch] = useState(null);
  const [selectedBranch, setBranch] = useState(null);

  const renderListAddress = () => {
    return item.map((item, index) => {
      return (
        <div className='margin-nol container-shippment-kurir shippment-margin'>
          <div className='container-shippment-row'>
            {selectedTabBranch === index ? (
              <div className='radio-border-branch'>
                <div className='radio-button-branch' />
              </div>
            ) : (
              <div className='radio-border-null' />
            )}

            <div className='container-shippment-row-branch' onClick={() => (setTabBranch(index), setBranch(item))}>
              <div className='card-item-address-branch'>
                <p className='title-name-expedisi-branch'>{item.description.toUpperCase().replace("UT BRANCH ", "")}</p>
                <p className='title-date-expedisi-branch'>{item.address}</p>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <Modal className='modal-shippment' open={isOpen} onClose={isClose}>
      <DialogContent className='container-modal-shippment'>
        <div className='shippment-modal-body-branch'>
          <p className='titleShippment-branch'>Titik Cabang UT</p>
          <div className=' line-horizontal-shippment' />
          <div style={{ height: '19.5vw', width: '27.3vw', overflowY: "scroll" }}>{renderListAddress()}</div>

          <div className=' line-horizontal-shippment' />
          <div className='header-button-upload'>
            <div className='cardCancel' onClick={isClose} style={{ cursor: 'pointer' }}>
              <p className='textSave'>Kembali</p>
            </div>
            <div className='cardSave' onClick={() => save(selectedBranch)} style={{ cursor: 'pointer' }}>
              <p className='textSave'>Simpan</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Modal>
  );
};

export default ModalSelectBranch;
