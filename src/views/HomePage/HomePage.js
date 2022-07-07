import React, { useEffect, useState } from "react";
import "./style/index.scss";
import { Row, Col } from "reactstrap";
import {
  IconPlayStoreNew,
  IconAppStoreNew,
  IconDenied,
  IconUTCall,
  IconMail,
  IconSuccess,
  PlayBtn,
  IconEM,
  IconTicket,
  IconOrder,
  IconCartYellow,
  IconArrowDown,
  IconService,
  IconUnitOT,
  IconNotifYellow,
} from "assets/icons";
import firebase from "../../firebase/firebase";
import { bgFeature } from "assets/images";
import ModalLogin from "./../../components/ModalLogin/ModalLogin";
import { DialogContent, Modal } from "@material-ui/core";
import { MENU } from "constants/menu";
import ModalSignUp from "components/ModalSignUp/ModalSignUp";
import ModalVerifyCode from "../../components/ModalVerifyCode/ModalVerifyCode";
import ModalForgotPassword from "../../components/ModalForgotPassword/ModalForgotPassword";
import ModalNewPassword from "components/ModalNewPassword/ModalNewPassword";
import ModalAccessDenied from "components/ModalAccessDenied/ModalAccessDenied";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import OwlCarousel from "react-owl-carousel";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import parse from "html-react-parser";
import * as Strap from "reactstrap";

const idleTimeout = 1800000; // 30 menit
let failedCount = 0;
let loginLocked = false;
let timer = {
  minute: 0,
  second: 10,
};
let interval;
const HomePage = (props) => {
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
  const [openModalErrorUserOneTimes, setOpenModalErrorUserOneTimes] = useState(false);
  const [screenWidth, setScreen] = useState(window.innerWidth);
  const [loginLock, setloginLock] = useState(true);
  const [timerDisplay, setTimerDisplay] = useState({ minute: 0, second: 10 });
  const [listFitur, setListFitur] = useState([]);
  const [isSeeMore, setIsSeemore] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [remainingFitur, setRemainingFitur] = useState(null);
  const [featureUrl, setFeatureUrl] = useState("");
  const [modalTermIsOpen, setModalTermIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [changes, setChanges] = useState(false);
  const [cek, setCek] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await props.fetchImageslider();
      await props.fetchListNews("", 5, 1);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchVideo() {
      await props.fetchGetAllVideo(1, 10);
    }
    fetchVideo();
  }, []);
  useEffect(() => {
    if (props.videoData !== null) {
      setVideoData(props.videoData.data.filter(vid => vid.status == true));
    }
  }, [props.videoData]);

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

  const handleDenied = () => {
    setDenied(false);
    localStorage.clear();
    props.clearError();
  };
  const _renderModalDenied = () => {
    return (
      <Modal open={denied} onClose={() => setDenied(false)} className='modal-container'>
        <DialogContent className='container-modal-denied'>
          <div className='container-denied'>
            <p className='title-denied'>Huhu sayang sekali...</p>
            <img src={IconDenied} alt='denied-icon' className='iconModal' />
            <p className='mt-2 title-message'>
              Kamu tidak dapat mengakses laman ini{" "}
            </p>

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

  const _renderModalErrorUserOneTimes = () => {
    return (
      <ModalAccessDenied
        isOpen={openModalErrorUserOneTimes}
        isClose={() => setOpenModalErrorUserOneTimes(false)}
        errorText={"Kamu tidak dapat mengakses laman ini"}
        title={"Huhu sayang sekali..."}
      />
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
            <p className='title-message'>
              Registrasi kamu gagal, silahkan coba kembali
            </p>
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
  useEffect(() => {
    setAnalyticClevertap("view", "View_Landing_Screen", "View_Landing_Screen", null);
    window.scrollTo(0, 0);
  }, []);

  const _renderHomeFooter = () => {
    return (
      <div className='containerFooter' >
        <p className='textHomeFooter'>Download UT Connect </p>
        <table className='iconHomeFooter'>
          <tr>
            <td>
              <a
                onClick={() => setAnalyticClevertap("click", "Click_DownloadUTConnect", "View_Landing_Screen", ["Click_DownloadUTConnect", { "Download_From": "Apps Store" }])}
                href='https://apps.apple.com/id/app/united-tractors-mobile-app/id1459956543'
                target="_blank"
              >
                <img src={IconAppStoreNew} className='iconDownloadAS' />
              </a>
            </td>
            <td>
              <a
                onClick={() => setAnalyticClevertap("click", "Click_DownloadUTConnect", "View_Landing_Screen", ["Click_DownloadUTConnect", { "Download_From": "Google Play Store" }])}
                href='https://play.google.com/store/apps/details?id=com.unitedtractors.customer_portal&hl=en&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'
                target="_blank"
              >
                <img alt='Get it on Google Play' src={IconPlayStoreNew} className='iconDownloadPS' />
              </a>
            </td>
          </tr>
        </table>
      </div>
    );
  };

  const sendPromotion = (promotionId, imageUrl) => {
    const img = imageUrl.replaceAll('/', ',');
    const img2 = img.replaceAll('?', '|');
    props.history.push(`/Landing/Promotion/${promotionId}/${img2}`);
  };
  const _renderImageSlider = () => {
    if (props.loadingPromo && screenWidth > 900) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Skeleton style={{ margin: 10 }} count={1} height={400} width={800} />
        </div>
      );
    } else if (props.loadingPromo && screenWidth >= 760 && screenWidth < 900) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Skeleton style={{ margin: 10 }} count={1} height={200} width={300} />
        </div>
      );
    } else if (props.loadingPromo && screenWidth < 760) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Skeleton style={{ margin: 10 }} count={1} height={200} width={300} />
        </div>
      );
    } else if (!props.imageSlider || props.imageSlider?.length === 0) {
      return null;
    } else if (props.imageSlider != null) {
      return (
        <div style={{ margin: '0 6rem', display: 'flex', flexDirection: 'column' }}>
          <OwlCarousel
            autoplayTimeout={5000}
            autoplaySpeed={1000}
            className="carouselPromotion"
            dots={true}
            dotsClass={'conDotsLanding'}
            dotClass={'dotsLanding'}
            navContainerClass={'owl-nav-landing'}
            loop={true}
            items={2.4}
            center={true}
            nav={true}
            autoplay={true}
            navText={
              [
                '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
                "<i class='fa fa-chevron-right'></i>",
              ]
            }>
            {(props.imageSlider.data || props.imageSlider).map((item) => {
              return (
                <div
                  style={{ margin: '0 30px', cursor: 'pointer' }}
                  onClick={() => {
                    setAnalyticClevertap("click", "Click_PromotionDetail", "View_Landing_Screen", ["Click_PromotionDetail", { "Promotion_Id": item.promotionId }]);
                    sendPromotion(item.promotionId, item.imageUrl)
                  }}
                >
                  <img className="imgSliderLanding" style={{ borderRadius: "15px" }} src={item.imageUrl} />
                </div>
              );
            })}
          </OwlCarousel>
          <span
            className="viewAllLanding"
            onClick={() => {
              setAnalyticClevertap("click", "Click_SeeMorePromotion", "View_Landing_Screen", null);
              props.push(MENU.PROMOTION)
            }}
          >Lihat Lainnya</span>
        </div>
      );
    }
  };


  useEffect(() => {
    async function fetchFitur() {
      await props.fetchGetFiturUTConnect();
    }
    fetchFitur();
  }, [])

  useEffect(() => {
    if (props.dataFitur) {
      if (props.dataFitur.length > 6) {
        setIsSeemore(true)
        const fitur = props.dataFitur.splice(0, 6)
        setListFitur(fitur)
        setRemainingFitur(props.dataFitur.splice(0, props.dataFitur.length))
      } else {
        setListFitur(props.dataFitur)
        setIsSeemore(false)
      }
    }
  }, [props.dataFitur])

  const _handleSeeMore = () => {
    setAnalyticClevertap("click", "Click_SeeMoreFeatureUTConnect", "View_Landing_Screen", null);
    if (remainingFitur.length > 3) {
      const fitur = remainingFitur.splice(0, 3)
      fitur.forEach(f => listFitur.push(f));
      setRemainingFitur(remainingFitur.splice(0, remainingFitur.length))
    } else {
      remainingFitur.forEach(f => listFitur.push(f));
      setIsSeemore(false)
    }
  }

  const _handleClickFeature = (name, url) => {
    setFeatureUrl("");
    const { user } = props;
    if (name.toUpperCase().includes("KLIK")) {
      props.push(MENU.HOME);
    } else {
      if (user) {
        if (user.customerCode !== "ONETIMESTD") {
          window.open(url, '_self');
        } else {
          setOpenModalErrorUserOneTimes(true)
        }
      } else {
        setFeatureUrl(url);
        setLogin(true);
      }
    }
  };

  const _renderPartTransactionOnline = () => {
    if (!listFitur || listFitur?.length === 0) {
      return null;
    } else {
      return (
        <div style={{ marginTop: '2rem' }}>
          <h2
            className="titleLanding"
            style={{ marginTop: 0 }}
          >Tentang UT CONNECT</h2>
          <p className="textLanding">UT Connect adalah aplikasi yang dikembangkan untuk memberikan layanan terbaik bagi pelanggan United Tractors</p>
          <hr className="lineYellow" />
          <div className="con-fitur-list">
            {listFitur.map((fitur, index) => (
              <div className="cardPart" style={{ background: `url(${bgFeature})` }} key={index}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: '100%', width: '100%' }}>
                  <div className="borderPart1" />
                  <div className="borderPart2" />
                  <div className="borderPart3" />
                </div>
                <div className="conColor" />
                <div className="decsPart">
                  <img src={fitur.icon} style={{ height: '3.6vw', width: 'auto', margin: '0 auto' }} />
                  <h5>{fitur.name}</h5>
                  <h6>{fitur.description}</h6>
                  <span
                    className="descBtn"
                    onClick={() => {
                      setAnalyticClevertap("click", "Click_FeatureUTConnect", "View_Landing_Screen", ["Click_FeatureUTConnect", { "Feature_Name": fitur.name }])
                      _handleClickFeature(fitur.name, fitur.url)
                    }}
                  >Masuk</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex' }}>
            {isSeeMore ?
              <span
                className="see-more-fitur"
                onClick={() => _handleSeeMore()}
              >Lihat Lebih Banyak</span>
              : null}
          </div>
        </div>
      );
    };
  };

  const _renderHighlight = () => {
    if (!videoData || videoData?.length === 0) {
      return null;
    } else {
      return (
        <div>
          <h2 className="titleLanding">HIGHLIGHT VIDEO</h2>
          <p className="textLanding">Beragam video menarik yang membahas seputar tips untuk unit dan lainnya</p>
          <hr className="lineYellow" />
          {videoData &&
            <div style={{ display: 'flex', flexDirection: 'row', margin: '0 6rem', width: 'auto', height: 'auto' }}>
              <div style={{ width: '63%' }}>
                <img
                  className="video-left"
                  src={videoData[0].imageThumbnailUrl}
                  onClick={() => {
                    setAnalyticClevertap("click", "Click_HighlightVideo", "View_Landing_Screen", ["Click_HighlightVideo", { "Video_Name": videoData[0].title }]);
                    props.push(`${MENU.DETAIL_VIDEO}/${videoData[0].id}`)
                  }}
                />
                <img src={PlayBtn} style={{ width: '10%', marginLeft: '-55%', position: 'relative' }} />
              </div>
              <div style={{ width: '5%' }} />
              <div className="conVideoScroll">
                {videoData.map((vid, index) => (
                  <img
                    key={index}
                    src={vid.imageThumbnailUrl}
                    style={{ width: '100%', height: '15vw', objectFit: 'cover', borderRadius: 10, marginBottom: 20, cursor: 'pointer' }}
                    onClick={() => {
                      setAnalyticClevertap("click", "Click_HighlightVideo", "View_Landing_Screen", ["Click_HighlightVideo", { "Video_Name": vid.title }]);
                      props.push(`${MENU.DETAIL_VIDEO}/${vid.id}`);
                    }}
                  />
                ))}
              </div>
            </div>
          }
          <div
            className='containerNewsPromo'
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: 40,
              backgroundColor: '#FFFFFF'
            }}
          >
            <span
              className="viewAllLanding"
              onClick={() => {
                setAnalyticClevertap("click", "Click_SeeMoreVideo", "View_Landing_Screen", null);
                props.push(MENU.LIST_VIDEO)
              }}
            >Lihat Lainnya</span>
          </div>
        </div>
      );
    }
  };

  const _renderNewsArticle = () => {
    if (props.loadingNews && screenWidth > 900) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Skeleton style={{ margin: 10 }} count={4} height={200} width={150} />
        </div>
      );
    } else if (props.loadingNews && screenWidth >= 760 && screenWidth < 900) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Skeleton style={{ margin: 10 }} count={4} height={200} width={160} />
        </div>
      );
    } else if (props.loadingNews && screenWidth < 760) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Skeleton style={{ margin: 10 }} count={4} height={200} width={160} />
        </div>
      );
    } else if (props.newsHome?.data?.data == undefined || props.newsHome?.data?.data?.length === 0) {
      return null;
    } else if (props.newsHome.data.data != undefined) {
      return (
        <div>
          <h2 className="titleLanding">{"BERITA DAN ARTIKEL"}</h2>
          <p className="textLanding">Beragam artikel menarik seputar United Tractors dan lainnya</p>
          <hr className="lineYellow" />
          <OwlCarousel
            center={false}
            nav={true}
            items={4}
            loop={false}
            className="carouselNews"
            navContainerClass={'owl-nav-landing'}
            navText={
              [
                '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
                "<i class='fa fa-chevron-right'></i>",
              ]
            }>
            {props.newsHome.data.data &&
              props.newsHome.data.data.map((item) => {
                return (
                  <Row
                    className='cardPromoNews'
                    style={{ boxShadow: '0px 3px 9px rgba(0, 0, 0, 0.1)', cursor: 'pointer' }}
                    onClick={() => {
                      setAnalyticClevertap("click", "Click_NewsDetail", "View_Landing_Screen", ["Click_NewsDetail", { "News_Name": item.title }]);
                      props.history.push(`/Landing/ListNews/DetailNews/${item.newsId}`);
                    }}>
                    <img className='imagePromoNews' src={item.imageThumbnailUrl} />
                    <p className='textTitlePromoNews' style={{ marginRight: 'auto' }}>{!item.title ? "-" : item.title.length > 20 ? `${item.title.substring(0, 20)}...` : item.title}</p>
                    <p className='textDescripNews'>
                      {parse(!item.description ? "-" : item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description)}
                    </p>
                  </Row>
                );
              })}
            <div />
          </OwlCarousel>
          <div
            className='containerNewsPromo'
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: 20,
              backgroundColor: '#FFFFFF'
            }}
          >
            <span
              className="viewAllLanding"
              onClick={() => {
                setAnalyticClevertap("click", "Click_SeeMoreNews", "View_Landing_Screen", null);
                props.push(MENU.LIST_NEWS)
              }}
            >Lihat Lainnya</span>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    if (props.user) {
      localStorage.setItem("CUSTOMER", props.user?.user);
      const startDate = moment(new Date());
      const endDate = moment(new Date()).add(idleTimeout / 1000, "second");
      localStorage.setItem("idleTimeoutThreshold", JSON.stringify({ startDate: startDate, endDate: endDate }));
      setAnalyticClevertap("action", "Action_Login_Success", "View_Landing_Screen", null);
    } else if (props.error.errorLogin) {
      localStorage.setItem("loginTimer", JSON.stringify({ minute: 0, second: 0 }));
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
    //props.initialBlockedLoginStatus();
  });

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

  useEffect(() => {
    if (login && props.user) {
      props.fetchTermCondition(props.user.tokenResponse.accessToken);
    }
  }, [props.user]);

  useEffect(() => {
    if (login && props.user) {
      if (props.dataTermCondition) {
        if (props.dataTermCondition.termAndConditionStatus == false) {
          setModalTermIsOpen(true);
          setLogin(false);
        } else {
          if (props.user.customerCode !== "ONETIMESTD" && featureUrl !== "") {
            window.open(featureUrl, '_self');
          } else if (props.user.customerCode === "ONETIMESTD") {
            setLogin(false);
            setOpenModalErrorUserOneTimes(true);
          }
        }
      };
    };
  }, [props.dataTermCondition])

  const _handleLogin = async (data) => {
    await props.login(data);
  };
  const _handleLoginGoogle = async (data) => {
    await props.loginGoogle(data);
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
  const _renderModalLogin = () => {
    return (
      <ModalLogin
        isOpen={login}
        isClose={() => setLogin(false)}
        login={_handleLogin}
        loginGoogle={_handleLoginGoogle}
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
        loginGoogle={_handleLoginGoogle}
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
        errorText={
          "Kami tidak dapat melanjutkan proses pembayaran, silahkan coba kembali"
        }
        title={"Huhu sayang sekali..."}
      />
    );
  };
  const _renderModalSuccessForgotPassword = () => {
    return (
      <ModalAccessDenied
        isOpen={openModalSuccessForgot}
        isClose={() => _clickSuccessFortgot()}
        errorText={"Email verifikasi telah dikirimkan ke email kamu, silahkan verifikasi"}
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

  const setLogout = async () => {
    setLogin(false);
    props.clearStore();
    localStorage.clear();
    window.location.replace(MENU.LANDING);
  };

  const showApp = (data) => {
    if (title !== data) {
      setChanges(!changes);
      setTitle(data);
    } else if (title === data) {
      setChanges(!changes);
      setTitle("");
    }
  }
  const _renderTextTerm = (app, ttl) => {
    if (title === ttl) {
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
  const _agree = async () => {
    const { dataTermCondition, user } = props;
    const version = dataTermCondition.termAndConditionVersion;
    await props.fetchUpdateTermCondition(user.tokenResponse.accessToken, version);
    if (props.user.customerCode !== "ONETIMESTD" && featureUrl !== "") {
      window.open(featureUrl, '_self');
    } else if (props.user.customerCode === "ONETIMESTD") {
      setLogin(false);
      setOpenModalErrorUserOneTimes(true);
    }
    setModalTermIsOpen(false);
  }

  const _renderModalTermCondition = () => {
    return (
      <Strap.Modal
        isOpen={modalTermIsOpen}
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
            {props.dataTermCondition ?
              props.dataTermCondition.termAndConditionHeader ?
                props.dataTermCondition.termAndConditionHeader.map((data) => {
                  return (
                    <table>
                      <tr onClick={() => { return showApp(data.title) }} style={{ cursor: 'pointer', color: '#2B2B2B' }}>
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
                          {title === data.title ? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"></i>}
                        </td>
                      </tr>
                      <tr >
                        {_renderTextTerm(data.termAndConditionDetail, data.title)}
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
                <Strap.Input className="form-check-input" type="checkbox" id="checkbox1" name="checkbox1" value={cek} onChange={() => { return setCek(!cek) }} />
                <Strap.Label check className="form-check-label" htmlFor="checkbox1">Setuju dengan syarat dan ketentuan UT Connect.</Strap.Label>
              </Strap.FormGroup>
            </Strap.Col>
            <Strap.Row md="3" lg="3">
              <Strap.Button
                color="outline-dark"
                style={{ fontFamily: "SFProText-Regular" }}
                onClick={async () => {
                  setAnalyticClevertap("action", "Action_TermAndCondition_Disagree", "View_Header_Bar", null);
                  setLogout();
                }}
              >Tidak Setuju</Strap.Button>
              <Strap.Button
                color="warning"
                style={{ marginLeft: '1em', fontFamily: "SFProText-Regular" }}
                disabled={!(cek)}
                onClick={() => {
                  setAnalyticClevertap("action", "Action_TermAndCondition_Agree", "View_Header_Bar", null);
                  _agree();
                }}
              >Setuju</Strap.Button>
            </Strap.Row>
          </Strap.Row>
        </Strap.ModalFooter>
      </Strap.Modal>
    );
  };

  const _clickOk = () => {
    setOpenModalErrorAr(false);
    localStorage.setItem("CUSTOMER", props.user?.user);
    localStorage.setItem("CUSTOMER", props.user?.user);
    const startDate = moment(new Date());
    const endDate = moment(new Date()).add(idleTimeout / 1000, "second");
    localStorage.setItem("idleTimeoutThreshold", JSON.stringify({ startDate: startDate, endDate: endDate }));
    setAnalyticClevertap("action", "Action_Login_Success", "View_Landing_Screen", null);
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
  useEffect(() => {
    if (props.errorRegister !== null) {
      setFailedSignup(true);
    }
  }, [props.errorRegister]);
  return (
    <>
      <div className='containerHome' style={{ marginTop: '5rem' }}>
        <div style={{ paddingTop: '2rem', backgroundColor: '#F1F1F1' }} />
        {_renderImageSlider()}
        {_renderPartTransactionOnline()}
        {_renderNewsArticle()}
        {_renderHighlight()}
      </div>
      {_renderHomeFooter()}
      {_renderModalLogin()}
      {_renderModalSignup()}
      {_renderModalDenied()}
      {_renderModalSuccess()}
      {_renderModalErrorUserOneTimes()}
      {_renderModalSignfail()}
      {_renderModalVerifyCode()}
      {_renderModalForgotPassword()}
      {_renderModalNewPassword()}
      {_renderModalErrorAr()}
      {_renderModalSuccessForgotPassword()}
      {_renderModalFailedForgotPassword()}
      {_renderModalTermCondition()}
    </>
  );
};

export default HomePage;
