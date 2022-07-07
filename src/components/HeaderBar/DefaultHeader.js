import React, { Component } from "react";
import "./DefaultHeaderStyle.scss";
import { UTLogoBlack, klikut, logoUTC } from "assets/images";
import {
  IconCategory,
  IconCart,
  IconOrderDefault,
  IconProgress,
  RightArrow,
  IconGear,
  IconTerm,
  IconLogOut,
  IconDenied,
  IconUTCall,
  IconMail,
  IconMobile,
  IconNotif,
  IconLike,
  IconAsk,
} from "assets/icons";
import ModalLogin from "./../../components/ModalLogin/ModalLogin";
import ModalSignUp from "components/ModalSignUp/ModalSignUp";
import ModalSuccessSignUp from "components/ModalSuccessSignUp/ModalSuccessSignUp";
import { DialogContent, Modal } from "@material-ui/core";
import { userIcon } from "assets/images";
import firebase from "../../firebase/firebase";
import { MENU } from "constants/menu";
import ModalForgotPassword from "components/ModalForgotPassword/ModalForgotPassword";
import ModalVerifyCode from "components/ModalVerifyCode/ModalVerifyCode";
import ModalNewPassword from "components/ModalNewPassword/ModalNewPassword";
import ModalAccessDenied from "components/ModalAccessDenied/ModalAccessDenied";
import SearchInput from "components/SearchInput";
import * as Strap from "reactstrap";
import { getStorage } from "utils/storage.helper";

class DefaultHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVerify: false,
      isDenied: false,
      login: false,
      errorLogin: false,
      logout: false,
      signup: false,
      signupform: false,
      successsignup: false,
      isMenu: false,
      isBrand: true,
      isCategory: false,
      isForgotPassword: false,
      userId: '',
      accessToken: '',
      verifyCode: '',
      isPassword: false,
      errorMessage: null,
      openModalSuccessForgot: false,
      openModalFailedForgot: false,
      loginLock: false,
      timer: {
        minute: 0,
        second: 10
      },
      openModalBucket: false,
      isLogin: false,
      onLanding: false,
      modalLogout: false,
      modalTermIsOpen: false,
      title: '',
      changes: false,
      cek: false,
    };
  }

  setAnalyticClevertap = (action, event, screen, product) => {
    if (this.props.user?.user) {
      const { userName } = this.props.user?.user;
      if (product !== null) {
        window.clevertapEventProduct(`${product[0] + "_LogedIn"}`, product[1]);
      } else {
        window.clevertapEvent(`${event + "_LogedIn"}`, this.props.user?.user);
      }
      firebase.analytics().setUserId(userName);
      firebase.analytics().setUserProperties(userName, "username:" + userName + `||View: ${screen}`);
      firebase.analytics().setCurrentScreen(screen, screen);
      firebase.analytics().logEvent(`${event + "_LogedIn"}`);
      firebase.analytics().setUserProperties("username", userName);
      firebase.analytics().setUserProperties(action, `${event + "_LogedIn"}`);
    } else {
      if (product !== null) {
        window.clevertapEventProduct(`${product[0] + "_NotLogedIn"}`, product[1]);
      } else {
        window.clevertapEvent(`${event + "_NotLogedIn"}`, null);
      }
      firebase.analytics().setCurrentScreen(screen, screen);
      firebase.analytics().logEvent(`${event + "_NotLogedIn"}`);
      firebase.analytics().setUserProperties(action, `${event + "_NotLogedIn"}`);
    }
  };


  actionLogin = () => {
    this.setAnalyticClevertap("click", "Click_ModalLogin", "View_Header_Bar", null);
    this.setState({ login: true });
  };
  actionLogout = () => {
    this.setState({ logout: true });
  };

  actionSignUp = (_signup, _login) => {
    this.setState({ signup: _signup, login: _login });
  };

  actionSuccessSignUp = (_successsignup, _signup) => {
    this.setState({ successsignup: _successsignup, signup: _signup });
  };

  actionSuccessFinalSignUp = (_successsignup) => {
    this.setState({ successsignup: _successsignup });
  };

  actionOrder = () => {
    this.setAnalyticClevertap("click", "Click_ListOrder", "View_Header_Bar", null);
    this.props.push(MENU.LIST_ORDER);
  };

  actionBucketList = () => {
    this.setAnalyticClevertap("click", "Click_BucketList", "View_Header_Bar", null);
    if (this.props.dataCart == null || this.props.dataCart.data.totalCart == 0) {
      this.setState({ openModalBucket: true })
    } else {
      this.props.push(MENU.BUCKET_LIST);
    }
  };

  setLogout = async () => {
    this.setAnalyticClevertap("action", "Action_Logout", "View_Header_Bar", null);
    this.setState({ isLogin: false })
    const { logout } = this.state;
    this.setState({ logout: false, modalLogout: false });
    this.props.clearStore();
    localStorage.clear();
    window.location.replace(MENU.LANDING);
  };

  actionProfile = () => {
    this.setAnalyticClevertap("click", "Click_UserProfile", "View_Header_Bar", null);
    const { logout } = this.state;
    this.setState({ logout: !logout });
    this.props.push(MENU.USER_PROFILE);
  };
  actionTerm = () => {
    this.setAnalyticClevertap("click", "Click_TermCondition", "View_Header_Bar", null);
    const { logout } = this.state;
    this.setState({ logout: !logout });
    this.props.push(MENU.TERM_CONDITION);
  };
  actionWishlist = () => {
    this.setAnalyticClevertap("click", "Click_Wishlist", "View_Header_Bar", null);
    const { logout } = this.state;
    this.setState({ logout: !logout });
    this.props.push(MENU.WISHTLIST_PRODUCT);
  };
  actionForgot = (param) => {
    this.setState({ isForgotPassword: param })
  }
  actionVerify = (_verify, _login) => {
    this.setState({
      isVerify: _verify,
      login: _login
    })

  }
  _handleVerify = async (code) => {
    this.setState({ verifyCode: code })
    const data = await this.props.verifyCode({ token: code })
    if (data === 200) {
      this.setState({
        isPassword: true,
        errorMessage: null,
        isVerify: false
      })
    } else {
      this.setState({ errorMessage: data })
    }
  }

  actionSetPassword = async (data) => {
    let param = {
      token: this.state.verifyCode,
      applicationId: process.env.REACT_APP_APPLICATION_ID,
      password: data.newPassword
    }
    await this.props.changePassword(param)
  }
  _renderModalNewPassword = () => {
    return (
      <ModalNewPassword
        isOpen={this.state.isPassword}
        isClose={() => this.setState({ isPassword: false })}
        handleNewPassword={this.actionSetPassword}
      />
    )
  }
  _renderModalVerifyCode = () => {
    return (
      <ModalVerifyCode
        isOpen={this.state.isVerify}
        isClose={() => this.setState({ isVerify: false })}
        onSubmit={this._handleVerify}
        resendCode={this.actionForgot}
        errorVerify={this.state.errorMessage}
      />
    )
  }
  _renderModalProfile = () => {
    const { logout } = this.state;
    const chart1 = "data:image/png;base64,";
    const user = getStorage("USER");

    return (
      <Modal className='modal-logout' open={logout} onClose={() => this.setState({ logout: !logout })}>
        <DialogContent className='container-modal-x'>
          <div className='container-text-profile'>
            <img style={{ width: "3.5vw", height: "3.5vw", backgroundColor: '#ffffff', borderRadius: '100%' }} src={this.props?.user?.user?.imagePath ? chart1 + this.props?.user?.user?.imagePath : userIcon} />
            <div className='box-text-profile'>
              <p className='text-profile'>{user?.firstName + ' ' + user?.lastName}</p>
              <p className='sub-text-profile'>{this.props?.user?.user?.email}</p>
            </div>
          </div>
          <div className='container-items' style={{ cursor: "pointer" }} onClick={() => this.actionWishlist()}>
            <div
              className="icon-items"
              style={{
                display: 'flex',
                height: 30, width: 30,
                marginTop: 5,
                marginRight: 20,
                borderRadius: '50%',
                backgroundColor: '#f1f1f1'
              }}
            >
              <img src={IconLike} style={{ maxHeight: '50%', maxWidth: '50%', margin: 'auto' }} alt='profile-icon' />
            </div>
            <p>Item Favorit</p>
          </div>
          <div className='container-items' style={{ cursor: "pointer" }} onClick={() => this.actionProfile()}>
            <img className='icon-items' src={IconGear} alt='profile-icon' />
            <p>Pengaturan Profil</p>
          </div>
          <div className='container-items' onClick={() => this.actionTerm()} style={{ cursor: "pointer" }}>
            <img
              className='icon-items'
              src={IconTerm}
              alt='term-and-condition-icon'
            />
            <p>Syarat dan Ketentuan</p>
          </div>
          <div onClick={() => this.setState({ modalLogout: true })} className='container-items' style={{ cursor: "pointer" }}>
            <img className='icon-logout' src={IconLogOut} alt='logout-icon' />
            <p>Keluar</p>
          </div>
        </DialogContent>
      </Modal>
    );
  };
  _handleFailure = () => {
    this.setState({ isDenied: false })
    this.props.clearStore()
  }
  _handleLogin = async (data) => {
    await this.props.login(data)
    if (this.props.error.errorLogin) {
      return (
        this.setState({ login: true, errorLogin: true }),
        this.setAnalyticClevertap("action", "Action_Login_Error", "View_Header_Bar", null)
      )
    }
    else if (this.props.user?.user !== null) {
      await this.props.fetchTermCondition(this.props.user?.user.tokenResponse.accessToken)
      this._handleTermCondition()
      return (
        this.setAnalyticClevertap("action", "Action_Login_Success", "View_Header_Bar", null),
        this.setState({ login: false })
      )
    }
    else if (this.props.user?.user === null) {
      return this.setState({ errorLogin: true }),
        this.setAnalyticClevertap("action", "Action_Login_Error", "View_Header_Bar", null)
    }
  }
  _handleLoginGoogle = async (data) => {
    await this.props.loginGoogle(data)
    if (this.props.error.errorLogin) {
      return (
        this.setState({ login: true, errorLogin: true }),
        this.setAnalyticClevertap("action", "Action_Login_Error", "View_Header_Bar", null)
      )
    }
    else if (this.props.user?.user !== null) {
      await this.props.fetchTermCondition(this.props.user?.user.tokenResponse.accessToken)
      this._handleTermCondition()
      return (
        this.setAnalyticClevertap("action", "Action_Login_Success", "View_Header_Bar", null),
        this.setState({ login: false })
      )
    }
    else if (this.props.user?.user === null) {
      return this.setState({ errorLogin: true }),
        this.setAnalyticClevertap("action", "Action_Login_Error", "View_Header_Bar", null)
    }
  };

  _handleTermCondition = () => {
    if (this.props.dataTermCondition) {
      if (this.props.dataTermCondition.termAndConditionStatus == false) {
        this.setState({ modalTermIsOpen: true });
      } else {
        window.location.reload();
      }
    };
  };

  _handleSignup = async (param) => {
    await this.props.signup(param)
    if (this.props.register !== null) {
      this.setAnalyticClevertap("action", "Action_SignUp_Success", "View_Header_Bar", null)
      this.setState({ signup: false })
    } else {
      this.setAnalyticClevertap("action", "Action_SignUp_Error", "View_Header_Bar", null)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user && this.props.user.user != null) {
      this._getCart(this.props.user.user.userId, this.props.user.user.accessToken)
      this.setState({ isLogin: true })
    }
    if (this.props.path !== prevProps.path) {
      if (this.props.path == '/Landing') {
        this.setState({ onLanding: true })
      } else {
        this.setState({ onLanding: false })
      }
    }
  }

  componentDidMount() {
    if (this.props.path == '/Landing') {
      this.setState({ onLanding: true })
    }
    this.props.initialBlockedLoginStatus();
  }

  async _getCart(userId, accessToken) {
    await this.props.fetchCartByUserId(userId, accessToken);
  }
  handleForgotPassword = async (data) => {
    const response = await this.props.forgotPassword({ email: data })
    if (response != '400') {
      this.setState({ openModalSuccessForgot: true })
    } else {
      this.setState({ openModalFailedForgot: true })
    }
  }

  showApp(title) {
    if (this.state.title !== title) {
      this.setState({ changes: !this.state.changes, title })
    } else if (this.state.title === title) {
      this.setState({ changes: !this.state.changes, title: '' })
    }
  }
  _renderTextTerm(app, title) {
    if (this.state.title === title) {
      return (
        <td style={{ textAlign: 'justify' }} colSpan="3">{app.map((resp) => {
          return (
            <div className="desc-term" style={{ textAlign: 'justify', paddingBottom: '0.5em' }}>{resp.content}</div>
          )
        })}
        </td>
      )
    }
  }
  async _agree() {
    const { dataTermCondition, user } = this.props;
    const version = dataTermCondition.termAndConditionVersion;
    await this.props.fetchUpdateTermCondition(user.user.tokenResponse.accessToken, version);
    this.setState({ modalTermIsOpen: false });
    window.location.reload();
  }
  _renderModalTermCondition = () => {
    return (
      <Strap.Modal
        isOpen={this.state.modalTermIsOpen}
        contentLabel="Example Modal"
        className="widthMaxModalTerm"
      >
        <Strap.ModalHeader>
          <div className="headerTitleTerm">
            Syarat dan Ketentuan
          </div>
        </Strap.ModalHeader>
        <Strap.ModalBody>
          <div>
            {this.props.dataTermCondition ?
              this.props.dataTermCondition.termAndConditionHeader ?
                this.props.dataTermCondition.termAndConditionHeader.map((data) => {
                  return (
                    <table>
                      <tr onClick={() => { return this.showApp(data.title) }} style={{ cursor: 'pointer', color: '#2B2B2B' }}>
                        <td width="100%">
                          <div className="containerDash">
                            <div>
                              <h4 className="title-term">
                                <strong>{data.title}</strong>
                              </h4>
                            </div>
                            <hr className="headerDash" />
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }} width="5%">
                          {this.state.title === data.title ? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"></i>}
                        </td>
                      </tr>
                      <tr >
                        {this._renderTextTerm(data.termAndConditionDetail, data.title)}
                      </tr>
                    </table>
                  )
                })
                :
                null
              :
              null
            }
          </div>
        </Strap.ModalBody>
        <Strap.ModalFooter className="unsetJustCont">
          <Strap.Row style={{ width: '800px' }}>
            <Strap.Col md="9" lg="9">
              <Strap.FormGroup check className="checkbox">
                <Strap.Input className="form-check-input" type="checkbox" id="checkbox1" name="checkbox1" value={this.state.cek} onChange={() => { return this.setState({ cek: !this.state.cek }) }} />
                <Strap.Label check className="form-check-label" htmlFor="checkbox1">Setuju dengan syarat dan ketentuan UT Connect.</Strap.Label>
              </Strap.FormGroup>
            </Strap.Col>
            <Strap.Row md="3" lg="3">
              <Strap.Button
                color="outline-dark"
                style={{ fontFamily: "SFProText-Regular" }}
                onClick={async () => {
                  this.setAnalyticClevertap("action", "Action_TermAndCondition_Disagree", "View_Header_Bar", null);
                  this.setLogout();
                }}
              >Tidak Setuju</Strap.Button>
              <Strap.Button
                color="warning"
                style={{ marginLeft: '1em', fontFamily: "SFProText-Regular" }}
                disabled={!(this.state.cek)}
                onClick={() => {
                  this.setAnalyticClevertap("action", "Action_TermAndCondition_Agree", "View_Header_Bar", null);
                  this._agree();
                }}
              >Setuju</Strap.Button>
            </Strap.Row>
          </Strap.Row>
        </Strap.ModalFooter>
      </Strap.Modal>
    );
  };

  _renderModalForgotPassword = () => {
    return (
      <ModalForgotPassword
        isOpen={this.state.isForgotPassword}
        isClose={() => this.setState({ isForgotPassword: false })}
        onSubmit={(data) => this.handleForgotPassword(data)}
      />
    )
  };

  _renderModalSuccessForgotPassword = () => {
    return (
      <ModalAccessDenied
        isOpen={this.state.openModalSuccessForgot}
        isClose={() => this.setState({ openModalSuccessForgot: false, isForgotPassword: false, login: false })}
        errorText={"Email verifikasi telah dikirimkan ke email kamu, silahkan verifikasi"}
        title={"Hore Selamat..."}
      />
    );
  };

  _renderModalFailedForgotPassword = () => {
    return (
      <ModalAccessDenied
        isOpen={this.state.openModalFailedForgot}
        isClose={() => this.setState({ openModalFailedForgot: false, isForgotPassword: false, login: false })}
        errorText={"Akun email tidak ditemukan, pastikan email sudah benar"}
        title={"Huhu sayang sekali.."}
      />
    );
  };

  _renderModalErrorBucket = () => {
    return (
      <ModalAccessDenied
        isOpen={this.state.openModalBucket}
        isClose={() => this.setState({ openModalBucket: false })}
        errorText={"Keranjang masih kosong coba pilih produk"}
        title={"Huhu sayang sekali.."}
      />
    );
  };

  hanldeIsKlikUT = () => {
    const arr = ["PROMOTION", "NEWS", "VIDEO", "LANDING"];
    const link = this.props.path.toUpperCase();
    var newArr = [];
    for (let i = 0; i < arr.length; i++) {
      const data = {
        status: link.includes(arr[i])
      };
      newArr.push(data);
    };
    var isKlikUT = newArr.filter(item => item.status == true).length;
    if (isKlikUT !== 0) {
      return true;
    } else {
      return false;
    }
  };

  _renderHeaderAfterLogin = () => {
    const chart1 = "data:image/png;base64,";
    return (
      <span className='containerHeaderDefault'>
        <div className='logoHeader'>
          <img src={UTLogoBlack} className='widthimagelogo' onClick={() => this.props.push(MENU.LANDING)} />
          {!this.hanldeIsKlikUT() ?
            <img
              src={klikut}
              className='imgKlikUT'
              style={{ marginTop: '3%', height: '2.4vw' }}
              onClick={() => this.props.push(MENU.HOME)}
            /> :
            <img
              src={logoUTC}
              className='imgKlikUT'
              style={{ marginTop: '2%', height: '2.4vw' }}
              onClick={() => this.props.push(MENU.LANDING)}
            />
          }
        </div>
        <div className='ml-auto headerImageCart'>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <img
              style={{ cursor: "pointer" }}
              src={IconCart}
              className='widthimagelogoCart'
              onClick={() => this.actionBucketList()}
            />
            {this.props.dataCart != null && this.props.dataCart.data.totalCart > 0 ? (
              <div className="totalCart">
                <p className="textTotalCart">{this.props.dataCart.data.totalCart}</p>
              </div>
            ) : null}
          </div>
        </div>
        <div className='headerImageCart'>
          <img
            style={{ cursor: "pointer" }}
            src={IconOrderDefault}
            className='widthimagelogoOrder'
            onClick={() => this.actionOrder()}
          />
        </div>
        <div
          style={{ cursor: "pointer", marginTop: "5px", display: "flex", alignItems: "center" }}
          onClick={() => this.actionLogout()}
        >
          <img src={this.props?.user?.user?.imagePath ? chart1 + this.props?.user?.user?.imagePath : userIcon} alt='profile-icon' className="profileIcon" />
        </div>
      </span>
    )
  }

  _renderHeaderBeforeLogin = () => {
    return (
      <span className='containerHeaderDefault'>
        <div className='logoHeader'>
          <img
            src={UTLogoBlack}
            className='widthimagelogo'
            onClick={() => {
              this.setAnalyticClevertap("click", "Click_LogoUT", "View_Header_Bar", null)
              this.props.push(MENU.LANDING)
            }}
          />
          {!this.hanldeIsKlikUT() ?
            <img
              src={klikut}
              className='imgKlikUT'
              style={{ marginTop: '3%', height: '2.4vw' }}
              onClick={() => this.props.push(MENU.HOME)}
            /> :
            <img
              src={logoUTC}
              className='imgKlikUT'
              style={{ marginTop: '2%', height: '2.4vw' }}
              onClick={() => this.props.push(MENU.LANDING)}
            />
          }
        </div>
        <div className='mr-0 headerImageCart'>
          <div className='buttonSign' style={{ cursor: "pointer" }} onClick={() => this.actionLogin()}>
            <p className='titleSign'>Masuk</p>
          </div>
        </div>
      </span>
    )
  }

  _handleClickItem = (data, type) => {
    if (type === "Brand") {
      this.props.push(MENU.LIST_PRODUCT, { brand: data.name })
    } else if (type === "Category") {
      this.props.push(MENU.LIST_PRODUCT, { category: data.name })
    }
    this.setState({ isMenu: false })
  };

  _showCategory = () => {
    const { isMenu, isBrand, isCategory } = this.state
    const { brandData, categoryData } = this.props;
    return (
      <Modal open={isMenu} onClose={() => this.setState({ isMenu: !isMenu })}>
        <DialogContent className="container-modal-category">
          <div className='rows' style={{ display: 'flex' }}>
            <div className='column' style={{ width: '55%' }}>
              <div className={`continer-text-icon ${isBrand ? 'active' : ''}`} onClick={() => this.setState({ isBrand: true, isCategory: false })}>
                <p className={`button-category ${isBrand ? 'active' : ''}`}>Brand </p>
                <img src={RightArrow} alt='right-arrow' className='img-arrow' />
              </div>
              <div className={`continer-text-icon ${isCategory ? 'active' : ''}`} onClick={() => this.setState({ isCategory: true, isBrand: false })}>
                <p className={`button-category ${isCategory ? 'active' : ''}`}>Parts </p>
                <img src={RightArrow} alt='right-arrow' className='img-arrow' />
              </div>
            </div>
            {(isBrand || isCategory) && <div className='line-category' />}
            <div className='column' style={{ maxHeight: '70vh', maxWidth: '45%', overflowY: 'auto', overflowX: 'hidden' }}>
              {isBrand &&
                brandData && brandData.map((data) => (
                  <div
                    className='container-button-category'
                    onClick={() => this._handleClickItem(data, "Brand")}
                  >
                    <img className='img-category' src={data.imageUrl} alt={data.description} key={data.id} />
                  </div>
                ))
              }
              {isCategory &&
                categoryData?.data.map((data) => (
                  <span
                    onClick={() => this._handleClickItem(data, "Category")}
                    className="categoryPartList"
                  >{data.name}</span>
                ))
              }
            </div>

          </div>
        </DialogContent>
      </Modal>
    )
  }

  _renderModalLogout = () => {
    return (
      <Modal className='modal-del-wishlist' open={this.state.modalLogout} onClose={() => this.setState({ modalLogout: false })}>
        <DialogContent className='container-modal-del-wishlist'>
          <div className='del-modal-body'>
            <p className='titleUpload'>Kamu Yakin?</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={IconAsk} className='iconModal' />
            </div>
            <p className='titleAvailable'>Kamu akan keluar dari halaman ini</p>
            <div className='header-button-upload'>
              <div className='cardCancel' onClick={() => this.setState({ modalLogout: false })}>
                <p className='textBuy'>Kembali</p>
              </div>
              <div className='cardSubmit' onClick={() => this.setLogout()} style={{ cursor: "pointer" }}>
                <p className='textBuy'>Lanjutkan</p>
              </div>
            </div>
            <p className='mt-4 title-contact'>Butuh informasi tambahan? Kontak kami</p>
            <div className='container-footer-contact'>
              <img className='marginIcon' src={IconUTCall} alt='ut-call-icon' />
              <img src={IconMail} alt='mail-icon'
                style={{ cursor: "pointer" }}
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

  render() {
    return (
      <React.Fragment>
        <div className='containerHeader' style={{ zIndex: 1020 }}>
          {this.state.isLogin ? (
            this._renderHeaderAfterLogin()
          ) : this._renderHeaderBeforeLogin()}
          {this._showCategory()}
        </div>
        <ModalLogin
          isOpen={this.state.login}
          isClose={() => this.setState({ login: false })}
          isSignUp={this.actionSignUp}
          login={this._handleLogin}
          loginGoogle={this._handleLoginGoogle}
          isLoading={this.props.isLoading}
          error={this.state.errorLogin}
          isForgot={this.actionForgot}
          isVerify={this.actionVerify}
          blocked={this.props.lock_login}
          timer={this.props.timer_lock}
        />
        <ModalSignUp
          isOpen={this.state.signup}
          isClose={() => this.setState({ signup: false })}
          isSuccessSignUp={this.actionSuccessSignUp}
          isLogin={this.actionSignUp}
          handleSignup={this._handleSignup}
          isLoading={this.props.isLoading}
          loginGoogle={this._handleLoginGoogle}
        />
        <ModalSuccessSignUp
          isOpen={this.state.successsignup}
          isClose={() => this.setState({ successsignup: false })}
          isSuccessSignUp={this.actionSuccessFinalSignUp}
        />
        {this._renderModalLogout()}
        {this._renderModalProfile()}
        {this._renderModalTermCondition()}
        {this._renderModalForgotPassword()}
        {this._renderModalVerifyCode()}
        {this._renderModalNewPassword()}
        {this._renderModalSuccessForgotPassword()}
        {this._renderModalFailedForgotPassword()}
        {this._renderModalErrorBucket()}
      </React.Fragment>
    );
  }
}
export default DefaultHeader;
