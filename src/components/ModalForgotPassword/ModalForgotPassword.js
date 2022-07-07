import React, { useState } from 'react';
import { Modal, DialogContent } from '@material-ui/core'
import './ModalForgotPassword.scss';

function ModalForgotPassword({ isOpen, isClose, onSubmit, errorMessage }) {
  const [email, setEmail] = useState('')
  return (
    <Modal className="modal-forgot-password" open={isOpen} onClose={isClose}>
      <DialogContent className="con-modal-forgot">
        <div className="modal-header">
          <h4>Lupa password Anda?</h4>
        </div>
        <div className="modal-body">
          <h6>Masukkan email yang sudah terdaftar untuk membuat password baru.</h6>
          <input
            className="input-forgot-password"
            placeholder="Email Anda..."
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <div style={{ display: 'flex' }}>
            <button onClick={() => onSubmit(email)}>
              Kirim
            </button>
            <p>{errorMessage !== null && errorMessage?.error}</p>
          </div>
        </div>
      </DialogContent>
    </Modal>
  )
}

export default ModalForgotPassword;
