import React, { useState } from "react";
import "./ModalShippment.scss";
import { Modal, DialogContent, Checkbox } from "@material-ui/core";
import { InputBase, Paper } from "@material-ui/core";
import * as Utils from "../../../utils/format.helper";

const ModalShippment = ({ isOpen, isClose, simpan, dataShipment, dataBranch, customerCode }) => {
  const [tabShippment, setTabShippment] = useState(null);
  const [kurir, setKurir] = useState(null);
  const [expedisi, setTitleExpedisi] = useState(null);
  const [date, setDate] = useState(null);
  const [price, setPrice] = useState(null);
  const [insurance, setInsurance] = useState(null);
  const [shipmentId, setShipmentId] = useState(null);
  const [isInsurence, setIsInsurence] = useState(false);
  const [disable, setDisable] = useState(true);
  const [dataAddress, setAddress] = useState([
    {
      name: "Ambil Sendiri",
      date: "Hanya dapat melayani pada jam operasional 09.00 - 15.00",
      price: "Bebas Biaya",
      shipmentId: null,
    },
  ]);

  const renderListKurir = () => {
    return dataShipment.map((dataS) => {
      return (
        <div className='container-shippment-kurir shippment-margin'>
          <div
            className='container-shippment-row'
            onClick={() => {
              setTabShippment(0);
              setTitleExpedisi(dataS.forwarder);
              setDisable(true)
            }}
          >
            <div className='radio-border'>
              <div className={tabShippment === 0 ? "radio-button" : "radio-button disable"} />
            </div>
            <div>
              <p className='title-name-expedisi' style={{ fontFamily: "SFProText-Bold" }}>
                {dataS.forwarder}
              </p>
              <p className='title-date-expedisi'></p>
            </div>
          </div>
          <div className='line-horizontal-shippment' style={{ marginLeft: 0 }} />
          {expedisi != null ?

            <div>
              {dataS.data.map((item, index) => {
                return (
                  <div>
                    <div
                      className='container-shippment-row shippment-margin'
                      onClick={() => {
                        setKurir(item.description);
                        setTabShippment(0);
                        setInsurance(item.insuranceRate);
                        setShipmentId(item.forwarderProductId);
                        setKurir(item.description);
                        setPrice((parseInt(item.totalNormalTariff) - parseInt(item.insuranceRate)) + '');
                        setDate(item.estimatedDay);
                        setDisable(false);
                        setTitleExpedisi(expedisi);
                      }}
                    >
                      <div className='radio-border'>
                        <div
                          className={
                            tabShippment === 0 && kurir === item.description ? "radio-button" : "radio-button disable"
                          }
                        />
                      </div>
                      <div>
                        <p className='title-name-expedisi'>{item.description}</p>
                        <p className='title-date-expedisi'>Estimasi {item.estimatedDay} Hari</p>
                      </div>
                      <p className='title-price-expedisi'> Rp. {Utils.formatCurrency(parseInt(item.totalNormalTariff) - parseInt(item.insuranceRate))}</p>
                    </div>
                    <div className=' line-horizontal-shippment' />
                  </div>
                );
              })}
            </div> : null}
        </div>
      );
    });
  };

  const renderListAddress = () => {
    return dataAddress.map((item) => {
      return (
        <div className='container-shippment-kurir shippment-margin'>
          <div
            className='container-shippment-row'
            onClick={() => {
              setTabShippment(1);
              setIsInsurence(false);
              setShipmentId(null);
              setKurir(null);
              setTitleExpedisi(item.name);
              setPrice(item.price);
              setDate(item.date);
              setDisable(false);
              setInsurance(null)
            }}
          >
            <div className='radio-border'>
              <div className={tabShippment === 1 ? "radio-button" : "radio-button disable"} />
            </div>
            <div>
              <p className='title-name-expedisi' style={{ fontFamily: "SFProText-Bold" }}>
                {item.name}
              </p>
              <p className='title-date-expedisi' style={{ width: '90%' }}>{item.date}</p>
            </div>
            <div className='border-price-shipment' style={{ margin: 'auto 0' }}>
              <p className='title-price-shipment-free' style={{ whiteSpace: 'nowrap' }}>{item.price}</p>
            </div>
          </div>
          {tabShippment === 1 ?
            <div className="container-address-shipment">
              <p className="title-address-shipment">{dataBranch?.branchDescription}</p>
              <p className="desc-address-shipment">{dataBranch?.branchAddress}</p>
            </div> : null
          }
          <div className='line-horizontal-shippment' style={{ marginLeft: 0 }} />
        </div>
      );
    });
  };

  return (
    <Modal className='modal-shippment' open={isOpen} onClose={isClose}>
      <DialogContent className='container-modal-shippment'>
        <div className='shippment-modal-body'>
          <p className='titleShippment'>Pilihan Pengiriman</p>
          <div className='line-horizontal-shippment' style={{ marginLeft: 0 }} />
          {dataShipment.length > 0 && customerCode == "ONETIMESTD" ? renderListKurir() : null}
          {/* HIDE ASURANSI */}
          {/* {insurance != null ? (
            <div
              className='container-shippment-row shippment-margin'
              style={{
                backgroundColor: "#F1F1F1",
                height: 40,
                alignItems: "center",
                paddingLeft: 10,
                marginBottom: 10,
              }}
            >
              <p className='title-name-expedisi'>Asuransi Pengiriman</p>
              <div style={{ display: "flex", flexDirection: "row", height: 40, alignItems: "center", marginLeft: 'auto' }}>
                <p className='title-price-expedisi' style={{ marginBottom: 0 }}>
                  Rp. {Utils.formatCurrency(insurance)}
                </p>
                <Checkbox
                  style={{ color: "#148F0F" }}
                  checked={isInsurence}
                  onChange={() => setIsInsurence(!isInsurence)}
                />
              </div>
            </div>
          ) : null} */}
          {renderListAddress()}
          <div className='container-btn-shippment'>
            <div className='cardCancel' onClick={() => isClose()}>
              <p className='textSave'>
                Kembali
              </p>
            </div>
            {disable ? (
              <div className='cardSave-disable'>
                <p className='textSave' >
                  Simpan
                </p>
              </div>
            ) : (
              <div
                className='cardSave'
                onClick={() => simpan(shipmentId, isInsurence, insurance, kurir, expedisi, date, price)}
              >
                <p className='textSave'>
                  Simpan
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Modal>
  );
};

export default ModalShippment;
