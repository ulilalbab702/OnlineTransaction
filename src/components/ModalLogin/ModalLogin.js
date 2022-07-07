import React, { useState } from "react";
import "./ModalLogin.scss";
import { Modal, DialogContent } from "@material-ui/core";
import { InputBase, Paper } from "@material-ui/core";
import { IconLogin, IconUTCall, IconMail, IconArrowLeft, IconGoogle } from "assets/icons";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import GoogleLogin from "react-google-login";

const dotenv = require('dotenv');
dotenv.config();
const GOOGLE_ID = process.env.REACT_APP_GOOGLE_CLIENT

const ModalLogin = ({ isOpen, isClose, isSignUp, isVerify, isForgot, login, loginGoogle, isLoading, error, blocked, timer }) => {
  const [hidden, setHidden] = useState(false);
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "username") {
      const val1 = value;
      setData((prevState) => ({
        ...prevState,
        [name]: val1,
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const responseGoogleSuccess = (response) => {
    const dataGoogle = {
      "tokenAuthorization": response.tokenObj.access_token,
      "provider": "Google"
    };
    loginGoogle(dataGoogle);
  };
  const responseGoogleError = (response) => {
  };

  return (
    <Modal className='modal-login' open={isOpen} onClose={isClose}>
      <DialogContent className='container-modal-login'>
        <form className='login-modal-body'>
          <img className='imageLogin' src={IconLogin} />
          <div className='container-title-input'>
            <p className='titleInput'>EMAIL</p>
            <InputBase
              className='container-title-input'
              disabled={blocked}
              type='text'
              name='username'
              value={data.username}
              onChange={handleChange}
            />
          </div>
          <div className='horizontal-line-input' />
          <div className='container-title-input'>
            <p className='titleInput'>KATA SANDI</p>
            <div style={{ display: "flex" }}>
              <InputBase
                className='container-title-input'
                name='password'
                disabled={blocked}
                value={data.password}
                onChange={handleChange}
                type={hidden ? "text" : "password"}
                autoComplete="off"
              />
              {hidden ? (
                <Visibility onClick={() => setHidden(!hidden)} />
              ) : (
                <VisibilityOff onClick={() => setHidden(!hidden)} />
              )}
            </div>
          </div>
          <div className='horizontal-line-input' />
          <p className='mb-1 title' onClick={() => isForgot(true)}>
            Lupa Password ?
          </p>
          {error ?
            <p className='errorMessage'>Akun dan/atau password Anda salah, silakan coba lagi</p>
            : null
          }

          {
            blocked ?
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p className='errorMessage'>{`kamu gagal login lebih dari tiga kali`}</p>
                <p className='errorMessage'>{`mohon tunggu ${timer.second} detik untuk mencoba login kembali`}</p>
              </div>

              :
              <div className='btn-login' onClick={() => login(data)}>
                <p className='titleButtonLogin' style={isLoading ? { color: "blue" } : {}}>{isLoading ? "Loading..." : "Masuk"}</p>
              </div>
          }

          <div
            style={{
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <div className='horizontal-line' />
            <p
              style={{
                textAlign: "center",
                marginTop: 0,
                marginBottom: 0,
                marginLeft: 5,
                marginRight: 5,
              }}
            >
              Atau
            </p>
            <div className='horizontal-line' />
          </div>
          <GoogleLogin
            clientId={GOOGLE_ID} //CLIENTID NOT CREATED YET
            buttonText='LOGIN WITH GOOGLE'
            render={(renderProps) => (
              <Paper
                className='btn-goggle'
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                <img className='iconButton' src={IconGoogle} />
                <p className='titleGoogle' style={{ marginRight: "auto", marginLeft: 20 }}>Masuk dengan Google</p>
                <img className='iconLeft' src={IconArrowLeft} />
              </Paper>
            )}
            onSuccess={responseGoogleSuccess}
            onFailure={responseGoogleError}
          />
          <div>
            <p style={{ margin: 0 }} className='titleDont'>Belum punya akun ?{" "}
              <span className="title" onClick={() => isSignUp(true, false)}>Daftar disini</span></p>
          </div>
          <div className="con-more-info">
            <span>Butuh informasi tambahan? Kontak kami</span>
            <div className="con-more-info-image">
              <img className='marginIcon' src={IconUTCall} alt="ut-call" />
              <img style={{ cursor: 'pointer' }} src={IconMail} alt="mail-icon" onClick={() => { window.open('mailto:utmobileapp@unitedtractors.com?subject=Question for UT Connect Team') }} />
            </div>
          </div>
        </form>
      </DialogContent>
    </Modal>
  );
};

export default ModalLogin;
