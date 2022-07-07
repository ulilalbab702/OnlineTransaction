import React, { useEffect, useState } from "react";
import "./ModalSignUp.scss";
import {
  Modal,
  DialogContent,
  Input,
  Button,
  Switch,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import {
  IconLogin,
  IconUTCall,
  IconMail,
  IconGoogle,
  IconArrowLeft,
  IconFacebookRound,
  IconArrowDown,
} from "assets/icons";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import GoogleLogin from "react-google-login";

const dotenv = require("dotenv");
dotenv.config();
const FACEBOOK_ID = process.env.REACT_APP_FACEBOOK_CLIENT_TEST;
const GOOGLE_ID = process.env.REACT_APP_GOOGLE_CLIENT;

const GreenCheckbox = withStyles({
  root: {
    color: "none",
    "&$checked": {
      color: "#5ACC4D",
    },
  },
  checked: {},
})((props) => <Checkbox color='default' {...props} />);

const ModalSignUp = ({ isOpen, isClose, handleSignup, loginGoogle, isLogin, isLoading }) => {
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const [captchaResponse, setCaptcha] = useState("");
  const [state, setState] = useState({
    checkedDaftarUser: true,
    checkedSyaratKetentuan: true,
  });
  const [haveCustomerCode, setHaveCustomerCode] = useState(false);
  const [isTermCondition, setIsTermCondition] = useState(false);
  const [listJabatan, setListJabatan] = useState([]);
  const [listCabang, setListCabang] = useState([]);
  const [nomor, setNomor] = useState();
  const [email, setEmail] = useState("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ criteriaMode: "all" });

  const onSubmit = (data) => {
    const dataRegister = {
      provider: "webUTC",
      webUTCmodel: {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.contactNumber,
        email: data.email,
      },
    };
    handleSignup(dataRegister);
  };
  const _handleCaptchaResponseChange = (data) => {
    setCaptcha(data);
  };

  const _handleChangeEmail = (value) => {
    const val1 = value;
    setEmail(val1);
  };

  const _handleChangeCustomerCode = (event) => {
    setHaveCustomerCode(event.target.checked);
  };

  const responseGoogleSuccess = (response) => {
    const dataGoogle = {
      tokenAuthorization: response.tokenObj.access_token,
      provider: "Google",
    };
    loginGoogle(dataGoogle);
  };
  const responseGoogleError = (response) => {
  };

  useEffect(() => {
    function setData() {
      setListJabatan(dummyJabatan);
      setListCabang(dummyCabang);
    }
    setData();
  }, []);

  const handleChangeNomor = (value) => {
    const val1 = value.replace(/[^0-9]+/g, "");
    const val2 = val1.slice(0, 12);
    setNomor(val2);
  };

  return (
    <Modal className='modal-SignUp' open={isOpen} onClose={isClose}>
      <DialogContent className='container-modal-login'>
        <div className='login-modal-body-register'>
          <img className='imageLogin' src={IconLogin} style={{ alignSelf: "center" }} />
          <div style={{ padding: "0 2em", width: "100%" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='container-title-input-register'>
                <p className='titleInput'>NAMA DEPAN</p>
                <input
                  placeholder='Masukkan nama depan'
                  className='input-value-register'
                  {...register("firstName", {
                    required: "Nama depan tidak boleh kosong",
                    maxLength: {
                      value: 25,
                      message: "Masukkan kurang dari 25 karakter",
                    },
                  })}
                />
                <p className='error-message-register'>{errors.firstName?.message}</p>
              </div>
              <div className='container-title-input-register'>
                <p className='titleInput'>NAMA BELAKANG</p>
                <input
                  placeholder='Masukkan nama belakang'
                  className='input-value-register'
                  {...register("lastName", {
                    required: "Nama belakang tidak boleh kosong",
                    maxLength: {
                      value: 25,
                      message: "Masukkan kurang dari 25 karakter",
                    },
                  })}
                />
                <p className='error-message-register'>{errors.lastName?.message}</p>
              </div>
              <div className='container-title-input-register'>
                <p className='titleInput'>NOMOR TELEPON</p>
                <input
                  placeholder='Masukkan nomor telepon'
                  type='text'
                  className='input-value-register'
                  {...register("contactNumber", {
                    required: "Nomor telepon tidak boleh kosong",
                  })}
                  value={nomor}
                  onChange={(e) => handleChangeNomor(e.target.value)}
                />
                <p className='error-message-register'>{errors.contactNumber?.message}</p>
              </div>
              <div className='container-title-input-register'>
                <p className='titleInput'>EMAIL</p>
                <input
                  placeholder='Masukkan email'
                  className='input-value-register'
                  {...register("email", {
                    required: "Email tidak boleh kosong",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+$/,
                      message: "Masukkan email yang valid",
                    },
                  })}
                  value={email}
                  onChange={(e) => _handleChangeEmail(e.target.value)}
                />
                <p className='error-message-register'>{errors.email?.message}</p>
              </div>
              <div className='container-title-input-register'>
                <ReCAPTCHA sitekey='6Lf8f-QUAAAAAN-mxXpiwlWUl3bT5hShQcBF8q28' onChange={_handleCaptchaResponseChange} />
              </div>
              <div style={{ display: "flex", flexDirection: "row", marginLeft: -10 }}>
                <Checkbox
                  color='primary'
                  style={{ marginBottom: "auto" }}
                  checked={isTermCondition}
                  onChange={() => setIsTermCondition(!isTermCondition)}
                />
                <p className='text-term-condition'>
                  Saya sudah membaca dan setuju dengan <span>syarat dan ketentuan UT Connect</span>
                </p>
              </div>
              <Button
                type='submit'
                className='btn-sign-up'
                disabled={captchaResponse?.length === 0 || !isTermCondition}
                style={captchaResponse?.length === 0 || !isTermCondition ? { backgroundColor: "#ffe76b" } : {}}
              >
                <div className='titleButtonSignUp'>{isLoading ? "Loading..." : "Daftar"}</div>
              </Button>
            </form>
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
                <Paper className='btn-goggle' onClick={renderProps.onClick} disabled={renderProps.disabled}>
                  <img className='iconButton' src={IconGoogle} />
                  <p className='titleGoogle' style={{ marginRight: "auto", marginLeft: 20 }}>
                    Daftar dengan Google
                  </p>
                  <img className='iconLeft' src={IconArrowLeft} />
                </Paper>
              )}
              onSuccess={responseGoogleSuccess}
              onFailure={responseGoogleError}
            />
          </div>
          <p className='mt-3 title-contact'>Butuh informasi tambahan? Kontak kami </p>
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

export default ModalSignUp;

const dummyJabatan = [
  {
    title: "Owner1",
  },
  {
    title: "Owner2",
  },
  {
    title: "Owner3",
  },
];
const dummyCabang = [
  {
    cabang: "PALEMBANG",
  },
  {
    cabang: "SAMARINDA",
  },
  {
    cabang: "ADARO",
  },
  {
    cabang: "BALIKPAPAN",
  },
  {
    cabang: "JAKARTA",
  },
];
