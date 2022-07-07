import "./ModalMyVoucher.style.scss";
import React, { useState } from "react";
import {
  Modal,
  DialogContent,
} from '@material-ui/core';
import { CheckedGood, IconCalendar } from "assets/icons";
import * as Utils from "../../../utils/format.helper";

const ModalMyVoucher = ({ isOpen, isClose, onSubmit, dataVoucher, onSearch }) => {
  const [search, setSearch] = useState("");
  const [isSelect, setIsSelect] = useState(null);

  const _handleSearch = (value) => {
    setSearch(value);
    onSearch(value);
  };

  return (
    <Modal className="modal-my-voucher" open={isOpen} onClose={isClose}>
      <DialogContent className="container-modal-my-voucher">
        <div className="my-voucher-modal-body">
          <h3 className="title-modal">Pilih Voucher</h3>
          <div className="con-search">
            <input
              className="search-voucher"
              value={search}
              onChange={(e) => _handleSearch(e.target.value)}
              placeholder="Masukkan kode voucher"
            />
            <span className="btn-search">
              Cari
            </span>
          </div>
          <div className="con-list-voucher">
            {dataVoucher !== null ? dataVoucher.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => setIsSelect(item)}
                  className={isSelect === item ? "con-voucher active" : "con-voucher"}
                >
                  <div className="voucher-left">
                    <img className="image-voucher" src={item.image} alt="img-voucher" />
                  </div>
                  <div className="voucher-right">
                    <p className="voucher-title">{item.voucherCode}</p>
                    <p className="voucher-price">Maks Diskon <span>Rp {Utils.formatCurrency(item.maxDiscount)}</span></p>
                    <p className="voucher-price">Min Transaksi <span>Rp {Utils.formatCurrency(item.minOrder)}</span></p>
                    <p className="voucher-date">
                      <img className="icon-calender" src={IconCalendar} />
                      {item.periode}
                    </p>
                  </div>
                  <div className="voucher-con-checked">
                    <img className={isSelect === item ? "voucher-checked" : "voucher-check"} src={CheckedGood} />
                  </div>
                </div>
              )
            }) : null}
          </div>
          <div className="con-btn">
            <span className="btn cancle" onClick={() => isClose()}>Batal</span>
            <span className="btn submit" onClick={() => onSubmit(isSelect)}>Kirim</span>
          </div>
        </div>
      </DialogContent>
    </Modal>
  )
}

export default ModalMyVoucher;