import React, { useState } from "react";
import "./ModalConfirm.scss";
import { Modal, DialogContent } from "@material-ui/core";
import { InputBase, Paper } from "@material-ui/core";
import { IconMail, IconUTCall, IconCautionYellow } from "assets/icons";
import { Link } from "react-router-dom";
import { MENU } from "constants/menu";


const ModalShippment = ({ isOpen, isClose, available, cancel, continueOrder, props }) => {
  const [selectedTabShippment, setTabShippment] = useState(0);
  const [setDataKurir, setKurir] = useState([
    {
      name: "Kurir Expedisi",
      date: "(Estimasi 2-7 hari)",
      data: [
        {
          name: "Harmoni Reguler",
          date: "(Estimasi 3-4 hari)",
          price: "Rp. 150.000",
        },
        {
          name: "Lion Parcel Express",
          date: "(Estimasi 3-4 hari)",
          price: "Rp. 150.000",
        },
        {
          name: "Lion Parcel Reguler",
          date: "(Estimasi 4-7 hari)",
          price: "Rp. 150.000",
        },
      ],
    },
  ]);
  const [setDataAddress, setAddress] = useState([
    {
      name: "Pick Up at Warehouse",
      date: "Only at Office Hour Time",
      price: "Free Shipment",
      data: [
        {
          name: "UT Branch Semarang",
          address: "Jl. Raya Randugarut No.Km. 12, Tugurejo, Kec. Tugu, Kota Semarang, Jawa Tengah 50186",
        },
      ],
    },
  ]);

  const onClick = (option) => {
    if (option === selectedTabShippment) setTabShippment(0);
    else setTabShippment(option);
  };

  const renderListKurir = () => {
    return setDataKurir.map((item) => {
      return (
        <div className='container-shippment-kurir shippment-margin'>
          <div className='container-shippment-row'>
            <div className='radio-border'>
              <div className='radio-button' />
            </div>
            <div>
              <p className='title-name-expedisi'>{item.name}</p>
              <p className='title-date-expedisi'>{item.date}</p>
            </div>
          </div>
          <div className=' line-horizontal-shippment ' />
          <div>
            {item.data.map((item) => {
              return (
                <div>
                  <div className='container-shippment-row shippment-margin'>
                    <div className='radio-border'>
                      <div className='radio-button' />
                    </div>
                    <div>
                      <p className='title-name-expedisi'>{item.name}</p>
                      <p className='title-date-expedisi'>{item.date}</p>
                    </div>
                    <p className='title-price-expedisi'>{item.price}</p>
                  </div>
                  <div className=' line-horizontal-shippment' />
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  const renderListAddress = () => {
    return setDataAddress.map((item) => {
      return (
        <div className='container-shippment-kurir shippment-margin'>
          <div className='container-shippment-row'>
            <div className='radio-border'>
              <div className='radio-button' />
            </div>
            <div>
              <p className='title-name-expedisi'>{item.name}</p>
              <p className='title-date-expedisi'>{item.date}</p>
            </div>
            <div className='border-price-shipment'>
              <p className='title-price-shipment'>{item.price}</p>
            </div>
          </div>
          <div className='shippment-margin'>
            {item.data.map((item) => {
              return (
                <div>
                  <div className='container-shippment-row '>
                    <div className='card-item-address'>
                      <p className='title-name-expedisi'>{item.name}</p>
                      <p className='title-date-expedisi'>{item.address}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className=' line-horizontal-shippment ' />
        </div>
      );
    });
  };

  return (
    <Modal className='modal-confirmBL' open={isOpen} onClose={isClose}>
      <DialogContent className='container-modal-shippment'>
        <div className='confirm-modal-body'>
          <p className='titleConfirm'>Kamu Yakin?</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={IconCautionYellow} className='iconModal' />
          </div>
          <h5 className='titleAvailable'>
            Dengan memilih lanjutkan Anda setuju dengan
            <span
              onClick={() => props.push(MENU.TERM_CONDITION)}
              style={{ color: "#3532ac", cursor: 'pointer' }}
            > syarat dan ketentuan</span> UT Connect
          </h5>
          <div className='header-button-upload'>
            <div className='cardCancel' onClick={cancel} style={{ cursor: 'pointer' }}>
              <p className='textSave'>Kembali</p>
            </div>
            <div className='cardSave' onClick={(continueOrder)} style={{ cursor: 'pointer' }}>
              <p className='textSave'>Lanjutkan</p>
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

export default ModalShippment;
