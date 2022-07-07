import React, { useState } from 'react';
import PinInput from 'react-pin-input';
import './ModalVerifyCode.scss';
import { IconVerifyCode, IconUTCall, IconMail } from "../../assets/icons"
import { Modal, DialogContent } from "@material-ui/core";

const ModalVerifyCode = ({ isOpen, isClose, onSubmit, resendCode, errorVerify }) => {
  const [verifyCode, setVerifyCode] = useState('')
  return (
    <Modal className="modal-verify" open={isOpen} onClose={isClose}>
      <DialogContent className="con-modal-verify">
        <img className="iconVerify" src={IconVerifyCode} alt="icon-verify-code" />
        <h3>Verifikasi Kode</h3>
        <p>Masukkan kode verifikasi</p>
        <div className="con-pin">
          <PinInput
            length={6}
            initialValue=""
            type="numeric"
            value={verifyCode}
            onChange={(value) => setVerifyCode(value)}
            inputMode="number"
            style={{
              marginTop: 30,
              marginBottom: 20,
            }}
            inputStyle={{
              border: 'none',
              borderBottom: '1px solid #000000',
              transition: '150ms all ease',
              fontFamily: 'SFUIText-Bold',
              fontStyle: 'normal',
              fontSize: 32
            }}
            inputFocusStyle={{ borderBottom: '1px solid #FFFFFF' }}
            autoSelect={true}
          />
          {errorVerify !== null && errorVerify}
          <div className="btn-verify" onClick={() => onSubmit(verifyCode)}>
            <p>Kirim</p>
          </div>
        </div>
        <span onClick={() => resendCode(true)}>
          Kirim ulang?
        </span>
        <p className='mt-3 mb-2 title-contact'>Butuh informasi tambahan? Kontak kami</p>
        <div className='container-footer-contact'>
          <img className='marginIcon' src={IconUTCall} alt='ut-call-icon' />
          <img src={IconMail} alt='mail-icon'
            style={{ cursor: "pointer" }}
            onClick={() => {
              window.open("mailto:utmobileapp@unitedtractors.com?subject=Question for UT Connect Team");
            }}
          />
        </div>
      </DialogContent>
    </Modal>
  )
}

export default ModalVerifyCode;
