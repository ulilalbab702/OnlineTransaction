import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Button, Input } from "reactstrap";
import "./style/index.scss";
import { imageNotFound, Promotion } from "assets/images";
import { IconShort, IconShortActive, IconCalendar, IconDenied, IconUTCall, IconMail, IconSuccess } from "assets/icons";
import { InputBase } from "@material-ui/core";
import Skeleton from "react-loading-skeleton";
import * as Utils from "utils/dateTime.helper";
import firebase from "../../firebase/firebase";
import ModalLogin from "./../../components/ModalLogin/ModalLogin";
import { DialogContent, Modal } from "@material-ui/core";
import { MENU } from "constants/menu";
import ModalAccessDenied from "components/ModalAccessDenied/ModalAccessDenied";
import ModalSignUp from "components/ModalSignUp/ModalSignUp";
import ModalVerifyCode from "../../components/ModalVerifyCode/ModalVerifyCode";
import ModalForgotPassword from "../../components/ModalForgotPassword/ModalForgotPassword";
import ModalNewPassword from "components/ModalNewPassword/ModalNewPassword";
import moment from "moment";

const idleTimeout = 1800000; // 30 menit
let failedCount = 0;
let loginLocked = false;
let timer = {
  minute: 0,
  second: 10,
};
let interval;

const PromotionPage = (props) => {
  const [keyword, setKeyword] = useState("");
  const [businessTypeId, setBusinessTypeId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [tabHeader, selectHeader] = useState("");
  const [screenWidth, setScreen] = useState(null);
  const [promotionList, setPromotionList] = useState(null);
  const [tab, setTab] = useState(1);
  const [header, setHeader] = useState([
    {
      attributeId: "",
      attributeValue: "Semua",
      attributeDescription: "Semua",
      groups: [],
    },
  ]);

  const [login, setLogin] = useState(false);
  const [verify, setVerify] = useState(false);
  const [forgotPass, setForgotPass] = useState(false);
  const [isPassword, setPassword] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [denied, setDenied] = useState(false);
  const [successSignup, setSuccessSignup] = useState(false);
  const [failedSignup, setFailedSignup] = useState(false);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(null);
  const [openModalErrorAr, setOpenModalErrorAr] = useState(false);
  const [openModalSuccessForgot, setOpenModalSuccessForgot] = useState(false);
  const [openModalFailedForgot, setOpenModalFailedForgot] = useState(false);
  const [voucherList, setVoucherList] = useState(null);

  const [loginLock, setloginLock] = useState(true);
  const [timerDisplay, setTimerDisplay] = useState({ minute: 0, second: 10 });

  const setAnalyticClevertap = (action, event, screen, product) => {
    if (props.user) {
      const { userName } = props.user;
      if (product !== null) {
        window.clevertapEventProduct(`${product[0] + "_LogedIn"}`, product[1]);
      } else {
        window.clevertapEvent(`${event + "_LogedIn"}`, props.user);
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

  useEffect(() => {
    setAnalyticClevertap("view", "View_Promotion_Screen", "View_Promotion_Screen", null);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (props.user !== null) {
      localStorage.setItem("CUSTOMER", props.user?.user);
      const startDate = moment(new Date());
      const endDate = moment(new Date()).add(idleTimeout / 1000, "second");
      localStorage.setItem("idleTimeoutThreshold", JSON.stringify({ startDate: startDate, endDate: endDate }));
      window.clevertapEvent("LOGIN_SUCCESS", props.user);
      firebase.analytics().logEvent("Login_Success");
      firebase.analytics().setUserProperties("view", "Login_Success");
      setLogin(false);
    } else if (props.error.errorLogin) {
      localStorage.setItem("loginTimer", JSON.stringify({ minute: 0, second: 0 }));
      setDenied(true);
    }
  }, [props.user, props.error.errorLogin]);

  useEffect(() => {
    if (props.register !== null) {
      setSignUp(false);
      setLogin(false);
      setSuccessSignup(true);
    }
  }, [props.register]);

  useEffect(() => {
    if (props.error.errorLogin.message && props.error.errorLogin.message !== null) {
      failedCount++;
      let failed_login_counter = props.failed_count + 1;
      props.countFailedLogin(failed_login_counter);
      if (failed_login_counter > 2) {
        setloginLock(true);
        props.blockLogin();
        let now = new Date();
        localStorage.setItem("loginLocked", String(true));
        localStorage.setItem("loginLockedDateTime", now.toString());
        localStorage.setItem("loginTimer", JSON.stringify({ minute: 0, second: 10 }));
        props.countDownTimerLock({ minute: 0, second: 10 });
        startTimer();
      }
    }
  }, [props.error.errorLogin]);

  useEffect(() => {
    if (props.errorRegister !== null) {
      setFailedSignup(true);
    }
  }, [props.errorRegister]);

  const handleDenied = () => {
    setDenied(false);
    localStorage.clear();
    props.clearError();
  };

  useEffect(() => {
    const { user } = props;
    if (user) {
      async function fetchVoucher() {
        await props.fetchVoucherList(user.tokenResponse.accessToken);
      }
      fetchVoucher();
    }
  }, [tab]);
  useEffect(() => {
    if (props.voucherData !== null) {
      setVoucherList(props.voucherData);
    }
  }, [props.voucherData]);

  useEffect(() => {
    const { user } = props;
    if (user) {
      async function fetchPromotionHeader() {
        const response = await props.fetchPromotionHeader(user.tokenResponse.accessToken);
        if (response != "400" && response != null) {
          setHeader(header.concat(response));
        }
      }
      fetchPromotionHeader();
    }
  }, []);
  useEffect(() => {
    async function fetchData() {
      const response = await props.fetchPromotionList(businessTypeId, groupId, page, sorting, pageSize);
      if (response != "400" && response != null) {
        setPromotionList(response);
      }
    }
    fetchData();
  }, [page, businessTypeId, groupId]);

  useEffect(() => {
    window.addEventListener("resize", resize.bind(this));
    resize();
  });

  const resize = () => {
    setScreen(window.innerWidth);
  };

  useEffect(() => {
    window.removeEventListener("resize", resize.bind(this));
  });

  const sendPromotion = (promotionId, imageUrl) => {
    const img = imageUrl.replaceAll("/", ",");
    const img2 = img.replaceAll("?", "|");
    props.history.push(`/Landing/Promotion/${promotionId}/${img2}`, { id: promotionId, image: imageUrl });
  };
  const sendVoucher = (voucherId, imageUrl) => {
    const img = imageUrl.replaceAll("/", ",");
    const img2 = img.replaceAll("?", "|");
    props.history.push(`${MENU.DETAILVOUCHER}/${voucherId}/${img2}`);
  };

  const _renderPromoNotFound = () => {
    return (
      <div className='con-promo-notfound'>
        <img className='img-promo-notfound' src={imageNotFound} />
        <p className='teks-promo-notfound'>Tidak bisa menemukan promosi</p>
      </div>
    );
  };

  const _renderFilterPromotion = () => {
    return (
      <Row className='rowTab'>
        <Col style={{ display: "flex" }}>
          {header.map((item) => {
            return (
              <div
                className='tabPromotion'
                onClick={() => {
                  setAnalyticClevertap("click", "Click_PromotionFilter", "View_Promotion_Screen", [
                    "Click_PromotionFilter",
                    { Filter_By: item.attributeDescription },
                  ]);
                  selectHeader(item.attributeDescription);
                  setBusinessTypeId(item.attributeId);
                }}
                style={
                  tabHeader === item.attributeDescription
                    ? { borderBottom: "5px solid #ffd500" }
                    : { cursor: "pointer" }
                }
              >
                <h5 className='textTab'>{item.attributeDescription}</h5>
              </div>
            );
          })}
        </Col>
      </Row>
    );
  };
  const _renderHeaderCard = () => {
    return header.map((item, i) => {
      if (item.attributeId === businessTypeId) {
        return <div key={i}>{_renderArray(item.groups)}</div>;
      }
    });
  };

  const _renderArray = (data) => {
    if (data.length > 0) {
      data.map((item) => {
        return (
          <div
            className='col-1 cardnewSubMenu'
            onClick={() => {
              setGroupId(data.groupId)
            }}
          >
            {item.groupName}
          </div>
        );
      })
    }
  };


  const handlePage = (number) => {
    if (page !== number) {
      setAnalyticClevertap("click", "Click_PaginationPromotion_Number", "View_Promotion_Screen", [
        "Click_PaginationPromotion_Number",
        { Page_Number: number },
      ]);
      setPage(number);
    }
  };
  const _renderPagination = () => {
    const arr = [];
    for (let i = 1; i <= promotionList.totalPageCount; i++) {
      const newArr = { num: i };
      arr.push(newArr);
    }
    return (
      <div className='con-pagination'>
        {promotionList.hasPreviousPage && (
          <span
            className='paging'
            onClick={() => {
              setAnalyticClevertap("click", "Click_PaginationPromotion_Previous", "View_Promotion_Screen", [
                "Click_PaginationPromotion_Previous",
                { Page_Number: page - 1 },
              ]);
              setPage(page - 1);
            }}
          >
            {"<"}
          </span>
        )}
        {arr &&
          arr.map((item) => (
            <span onClick={() => handlePage(item.num)} className={item.num == page ? "paging active" : "paging"}>
              {item.num}
            </span>
          ))}
        {promotionList.hasNextPage && (
          <span
            className='paging'
            onClick={() => {
              setAnalyticClevertap("click", "Click_PaginationPromotion_Next", "View_Promotion_Screen", [
                "Click_PaginationPromotion_Next",
                { Page_Number: page + 1 },
              ]);
              setPage(page + 1);
            }}
          >
            {">"}
          </span>
        )}
      </div>
    );
  };

  const _renderListPromotion = () => {
    if (props.loading && screenWidth > 900) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Skeleton style={{ margin: 10 }} count={3} height={300} width={330} />
          <Skeleton style={{ margin: 10 }} count={3} height={300} width={330} />
        </div>
      );
    } else if (props.loading && screenWidth >= 760 && screenWidth < 900) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Skeleton style={{ margin: 10 }} count={2} height={300} width={330} />
          <Skeleton style={{ margin: 10 }} count={2} height={300} width={330} />
        </div>
      );
    } else if (props.loading && screenWidth < 760) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Skeleton style={{ margin: 10 }} count={1} height={300} width={280} />
          <Skeleton style={{ margin: 10 }} count={1} height={300} width={280} />
          <Skeleton style={{ margin: 10 }} count={1} height={300} width={280} />
        </div>
      );
    } else if (promotionList != null) {
      return (
        <>
          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <Row className='gridListPromo'>
              {promotionList?.data.map((item) => {
                return (
                  <div className='cardListPromotion'>
                    <Col>
                      <img className='imageListPromotion' src={item.imageUrl} />
                      <p className='titleProduct'>{item.promotionName}</p>
                      <Row>
                        <img className='imageCalendar' style={{ marginRight: 25 }} src={IconCalendar} />
                        <Row>
                          <p className='titleKategoriProduct'>Periode Promo :</p>
                          <p className='boldPeriode'>{Utils.convertToDay(item.validUntil)}</p>
                        </Row>
                      </Row>
                      <p
                        className='seeDetailPromotion'
                        onClick={() => {
                          setAnalyticClevertap("click", "Click_PromotionDetail", "View_Promotion_Screen", [
                            "Click_PromotionDetail",
                            { Promotion_Name: item.promotionName },
                          ]);
                          sendPromotion(item.promotionId, item.imageUrl);
                        }}
                      >
                        Lihat Detail
                      </p>
                    </Col>
                  </div>
                );
              })}
            </Row>
          </div>
          {_renderPagination()}
        </>
      );
    } else {
      return _renderPromoNotFound();
    }
  };

  const _renderListVoucher = () => {
    if (props.voucherLoading && screenWidth > 900) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Skeleton style={{ margin: 10 }} count={3} height={300} width={330} />
          <Skeleton style={{ margin: 10 }} count={3} height={300} width={330} />
        </div>
      );
    } else if (props.voucherLoading && screenWidth >= 760 && screenWidth < 900) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Skeleton style={{ margin: 10 }} count={2} height={300} width={330} />
          <Skeleton style={{ margin: 10 }} count={2} height={300} width={330} />
        </div>
      );
    } else if (props.voucherLoading && screenWidth < 760) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Skeleton style={{ margin: 10 }} count={1} height={300} width={280} />
          <Skeleton style={{ margin: 10 }} count={1} height={300} width={280} />
          <Skeleton style={{ margin: 10 }} count={1} height={300} width={280} />
        </div>
      );
    } else if (voucherList != null) {
      return (
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <Row className='gridListPromo'>
            {voucherList?.data.map((item) => {
              return (
                <div className='cardListPromotion'>
                  <Col>
                    <img className='imageListPromotion' src={item.image} />
                    <p className='titleProduct'>{item.title}</p>
                    <Row>
                      <img className='imageCalendar' style={{ marginRight: 25 }} src={IconCalendar} />
                      <Row>
                        <p className='titleKategoriProduct'>Periode Promo :</p>
                        <p className='boldPeriode'>{Utils.convertToDay(item.promoEnd)}</p>
                      </Row>
                    </Row>
                    <p className='seeDetailPromotion' onClick={() => sendVoucher(item.id, item.image)}>
                      Lihat Detail
                    </p>
                  </Col>
                </div>
              );
            })}
          </Row>
        </div>
      );
    }
  };

  const _handleTab = (tab) => {
    const { user } = props;
    if (tab === 2) {
      if (user) {
        setTab(2);
      } else {
        setLogin(true);
      }
    } else {
      setTab(1);
    }
  };
  const _renderTab = () => {
    const tabData = [{ value: 1, text: "List Promosi" }];
    return (
      <div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {tabData.map((td) => (
            <div className='conTitlePromotionActive' style={{ cursor: "default" }} onClick={() => _handleTab(td.value)}>
              <h3 className='styleTitlePromotion'>{td.text}</h3>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const startTimer = () => {
    interval = setInterval(() => {
      timer = JSON.parse(localStorage.getItem("loginTimer"));
      if (timer.minute > 0 || timer.second > 0) {
        if (timer.second > 0) {
          timer.second--;
        } else {
          timer.minute--;
          timer.second = 59;
        }
        localStorage.setItem("loginTimer", JSON.stringify(timer));
        props.countDownTimerLock(timer);
      } else {
        timer = {
          minute: 0,
          second: 10,
        };
        loginLocked = false;
        localStorage.setItem("loginTimer", JSON.stringify(timer));
        localStorage.setItem("loginLocked", String(false));
        setloginLock(false);
        props.releaseBlockedLogin();
        endTimer();
      }
    }, 1000);
  };

  const endTimer = () => {
    clearInterval(interval);
  };

  const _handleLogin = async (data) => {
    await props.login(data);
  };
  const actionSignUp = (_signup, _login) => {
    setSignUp(_signup);
    setLogin(_login);
  };
  const actionVerify = (_verify, _login) => {
    setVerify(_verify);
    setLogin(_login);
  };
  const actionForgot = (param) => {
    setForgotPass(param);
  };
  const _handleSignup = async (param) => {
    await props.signup(param);
  };
  const _handleVerify = async (code) => {
    setCode(code);
    const data = await props.verifyCode({ token: code });
    if (data === 200) {
      setPassword(true);
      setMessage(null);
      setVerify(false);
    } else {
      setMessage(data);
    }
  };
  const actionSetPassword = async (data) => {
    let param = {
      token: code,
      applicationId: process.env.REACT_APP_APPLICATION_ID,
      password: data.newPassword,
    };
    const response = await props.changePassword(param);
    if (response === 200) {
      setPassword(false);
    }
  };
  const _renderModalNewPassword = () => {
    return (
      <ModalNewPassword isOpen={isPassword} isClose={() => setPassword(false)} handleNewPassword={actionSetPassword} />
    );
  };

  const _renderModalDenied = () => {
    return (
      <Modal open={denied} onClose={() => setDenied(false)} className='modal-container'>
        <DialogContent className='container-modal-denied'>
          <div className='container-denied'>
            <p className='title-denied'>Huhu sayang sekali...</p>
            <img src={IconDenied} alt='denied-icon' className='iconModal' />
            <p className='mt-2 title-message'>Kamu tidak dapat mengakses laman ini </p>

            <div className='btn-confirm-denied' onClick={() => handleDenied()}>
              <p className='title-confirm'>OK</p>
            </div>
            <p className='title-contact'>Butuh informasi tambahan? Kontak kami</p>
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

  const _renderModalSuccess = () => {
    return (
      <Modal open={successSignup} onClose={() => setSuccessSignup(false)} className='modal-container'>
        <DialogContent className='container-modal-denied'>
          <div className='container-denied'>
            <p className='title-denied'>Hore Selamat...</p>
            <img src={IconSuccess} alt='denied-icon' className='iconModal' />
            <p className='title-message'>Email verifikasi telah dikirimkan ke email kamu, silahkan verifikasi</p>
            <div className='btn-confirm-denied' onClick={() => setSuccessSignup(false)}>
              <p className='title-confirm'>OK</p>
            </div>
            <p className='title-contact'>Butuh informasi tambahan? Kontak kami</p>
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

  const _renderModalSignfail = () => {
    return (
      <Modal open={failedSignup} onClose={() => setFailedSignup(false)} className='modal-container'>
        <DialogContent className='container-modal-denied'>
          <div className='container-denied'>
            <p className='title-denied'>Huhu sayang sekali...</p>
            <img src={IconDenied} alt='denied-icon' className='iconModal' />
            <p className='title-message'>Registrasi kamu gagal, silahkan coba kembali</p>
            <div className='btn-confirm-denied' onClick={() => setFailedSignup(false)}>
              <p className='title-confirm'>OK</p>
            </div>
            <p className='title-contact'>Butuh informasi tambahan? Kontak kami</p>
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

  const _renderModalLogin = () => {
    return (
      <ModalLogin
        isOpen={login}
        isClose={() => setLogin(false)}
        login={_handleLogin}
        isSignUp={actionSignUp}
        isVerify={actionVerify}
        isForgot={actionForgot}
        isLoading={props.isLoading}
        error={props.error.errorLogin}
        blocked={props.lock_login}
        timer={props.timer_lock}
      />
    );
  };
  const _renderModalSignup = () => {
    return (
      <ModalSignUp
        isOpen={signUp}
        isClose={() => setSignUp(false)}
        handleSignup={_handleSignup}
        isLogin={actionSignUp}
        isLoading={props.isLoading}
      />
    );
  };
  const _renderModalVerifyCode = () => {
    return (
      <ModalVerifyCode
        isOpen={verify}
        isClose={() => setVerify(false)}
        onSubmit={_handleVerify}
        resendCode={actionForgot}
        errorVerify={message}
      />
    );
  };
  const handleForgotPassword = async (data) => {
    const response = await props.forgotPassword({ email: data });
    if (response != "400") {
      setOpenModalSuccessForgot(true);
    } else {
      setOpenModalFailedForgot(true);
    }
  };
  const _renderModalForgotPassword = () => {
    return (
      <ModalForgotPassword
        isOpen={forgotPass}
        isClose={() => setForgotPass(false)}
        onSubmit={handleForgotPassword}
        errorMessage={props.errorForgot}
      />
    );
  };
  const _renderModalErrorAr = () => {
    return (
      <ModalAccessDenied
        isOpen={openModalErrorAr}
        isClose={() => _clickOk()}
        errorText={"Kami tidak dapat melanjutkan proses pembayaran, silahkan coba kembali"}
        title={"Huhu sayang sekali..."}
      />
    );
  };
  const _renderModalSuccessForgotPassword = () => {
    return (
      <ModalAccessDenied
        isOpen={openModalSuccessForgot}
        isClose={() => _clickSuccessFortgot()}
        errorText={"Email verifikasi telah dikirimkan ke email kamu, silahkan verifikasi "}
        title={"Hore Selamat..."}
      />
    );
  };

  const _renderModalFailedForgotPassword = () => {
    return (
      <ModalAccessDenied
        isOpen={openModalFailedForgot}
        isClose={() => _clickFailedFortgot()}
        errorText={"Akun email tidak ditemukan, pastikan email sudah benar"}
        title={"Huhu sayang sekali..."}
      />
    );
  };
  const _clickOk = () => {
    setOpenModalErrorAr(false);
    localStorage.setItem("CUSTOMER", props.user?.user);
    localStorage.setItem("CUSTOMER", props.user?.user);
    const startDate = moment(new Date());
    const endDate = moment(new Date()).add(idleTimeout / 1000, "second");
    localStorage.setItem("idleTimeoutThreshold", JSON.stringify({ startDate: startDate, endDate: endDate }));
    window.clevertapEvent("LOGIN_SUCCESS", props.user);
    firebase.analytics().logEvent("Login_Success");
    firebase.analytics().setUserProperties("view", "Login_Success");
    props.push(MENU.LANDING);
  };
  const _clickSuccessFortgot = () => {
    setOpenModalSuccessForgot(false);
    setForgotPass(false);
    setLogin(false);
  };
  const _clickFailedFortgot = () => {
    setOpenModalFailedForgot(false);
    setForgotPass(false);
    setLogin(false);
  };

  return (
    <div className='containerPromotion'>
      <Row style={{ marginRight: "0" }}>
        <Col className='containerMargin'>
          {_renderTab()}
          {_renderFilterPromotion()}
          {_renderHeaderCard()}
          {_renderListPromotion()}
        </Col>
      </Row>
      {_renderModalLogin()}
      {_renderModalSignup()}
      {_renderModalDenied()}
      {_renderModalSuccess()}
      {_renderModalSignfail()}
      {_renderModalVerifyCode()}
      {_renderModalForgotPassword()}
      {_renderModalNewPassword()}
      {_renderModalErrorAr()}
      {_renderModalSuccessForgotPassword()}
      {_renderModalFailedForgotPassword()}
    </div>
  );
};
export default PromotionPage;
