import React, { useState } from 'react'
import { Modal, DialogContent } from "@material-ui/core";
import { useForm } from 'react-hook-form';
import './ModalNewPassword.scss'
import { LockIcon, IconUTCall, IconMail } from 'assets/icons';
import { Visibility, VisibilityOff } from '@material-ui/icons';

function ModalNewPassword({ isOpen, isClose, handleNewPassword }) {
  const [errorMessage, setError] = useState(false)
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ criteriaMode: "all" });
  const onSubmit = (data) => {
    if (data.newPassword !== data.oldPassword) {
      return setError(true)
    }
    return (
      setError(false),
      handleNewPassword(data)
    )
  };
  const [toggle, setToggle] = useState(false)
  const [toggle2, setToggle2] = useState(false)
  return (
    <Modal className="modal-new-password" open={isOpen} onClose={isClose}>
      <DialogContent className="container-modal-new-password">
        <div style={{ padding: "0 2em", width: "100%" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <p className="headTitle">Password Baru</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
              <img src={LockIcon} alt='lock-icon' />
            </div>
            <div className="container-title-input-register">
              <p className="titleInput">PASSWORD BARU</p>
              <div style={{ display: 'flex' }}>
                <input
                  type={toggle ? 'text' : 'password'}
                  autoComplete="off"
                  className="input-value-register"
                  {...register("newPassword", {
                    required: "Please fill data",
                    maxLength: {
                      value: 25,
                      message: "This input must be less than 25 characters"
                    },
                    minLength: {
                      value: 8,
                      message: "This input must be more than 8 characters"
                    }
                  })}
                />
                {toggle ? <Visibility onClick={() => setToggle(!toggle)} /> : <VisibilityOff onClick={() => setToggle(!toggle)} />}
              </div>
              <p className='error-message-register'>{errors.newPassword?.message}</p>
            </div>
            <div className="container-title-input-register">
              <p className="titleInput">KONFIRMASI PASSWORD</p>
              <div style={{ display: 'flex' }}>
                <input
                  type={toggle2 ? 'text' : 'password'}
                  autoComplete="off"
                  className="input-value-register"
                  {...register("oldPassword", {
                    required: "Please fill data",
                    maxLength: {
                      value: 25,
                      message: "This input must be less than 25 characters"
                    },
                    minLength: {
                      value: 8,
                      message: "This input must be more than 8 characters"
                    }
                  })}
                />
                {toggle2 ? <Visibility onClick={() => setToggle2(!toggle2)} /> : <VisibilityOff onClick={() => setToggle2(!toggle2)} />}
              </div>
              <p className='error-message-register'>{errors.newPassword?.message}</p>
            </div>
            {errorMessage && <p style={{ color: 'red' }}>Password baru dan konfirmasi password tidak sama!</p>}
            <button type="submit" className="submit-new-password">Kirim</button>
          </form>
          <p className='mt-3 title-contact'>Butuh informasi tambahan? Kontak kami</p>
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
  )
}

export default ModalNewPassword
