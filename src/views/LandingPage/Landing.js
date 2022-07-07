import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import "./Landing.scss";
import { IconCloud, Star, IconWarehouse, IconWarn, IconDeleteBin, IconDenied, IconUTCall, IconMail, IconSuccess } from "assets/icons";
import { MENU } from "constants/menu";
import OwlCarousel from "react-owl-carousel";
import { Row, Col, Input } from "reactstrap";
import ModalUpload from "./../../components/ModalUpload/ModalUpload";
import Skeleton from "react-loading-skeleton";
import firebase from "../../firebase/firebase";
import { imageMaterialSearch, ImageNews, ImageNews2 } from "assets/images";
import SearchInputMini from "./../../components/SearchInputMini";
import ModalBranchSelect from "./components/ModalSelectBranch";
import ModalConfirm from "./../../components/ModalConfirm/ModalConfirm";
import ModalAccessDenied from "components/ModalAccessDenied/ModalAccessDenied";
import * as Utils from "./../../utils/format.helper";
import { setStorage, getStorage } from "utils/storage.helper";
import CircularProgress from "@material-ui/core/CircularProgress";
import ModalSuccessAddBucket from "components/ModalSuccessAddBucket/ModalSuccessAddBucket";
import ModalLogin from "./../../components/ModalLogin/ModalLogin";
import { DialogContent, Modal } from "@material-ui/core";
import ModalSignUp from "components/ModalSignUp/ModalSignUp";
import ModalVerifyCode from "../../components/ModalVerifyCode/ModalVerifyCode";
import ModalForgotPassword from "../../components/ModalForgotPassword/ModalForgotPassword";
import ModalNewPassword from "components/ModalNewPassword/ModalNewPassword";
import moment from "moment";
import * as Strap from "reactstrap";


const idleTimeout = 1800000; // 30 menit
let failedCount = 0;
let loginLocked = false;
let timer = {
  minute: 0,
  second: 10,
};
let interval;

const Landing = (props) => {
  const CHECK_STOCK = getStorage("CHECK_STOCK");
  const [loadingStock, setLoadingStock] = useState(false);
  const [poError, setPoError] = useState(false);
  const [poActive, setPoActive] = useState(getStorage("PO_ACTIVE"));
  const [checkPrice, setCheckPrice] = useState(getStorage('CHECK_PRICE'));
  const [suggest, setClickSuggestion] = useState(CHECK_STOCK?.suggest ? CHECK_STOCK?.suggest : null);
  const [openModalUpload, setOpenModalUpload] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalErrorFile, setOpenModalErrorFile] = useState(false);
  const [openModalErrorFilePdf, setOpenModalErrorFilePdf] = useState(false);
  const [openModalErrorFilePdfFormat, setOpenModalErrorFilePdfFormat] = useState(false);
  const [openModalErrorFileCsv, setOpenModalErrorFileCsv] = useState(false);
  const [openModalErrorFileCsvSize, setOpenModalErrorFileCsvSize] = useState(false);
  const [openModalErrorPo, setOpenModalErrorPo] = useState(false);
  const [openModalErrorBranch, setOpenModalErrorBranch] = useState(false);
  const [openModalConfirmBranch, setOpenModalConfirmBranch] = useState(false);
  const [openModalCart, setOpenModalCart] = useState(false);
  const [openModalAddBucket, setOpenModalAddBucket] = useState(false);
  const [openModalErrorMaterial, setOpenModalErrorMaterial] = useState(false);
  const [openModalErrorCart, setOpenModalErrorCart] = useState(false);
  const [openModalErrorUserOneTimes, setOpenModalErrorUserOneTimes] = useState(false);
  const [productFilter, setProductFilter] = useState(0);
  const [filter, setFilter] = useState(1);
  const [page, setPage] = useState(1);
  const [screenWidth, setScreen] = useState(window.innerWidth);
  const [partNumber, setPartNumber] = useState("");
  const [qty, setQty] = useState(null);
  const [nameFile, setFileCsv] = useState("");
  const [fileCsv, setFile] = useState("");
  const [selectAll, setAll] = useState(false);
  const [modalSelect, setModal] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [branchListOrder, setBranchListOrder] = useState([]);
  const [branchSelect, setBranchSelect] = useState(getStorage("BRANCH_ACTIVE"));
  const [purchaseDate, setPurchaseDate] = useState(Utils.formatDate(new Date()));
  const [orderCurrency, setOrderCurrency] = useState("IDR");
  const [materialNumber, setMaterialNumber] = useState(false);
  const [priceNotFound, setPriceNotFound] = useState(false);
  const [idKeyword, setIdKeyword] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [test, setTest] = useState((1000 * 60 * 15))
  const [isNull, setIsNull] = useState(false)
  const [branch, setBranch] = useState(CHECK_STOCK?.branch ? CHECK_STOCK?.branch : "");
  const [openSuggestBranch, setOpenSuggestBranch] = useState(false)
  const [sorting, setSorting] = useState([
    {
      name: "Best Seller",
      index: 0,
    },
    {
      name: "New Arrival",
      index: 1,
    },
    {
      name: "Sale Item",
      index: 2,
    },
  ]);
  const [imagePromo, setImagePromo] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [dataNotNull, setData] = useState(false);
  const [listMaterial, setMaterial] = useState([
    {
      no: 1,
      partNumber: null,
      partDesc: null,
      qty: null,
      mou: null,
      price: null,
      amount: null,
      checklist: false,
    },
    {
      no: 2,
      partNumber: null,
      partDesc: null,
      qty: null,
      mou: null,
      price: null,
      amount: null,
      checklist: false,
    },
    {
      no: 3,
      partNumber: null,
      partDesc: null,
      qty: null,
      mou: null,
      price: null,
      amount: null,
      checklist: false,
    },
    {
      no: 4,
      partNumber: null,
      partDesc: null,
      qty: null,
      mou: null,
      price: null,
      amount: null,
      checklist: false,
    },
    {
      no: 5,
      partNumber: null,
      partDesc: null,
      qty: null,
      mou: null,
      price: null,
      amount: null,
      checklist: false,
    },
  ]);
  const [newListMaterial, setNewListMaterial] = useState(listMaterial)
  const [keywordParts, setKeywordParts] = useState(CHECK_STOCK?.partNumber ? CHECK_STOCK?.partNumber : "");
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
  const [plantCode, setPlantCode] = useState(null);
  const [modalTermIsOpen, setModalTermIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [changes, setChanges] = useState(false);
  const [cek, setCek] = useState(false);

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
    setAnalyticClevertap("view", "View_Home_Screen", "View_Home_Screen", null);
    window.scrollTo(0, 0);
    if (localStorage.getItem('listMaterial') && JSON.parse(localStorage.getItem('listMaterial')).length > 0) {
      setMaterial(JSON.parse(localStorage.getItem("listMaterial")));
    } else if (localStorage.getItem('listMaterial') && JSON.parse(localStorage.getItem('listMaterial')).length == 0) {
      setMaterial(newListMaterial);
    } else {
      setMaterial(listMaterial);
    }
  }, []);

  useEffect(() => {
    if (props.user && props.user.customerCode !== 'ONETIMESTD') {
      getBranchlist();
    }
    async function fetchBranchUnauth() {
      const data = await props.fetchGetBranchList(null, true, branch);
      if (data != null && data != "400") {
        setBranchList(data.data);
      }
    }
    fetchBranchUnauth();
  }, [props.user, branch]);

  const getBranchlist = async () => {
    const { user } = props;
    const data = await props.fetchGetBranchList(user.tokenResponse.accessToken, false, "");
    if (data != null && data != "400") {
      setBranchListOrder(data.data);
    }
  };

  useEffect(() => {
    async function fetchNewsAdditonal() {
      await props.fetchListNewsAdditional("Additional News", 5, page);
    }
    async function fetchImgSlider() {
      await props.fetchImageslider();
    }
    async function fetchBrand() {
      await props.fetchListBrand();
    }
    fetchImgSlider();
    fetchBrand();
    fetchNewsAdditonal();
  }, []);

  useEffect(() => {
    const { user } = props;
    let params = {
      PageNumber: 1
    }
    async function getProductList() {
      if (user) {
        await props.fetchListProduct(user.tokenResponse.accessToken, params, 10);
      } else {
        await props.fetchListProduct(null, params, 10);
      }
    }
    getProductList();
  }, [])

  useEffect(() => {
    async function fetchNews() {
      await props.fetchListNews("News & Promo", 5, page);
    }
    fetchNews();
  }, []);

  const pressFilter = (data) => {
    if (filter != data) {
      setFilter(data);
    } else {
      setFilter(1);
    }
  };

  useEffect(() => {
    if (keywordParts != "") {
      async function fetchSearch() {
        const { user } = props;
        await props.fetchSearch(user && user.customerCode !== 'ONETIMESTD' ? user.tokenResponse.accessToken : null, keywordParts, idKeyword);
      }
      fetchSearch();
    }
  }, [keywordParts, idKeyword]);

  useEffect(() => {
    for (let i = 0; i < branchList.length; i++) {
      if (branchList[i].description === branch) {
        setPlantCode(branchList[i].plantCode)
        setKeywordParts("")
      }
    }
  }, [branch])

  useEffect(() => {
    if (suggest != null) {
      async function fetchStock() {
        const { user } = props;
        const body = {
          partNumber: [suggest],
          plantCode: plantCode,
          isAllBranch: true
        };
        setLoadingStock(true)
        await props.fetchStock(user && user.customerCode !== 'ONETIMESTD' ? user.tokenResponse.accessToken : null, body);
        if (props.stockList.length === 0) {
          setIsNull(true)
          setLoadingStock(false)
        }
        setLoadingStock(false)
      }
      fetchStock();
    }
  }, [suggest]);

  useEffect(() => {
    if (props.user !== null) {
      localStorage.setItem("CUSTOMER", props.user?.user);
      const startDate = moment(new Date());
      const endDate = moment(new Date()).add(idleTimeout / 1000, "second");
      localStorage.setItem("idleTimeoutThreshold", JSON.stringify({ startDate: startDate, endDate: endDate }));
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

  const sendPromotion = (promotionId, imageUrl) => {
    setAnalyticClevertap("click", "Click_PromotionDetail", "View_Home_Screen", ["Click_PromotionDetail", { "Promotion_Id": promotionId }]);
    const img = imageUrl.replaceAll('/', ',');
    const img2 = img.replaceAll('?', '|');

    props.history.push(`/Landing/Promotion/${promotionId}/${img2}`, { id: promotionId, image: imageUrl });
  }

  const _renderImagePromotion = () => {
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
    } else if (props.imageSlider != null) {
      return (
        <div style={{ margin: '0 6rem', marginLeft: '7rem', display: 'flex', flexDirection: 'column' }}>
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
                  style={{ margin: '0 30px' }}
                  onClick={() => sendPromotion(item.promotionId, item.imageUrl)}
                >
                  <img className="imgSliderLanding" style={{ borderRadius: "15px", cursor: 'pointer' }} src={item.imageUrl} />
                </div>
              );
            })}
          </OwlCarousel>
          <span
            className="viewAllLanding"
            onClick={() => {
              setAnalyticClevertap("click", "Click_SeeMorePromotion", "View_Home_Screen", null);
              props.push(MENU.PROMOTION)
            }}
          >Lihat Lainnya</span>
        </div>
      );
    }
  };

  const _renderVoucherList = () => {
    const imgURL = "https://firebasestorage.googleapis.com/v0/b/customer-portal-dan-ut-portal.appspot.com/o/Images%2F96d1bcd8-e1b4-4c60-9ae5-165089f5a3b5%2F.png?alt=media&token=8b36ce16-b668-4efa-ade1-ee9b29800c5b";
    const voucherList = [imgURL, imgURL, imgURL, imgURL, imgURL, imgURL, imgURL, imgURL];

    return (
      <div style={{ margin: '0 6rem', display: 'flex', flexDirection: 'column' }}>
        <p className="textTitleLanding" style={{ marginBottom: 0, marginLeft: '1.5rem', lineHeight: 0.5 }}>Voucher Spesial Untukmu</p>
        <OwlCarousel
          style={{ paddingRight: 0, marginRight: 0 }}
          className="carouselPromotion"
          dots={true}
          dotsClass={'conDotsVoucher'}
          dotClass={'dotsLanding'}
          navContainerClass={'owl-nav-landing'}
          loop={false}
          items={3.5}
          center={false}
          nav={true}
          autoplay={false}
          navText={
            [
              '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
              "<i class='fa fa-chevron-right'></i>",
            ]
          }>
          {voucherList.map((item, index) => (
            <div className="card-voucher" key={index}>
              <img className="image-voucher" src={item} />
            </div>
          ))}
        </OwlCarousel>
        <span
          className="viewAllLanding"
          onClick={() => {
            setAnalyticClevertap("click", "Click_SeeMorePromotion", "View_Home_Screen", null);
            props.push(MENU.PROMOTION)
          }}
        >Lihat Lainnya</span>
      </div>
    );
  }

  const _renderSelectByBrand = () => {
    if (props.loadingBrand && screenWidth > 900) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Skeleton style={{ margin: 10 }} count={6} height={200} width={150} />
        </div>
      );
    } else if (props.loadingBrand && screenWidth >= 760 && screenWidth < 900) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Skeleton style={{ margin: 10 }} count={4} height={200} width={160} />
          <Skeleton style={{ margin: 10 }} count={2} height={200} width={160} />
        </div>
      );
    } else if (props.loadingBrand && screenWidth < 760) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Skeleton style={{ margin: 10 }} count={2} height={150} width={130} />
          <Skeleton style={{ margin: 10 }} count={2} height={150} width={130} />
          <Skeleton style={{ margin: 10 }} count={2} height={150} width={130} />
        </div>
      );
    } else if (props.brandData != null && props.brandData.length > 0) {
      return (
        <div>
          <p className='textTitleLanding'>Pilih Berdasarkan Brand</p>
          <Row className='containerBrand'>
            {props.brandData != null &&
              props.brandData.filter(item => item.display === true).map((item) => {
                return (
                  <Row
                    className='card'
                    style={
                      item.name == "KOMATSU"
                        ? { backgroundColor: "#ffd500" }
                        : item.name == "SCANIA"
                          ? { backgroundColor: "#51AAE1" }
                          : item.name == "UD TRUCK"
                            ? {
                              backgroundColor: "#D41837",
                            }
                            : item.name == "TADANO"
                              ? { backgroundColor: "#85A6FD" }
                              : { backgroundColor: "#0F3460" }
                    }
                  >
                    <div className='cardLogo'>
                      <img className='imageLogo' src={item.imageUrl} />
                    </div>

                    <img className='imageIcon' src={item.additionalImage} />
                    <div
                      className='cardBuy'
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setAnalyticClevertap("click", "Click_BuyByBrand", "View_Home_Screen", ["Click_BuyByBrand", { "Brand_Name": item.name }]);
                        props.push(MENU.LIST_PRODUCT, { brand: item.name })
                      }}
                    >
                      <p
                        className='textBuy'
                        style={
                          item.name == "KOMATSU"
                            ? { color: "#ffd500" }
                            : item.name == "SCANIA"
                              ? { color: "#51AAE1" }
                              : item.name == "UD TRUCK"
                                ? {
                                  color: "#D41837",
                                }
                                : item.name == "TADANO"
                                  ? { color: "#85A6FD" }
                                  : { color: "#0F3460" }
                        }
                      >
                        Beli
                      </p>
                    </div>
                  </Row>
                );
              })}
          </Row>
        </div>
      );
    }
  };

  const _renderListProduct = () => {
    if (props.loadingProduct && screenWidth > 900) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Skeleton style={{ margin: 10 }} count={5} height={200} width={170} />
          <Skeleton style={{ margin: 10 }} count={5} height={200} width={170} />
        </div>
      );
    } else if (props.loadingProduct && screenWidth >= 760 && screenWidth < 900) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Skeleton style={{ margin: 10 }} count={4} height={200} width={160} />
          <Skeleton style={{ margin: 10 }} count={4} height={200} width={160} />
        </div>
      );
    } else if (props.loadingProduct && screenWidth < 760) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Skeleton style={{ margin: 10 }} count={2} height={150} width={130} />
          <Skeleton style={{ margin: 10 }} count={2} height={150} width={130} />
          <Skeleton style={{ margin: 10 }} count={2} height={150} width={130} />
        </div>
      );
    } else {
      const { listProductData } = props;
      return (
        <div style={{ marginBottom: 10 }}>
          <Row className='gridListLanding' style={{ marginTop: '2vw' }} >
            {listProductData &&
              listProductData.data.map((item) => {
                return (
                  <a
                    className='cardList'
                    style={{ textDecoration: 'none' }}
                    href={`${MENU.DETAIL_PRODUCT}${item.productId}`}
                    onClick={() => {
                      setAnalyticClevertap("click", "Click_DetailProduct", "View_Home_Screen", ["Click_DetailProduct", { "Product_Name": item.materialName }])
                    }}
                  >
                    <Col>
                      <div className='cardImage'>
                        <img className='imageList' src={item.imageThumbnailUrl} />
                      </div>
                      <p className='titleKategoriBrandLanding'>{item.brandName}</p>
                      <p className='titleProductLanding' style={{ marginBottom: 0 }}>{item.materialName}</p>
                      <p
                        className='titleProductLanding'
                        style={{ fontFamily: "SFProText-Regular", opacity: 0.5 }}
                      >({item.materialNumber})</p>
                      {item.promotionPrice != item.basePrice ?
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <p className='titlePriceLanding'>Rp {Utils.formatCurrency(item.basePrice)}</p>
                          <p className='titlePriceDiscountLanding' style={{ marginBottom: 0, marginLeft: 5, fontSize: 12, color: 'rgb(20, 143, 15)' }}>{item.discountPercent}</p>
                        </div> : null
                      }
                      <p className='titlePriceDiscountLanding'>Rp {Utils.formatCurrency(item.promotionPrice)}</p>
                      <p className='titleReview'>
                        {item.countReview != 0 ?
                          <img src={Star} style={{ width: 13, height: 13, marginRight: 5 }} /> : null}
                        {item.rating != 0 ?
                          <>{item.rating} <span style={{ marginRight: 10 }}>({item.countReview})</span></> : null}
                      </p>
                    </Col>
                  </a>
                );
              })}
          </Row>
          {listProductData.data &&
            listProductData.data.length > 0}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className='cardMore' style={{ cursor: 'pointer' }}>
              <p
                className='titleButtonMore'
                onClick={() => {
                  setAnalyticClevertap("click", "Click_SeeMoreProduct", "View_Home_Screen", null);
                  props.push(MENU.LIST_PRODUCT)
                }}
              >
                Lihat Lebih Banyak
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

  const _eventInput = (event, index) => {
    setCheckPrice(false);
    setStorage('CHECK_PRICE', false)
    if (event.length > 0 && event > 0) {
      let newArr = listMaterial.map((item, i) => {
        if (index == i) {
          return {
            ...item,
            ["qty"]: event,
          };
        } else {
          return item;
        }
      });
      setMaterial(newArr);
      localStorage.setItem('listMaterial', JSON.stringify(newArr))
    } else if (event.length === 0) {
      let newArr = listMaterial.map((item, i) => {
        if (index == i) {
          return {
            ...item,
            ["qty"]: null,
          };
        } else {
          return item;
        }
      });
      setMaterial(newArr);
      localStorage.setItem('listMaterial', JSON.stringify(newArr))
    }
  };
  const _eventInputPart = (event, index) => {
    setPartNumber(event.target.value.toUpperCase());
    setCheckPrice(false);
    setStorage('CHECK_PRICE', false)
    if (event.target.value.length > 0) {
      let newArr = listMaterial.map((item, i) => {
        if (index == i) {
          return {
            ...item,
            ["no"]: index + 1,
            ["partNumber"]: event.target.value.toUpperCase(),
          };
        } else {
          return item;
        }
      });
      setData(true);
      setMaterial(newArr);
      localStorage.setItem('listMaterial', JSON.stringify(newArr))
    } else {
      let newArr = listMaterial.map((item, i) => {
        if (index == i) {
          return {
            ...item,
            ["partNumber"]: null,
          };
        } else {
          return item;
        }
      });
      setMaterial(newArr);
      localStorage.setItem('listMaterial', JSON.stringify(newArr))
    }
  };

  const _downloadFile = async () => {
    const { user } = props;
    const data = await props.fetchDownloadTemplate(user.tokenResponse.accessToken);
    if (data != null && data != "400") {
      var binaryData = [];
      binaryData.push(data);
      const href = window.URL.createObjectURL(new Blob(binaryData, { type: "text/csv" }));
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", "template.csv");
      document.body.appendChild(link);
      link.click();
      setAnalyticClevertap("click", "Click_DownloadMaterial", "View_Home_Screen", null);
    }
  };

  const _uploadFileCsv = async () => {
    document.getElementById("uploadCsv").click();
    document.getElementById("uploadCsv").onchange = async () => {
      var allowedExtensions = /(\.csv|\.CSV)$/i;
      var data = document.getElementById("uploadCsv").files[0].name;
      var file = document.getElementById("uploadCsv").files[0];
      var size = document.getElementById("uploadCsv").files[0].size / 1024 / 1024;

      if (!allowedExtensions.exec(data)) {
        _openModalErrorFileCsv()
      } else if (size > 3 && allowedExtensions.exec(data)) {
        _openModalErrorFileCsvSize()
      } else if (size <= 3 && allowedExtensions.exec(data)) {
        setFileCsv(data);
        setFile(file);
      }

    };
  };

  const _clickBulkyOrder = () => {
    if (props.user) {
      if (props.user.customerCode === "ONETIMESTD") {
        setOpenModalErrorUserOneTimes(true);
      } else {
        setProductFilter(1)
      }
    } else {
      setLogin(true)
    }
  }

  const _submitFile = async () => {
    if (fileCsv != "") {
      const { user } = props;
      const formData = new FormData();
      formData.append("file", fileCsv);
      const data = await props.fetchUploadCsv(user.tokenResponse.accessToken, formData);
      if (data != null && data != "400") {
        const newCheckBoxObj = [];
        for (let i = 0; data.length > i; i++) {
          if (i <= 499) {
            const array = {
              checklist: selectAll,
              no: i + 1,
              partNumber: data[i].materialNumber,
              partDesc: null,
              qty: data[i].quantity,
              mou: null,
              price: null,
              amount: null,
            };
            newCheckBoxObj.push(array);
          }
        }
        setMaterial(newCheckBoxObj);
        localStorage.setItem('listMaterial', JSON.stringify(newCheckBoxObj))
        setData(true);
        setOpenModalUpload(false);
        setAnalyticClevertap("action", "Action_UploadMaterial_Success", "View_Home_Screen", null)
      } else {
        setAnalyticClevertap("action", "Action_UploadMaterial_Error", "View_Home_Screen", null)
        _openModalErrorCart()
      }
    }

  };

  const _addRowsMaterial = () => {
    if (listMaterial.length <= 500) {
      setMaterialNumber(false);
      setPriceNotFound(false);
      const dataNew = [];
      for (let i = 0; i < 5; i++) {
        const array = {
          no: listMaterial.length + 1 + i,
          partNumber: null,
          partDesc: null,
          qty: null,
          mou: null,
          price: null,
          amount: null,
          checklist: false,
        };
        dataNew.push(array);
      }
      setMaterial(listMaterial.concat(dataNew));
    }
  };

  const _resetMaterial = () => {
    setOpenModalAddBucket(false)
  };

  const _checklist = (event, index) => {
    let newArr = listMaterial.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          ["checklist"]: event.target.checked,
        };
      } else {
        return item;
      }
    });
    setMaterial(newArr);
    setData(true);
    setAll(event.target.checked ? false : false);
  };

  const _checklistAll = (event) => {
    const selectAll = event.target.checked;
    const newCheckBoxObj = [];
    for (let i = 0; listMaterial.length > i; i++) {
      const array = {
        checklist: selectAll,
        no: listMaterial[i].no,
        partNumber: listMaterial[i].partNumber,
        partDesc: listMaterial[i].partDesc,
        qty: listMaterial[i].qty,
        mou: listMaterial[i].mou,
        price: listMaterial[i].price,
        amount: listMaterial[i].amount,
        availability: listMaterial[i].availability,
        productId: listMaterial[i].productId,
      };
      newCheckBoxObj.push(array);
    }
    setMaterial(newCheckBoxObj);
    setAll(event.target.checked);
    setMaterialNumber(false);
    setPriceNotFound(false);
  };

  const _deleteChecklist = () => {
    let myArray = listMaterial;
    var newArray = myArray.filter((item) => item.checklist != true);
    const newCheckBoxObj = [];
    for (let i = 0; newArray.length > i; i++) {
      document.getElementById(`"partNumber"${i}`).value = '';
      document.getElementById(`"qty"${i}`).value = '';
      const array = {
        productId: newArray[i].productId,
        checklist: newArray[i].checklist,
        no: i + 1,
        partNumber: newArray[i].partNumber,
        partDesc: newArray[i].partDesc,
        qty: newArray[i].qty,
        mou: newArray[i].mou,
        price: newArray[i].price,
        amount: newArray[i].amount,
      };
      newCheckBoxObj.push(array);
    }


    setMaterial(newCheckBoxObj);
    localStorage.setItem('listMaterial', JSON.stringify(newCheckBoxObj))
    setOpenModalConfirm(false);
    setData(false);
  };

  const _renderListNews = () => {
    return (
      <div className='defaultMargin'>
        <div>
          <p className='textTitleList'>3 Cara Mudah Belanja di UT Connect Online Transaction</p>
          <img className='imageList' src={ImageNews} />
        </div>
        <div>
          <p className='textTitleList'>Tentang UT Connect Aplikasi </p>
          <img className='imageList' src={ImageNews2} />
        </div>
      </div>
    );
  };

  const _renderUploadMaterial = () => {
    return (
      <Row style={{ marginTop: '2vw' }}>
        <p
          className={
            productFilter === 0 ? "tabProduct active" : "tabProduct"
          }
          style={{ marginBottom: 0, cursor: 'pointer' }}
          onClick={() => {
            setProductFilter(0);
          }}
        >
          Produk Promo
        </p>
        <p
          className={
            productFilter === 1 ? "tabProduct active" : "tabProduct"
          }
          style={{ marginBottom: 0, cursor: 'pointer' }}
          onClick={() => {
            _clickBulkyOrder();
          }}
        >
          Pesan Cepat
        </p>
        <hr className='lineProduct' />
      </Row>
    );
  };

  const setCheckStockToStorage = (key, payload) => {
    if (key === "BRANCH") {
      const data1 = {
        branch: payload,
        partNumber: CHECK_STOCK?.partNumber ? CHECK_STOCK?.partNumber : "",
        suggest: CHECK_STOCK?.suggest ? CHECK_STOCK?.suggest : null,
      };
      setStorage("CHECK_STOCK", data1);
    } else {
      const data2 = {
        branch: CHECK_STOCK?.branch ? CHECK_STOCK?.branch : "",
        partNumber: payload,
        suggest: payload
      };
      setStorage("CHECK_STOCK", data2);
    }
  };

  const _renderCheckStockParts = () => {
    return (
      <>
        <p style={{ marginTop: 20 }} className={"textTitleLanding"}>
          Info Ketersediaan Suku Cadang
        </p>
        <div className={"responsiveFlex"}>
          <div>
            <img src={imageMaterialSearch} className='imageMaterialSearch' />
          </div>
          <div>
            <p className="textBranch">Pilih Cabang UT</p>
            <Input
              className="inputBranch"
              placeholder="Pilih Cabang"
              value={branch.toUpperCase().replace("UT BRANCH ", "")}
              onChange={(e) => {
                setOpenSuggestBranch(true);
                setBranch(e.target.value);
              }}
            />
            {branchList !== [] && openSuggestBranch ?
              <div className="containerSuggestBranch">
                {branchList !== [] ? branchList.map((brnch, index) => (
                  <p
                    key={index}
                    className="itemSuggestBranch"
                    onClick={() => {
                      setOpenSuggestBranch(false)
                      setBranch(brnch.description);
                      setCheckStockToStorage("BRANCH", brnch.description);
                      setAnalyticClevertap("click", "Click_ChooseBranch", "View_Home_Screen", ["Click_ChooseBranch", { "Branch_Name": brnch.description }]);
                    }}
                  >{brnch.description.toUpperCase().replace("UT BRANCH", "")}</p>
                )) : null}
              </div>
              : null
            }
            <p className="textBranch">Kode Produk</p>
            <SearchInputMini disabled={branch && !openSuggestBranch ? false : true} placeHolder={'Cari Produk'} name={keywordParts} handleEnterKey={(event) => _handleChangeKeyword(event)} />
            {keywordParts == "" ? null : (
              <div className="boxSuggestion">
                {props.suggestionList.length === 0 ? (
                  <p
                    style={{
                      fontFamily: 'SFProText-Bold',
                      fontSize: '1vw',
                      cursor: "pointer",
                      fontSize: 12,
                      margin: 5,
                      fontWeight: "bold",
                    }}
                  >
                    Kode Produk tidak ditemukan
                  </p>
                ) : (
                  props.suggestionList.map((value, i) => {
                    return (
                      <div className="rowPartNumber">
                        <p
                          onClick={() => (
                            setIsNull(false),
                            setIdKeyword(value.id),
                            setKeywordParts(value.name),
                            setClickSuggestion(value.name),
                            setCheckStockToStorage("PARTNUMBER", value.name),
                            setAnalyticClevertap("click", "Click_SearchProduct", "View_Home_Screen", ["Click_SearchProduct", { "Part_Number": `${value.name}`, "Part_Description": `${value.description}` }])
                          )}
                          style={{
                            fontFamily: 'SFProText-Bold',
                            fontSize: '1vw',
                            cursor: "pointer",
                            fontSize: 12,
                            margin: 5,
                            fontWeight: value.name === suggest ? "bold" : "normal",
                          }}
                          key={i}
                        >
                          {value.name} - {value.description}
                        </p>
                        {loadingStock ?
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: 5 }}>
                            <CircularProgress style={{ width: 15, height: 15, marginLeft: 30 }} />
                            <p style={{ marginBottom: 0, fontSize: 10, marginLeft: 5 }}>Memuat...</p>
                          </div>


                          : props.stockList.length > 0 && props.stockList[0].stock > 0 ? <p className="signAvailable">Tersedia</p> :
                            props.stockList.length > 0 && props.stockList[0].stock == 0 ? <p style={{ backgroundColor: '#f6d9e3', color: '#d41837' }} className="signAvailable">Tidak Tersedia</p> : null}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  const _currency = (number) => {
    const data = Number(number);
    return data.toFixed(0);
  };
  const _handleChangeKeyword = (event) => {
    setClickSuggestion(null)
    setKeywordParts(event);
    setIdKeyword(null)
    props.fetchResetStock();
  };
  const _clickBucket = async (value) => {
    setLoadingBtn(true)
    const { user } = props;
    const body = {
      isBuyNow: value,
      poCustomer: "",
      poCustomerDate: purchaseDate,
      filename: "",
      path: "",
      inquiryNumber: "",
      carts: [],
      cookiesData: "",
      branchId: branchSelect.id,
    };
    let materialError = false
    for (let i = 0; listMaterial.length > i; i++) {
      if (listMaterial[i].checklist === true) {
        if (listMaterial[i].partDesc === false) {
          setMaterialNumber(true);
          materialError = true
        }
        if (listMaterial[i].price == null) {
          setPriceNotFound(true);
          materialError = true
        }
        const array = {
          productId: listMaterial[i].productId,
          itemQty: listMaterial[i].qty,
          price: listMaterial[i].price,
        };
        body.carts.push(array);
      }
    }
    for (let i = 0; body.carts.length > i; i++) {
      if (body.carts[i].productId == null) {
        materialError = true
        setMaterialNumber(true);
      }
    }
    if (body.carts.length == 0) {
      setOpenModalErrorCart(true)
      setLoadingBtn(false);
    } else {
      if (!materialError) {
        const data = await props.fetchCartPost(user.tokenResponse.accessToken, body);
        if (data != null && data != "400") {
          if (value) {
            setAnalyticClevertap("action", "Action_BuyNow_Success", "View_Home_Screen", null)
          } else {
            setAnalyticClevertap("action", "Action_AddBucket_Success", "View_Home_Screen", null)
          }
          setLoadingBtn(false);
          if (value) {
            localStorage.removeItem("listMaterial");
            props.push(MENU.BUCKET_LIST, data.cartId);
          } else {
            await props.fetchCartByUserId(user.userId, user.tokenResponse.accessToken);
            localStorage.removeItem("listMaterial");
            setOpenModalAddBucket(true);
          }
        } else {
          if (value) {
            setAnalyticClevertap("action", "Action_BuyNow_Error", "View_Home_Screen", null)
          } else {
            setAnalyticClevertap("action", "Action_AddBucket_Error", "View_Home_Screen", null)
          }
          setLoadingBtn(false);
          _openModalErrorCart();

        }
      } else {
        setOpenModalErrorMaterial(true)
        setLoadingBtn(false);
      }
    }
  };

  const _setItemBranch = (item) => {
    setAnalyticClevertap("click", "Click_ChooseBranchBulky", "View_Home_Screen", ["Click_ChooseBranch", { "Branch_Name": item.description }]);
    setBranchSelect(item);
    setStorage("BRANCH_ACTIVE", item);
  };

  const _checkPrice = async () => {
    if (branchSelect != null) {
      setLoadingBtn(true)
      const { user } = props;
      const body = {
        plantCode: branchSelect.plantCode,
        parts: [],
      };
      for (let i = 0; listMaterial.length > i; i++) {
        if ((listMaterial[i].partNumber != null && listMaterial[i].quantity != null) || listMaterial[i].qty != null) {
          const array = {
            itemNo: listMaterial[i].no,
            partNumber: listMaterial[i].partNumber,
            quantity: listMaterial[i].qty,
          };
          body.parts.push(array);
        }
      }
      const data = await props.fetchCheckPrice(user.tokenResponse.accessToken, body);
      if (data != null && data != "400") {
        setAnalyticClevertap("action", "Action_CheckPrice_Success", "View_Home_Screen", null);
        const newCheckBoxObj = [];
        for (let i = 0; data.parts.length > i; i++) {
          const array = {
            checklist: data.parts[i].price != null ? true : false,
            no: i + 1,
            partNumber: data.parts[i].partNumber,
            partDesc: data.parts[i].partDescription != null ? data.parts[i].partDescription : false,
            qty: data.parts[i].quantity,
            mou: data.parts[i].sku,
            price: data.parts[i].price,
            amount: data.parts[i].amount != null ? data.parts[i].amount : false,
            availability: data.parts[i].availability,
            productId: data.parts[i].productId,
          };
          newCheckBoxObj.push(array);
        }
        setMaterial(newCheckBoxObj);
        localStorage.setItem('listMaterial', JSON.stringify(newCheckBoxObj))
        setCheckPrice(true);
        setStorage('CHECK_PRICE', true)
        setMaterialNumber(true);
        setPriceNotFound(true);
        setLoadingBtn(false)
      } else {
        setAnalyticClevertap("action", "Action_CheckPrice_Error", "View_Home_Screen", null);
        setModalError(true);
        setLoadingBtn(false)
      }
    } else {
      _openModalErrorBranch();
    }
  };

  const _renderErrorPO = () => {
    let format = /[ `!@#$%^&*+\=\[\]{};'"\\|<>\?~]/;
    if (format.test(getStorage("PO_ACTIVE")) == false) {
      return null
    }
    else {
      return (
        <div style={{ display: "inline-flex", margin: "0 10px", alignItems: "center" }}>
          <p style={{ fontSize: 12, margin: 0, marginLeft: 5, marginTop: 2, color: "#c60242" }}>
            PO Number can't use special character
          </p>
        </div>
      )
    }
  }

  const _renderTabProduct = () => {
    switch (true) {
      case productFilter === 1:
        return (
          <>
            <div className='order-header'>
              <div className='label-order mb-0'>Detail Pesanan</div>
            </div>
            <div className='cardBranch'>
              <div>
                <img src={IconWarehouse} alt='warehouse-icon' className='icon-branch' />
              </div>
              {branchSelect != null ? (
                <div style={{ flex: 1 }}>
                  <h5 className='titleSelect' style={{ textAlign: "left" }}>
                    {branchSelect.description.toUpperCase().replace("UT BRANCH ", "")}
                  </h5>
                  <p style={{ textAlign: "left", marginLeft: 20, fontSize: '1vw', color: "#707070" }}>
                    {branchSelect.address}
                  </p>
                </div>
              ) : (
                <h5 className='titleSelect' style={{ textAlign: "left" }}>
                  Cabang UT
                </h5>
              )}

              <div style={{ display: "flex", alignItems: "flex-end" }}>
                {branchSelect != null ? (
                  <div onClick={() => (
                    localStorage.removeItem("BRANCH_ACTIVE"),
                    setOpenModalConfirmBranch(true),
                    setAnalyticClevertap("click", "Click_ModalSelectBranch", "View_Home_Screen", null)
                  )}>
                    <p className='titleCheckout' style={{ color: "#007bff", marginRight: 20, cursor: "pointer" }}>
                      Ubah
                    </p>
                  </div>
                ) : (
                  <div
                    style={{ cursor: "pointer" }}
                    className='btnSelectBranch'
                    onClick={() => {
                      setModal(true)
                      setAnalyticClevertap("click", "Click_ModalSelectBranch", "View_Home_Screen", null)
                    }}
                  >
                    <p className='titleCheckout'>Pilih Cabang</p>
                  </div>
                )}
              </div>
            </div>
            <div className='order-header'>
              <div />
              <div
                className='btn-upload-item'
                onClick={() => (
                  setOpenModalUpload(true),
                  setCheckPrice(false),
                  setStorage('CHECK_PRICE', false),
                  setMaterialNumber(false),
                  setPriceNotFound(false),
                  setAnalyticClevertap("click", "Click_ModalUploadMaterial", "View_Home_Screen", null)
                )}
              >
                <img src={IconCloud} alt='checkStockIcon' />
                <p>Upload Suku Cadang</p>
              </div>
            </div>
            <div className='list-material-container'>
              <div className='label-container'>
                <div style={{ width: "4.5vw" }}></div>
                <div className='label-head-itemNo'>Item No</div>
                <div className='label-head-partNum'>Nomor Material</div>
                <div className='label-head-partDesc'>Deskripsi Material </div>
                <div className='label-head-qty'>Qty</div>
                <div className='label-head-mou'>MoU</div>
                <div className='label-head-price'>Harga</div>
                <div className='label-head-price'>Total</div>
              </div>
              {listMaterial.map((data, index) => {
                return (
                  <div className='label-container' style={{ marginBottom: "10px" }}>
                    <div className='value-item-checkbox'>
                      <input type='checkbox' checked={data.checklist} onChange={(event) => _checklist(event, index)} />
                    </div>
                    <div className='value-item'>{data.no}</div>
                    <Input
                      id={`"partNumber"${index}`}
                      type='text'
                      value={data.partNumber}
                      onChange={(event) => _eventInputPart(event, index)}
                      className='value-item-material'
                    />
                    {!data.partDesc && materialNumber === true ? (
                      <div style={{ display: "inline-flex", marginLeft: '-19%', marginTop: 42, alignItems: "center" }}>
                        <img src={IconWarn} style={{ width: 14, height: 14 }} />
                        <p style={{ fontSize: 12, margin: 0, marginLeft: 5, marginTop: 2, whiteSpace: 'nowrap', color: "#c60242" }}>
                          Nomor Material tidak ditemukan
                        </p>
                      </div>
                    ) : !data.price && priceNotFound === true ? (
                      <div style={{ display: "inline-flex", marginLeft: '-19%', marginTop: 42, alignItems: "center" }}>
                        <img src={IconWarn} style={{ width: 14, height: 14 }} />
                        <p style={{ fontSize: 12, margin: 0, marginLeft: 5, marginTop: 2, whiteSpace: 'nowrap', color: "#c60242" }}>
                          Harga Material tidak ditemukan
                        </p>
                      </div>
                    ) : null}
                    <div className='value-item-material-desc'>{data.partDesc}</div>
                    <Input
                      type="text"
                      id={`"qty"${index}`}
                      min={1}
                      onChange={(event) => _eventInput(event.target.value.replace(/[^0-9]+/g, ""), index)}
                      value={data.qty !== null ? data.qty.toString().replace(/[^0-9]+/g, "") : ""}
                      className='value-item-editable'
                      style={
                        data.qty === null && data.partNumber != null ? { borderColor: "#C60242", borderWidth: 2 } : null
                      }
                    />
                    <div className='value-item'>{data.mou}</div>
                    <div className='value-item-price'>{Utils.formatCurrency(data.price)}</div>
                    <div className='value-item-price'>{data.amount != 0 ? Utils.formatCurrency(data.amount) : null}</div>
                  </div>
                );
              })}
              {listMaterial.length == 500 ? (
                <div style={{ alignItems: "center", justifyContent: "center", display: "flex" }}>
                  <p style={{ fontSize: 20, margin: 0, marginLeft: 5, marginTop: 2, color: "#c60242" }}>
                    Material melebihi batas
                  </p>
                </div>
              ) : (
                <div style={{ alignItems: "center", cursor: "pointer", justifyContent: "center", display: "flex" }}>
                  <div className='cardMore' onClick={() => _addRowsMaterial()}>
                    <p className='titleButtonMore'> Tambah Lebih Banyak</p>
                  </div>
                </div>
              )}
            </div>
            <hr />

            <Row>
              <div style={{ flexDirection: "row", display: "flex", alignItems: "center", flex: 1 }}>
                <div className='value-item-checkbox'>
                  <input type='checkbox' checked={selectAll} onChange={(event) => _checklistAll(event)} />
                </div>
                <p style={{ fontSize: '1vw', color: "#979797", marginBottom: 0 }}>Pilih semua</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 20, cursor: "pointer" }} onClick={() => setOpenModalConfirm(true)}>
                <img src={IconDeleteBin} style={{ width: '1.3vw', height: '1.2vw' }} />
                <p style={{ margin: 0, color: '#b91529' }}>Hapus</p>
              </div>
            </Row>

            {checkPrice === true ? (
              <div className='order-footer'>
                {loadingBtn ?
                  <div className='btn-buy'>
                    Memuat...
                  </div> :
                  <div
                    className='btn-buy'
                    onClick={() => {
                      _clickBucket(true)
                      setAnalyticClevertap("click", "Click_BuyNow", "View_Home_Screen", null)
                    }}
                  >
                    Beli Sekarang
                  </div>
                }
                {loadingBtn ?
                  <div className='btn-add-bucket'>
                    Memuat...
                  </div> :
                  <div
                    className='btn-add-bucket'
                    onClick={() => {
                      _clickBucket(false)
                      setAnalyticClevertap("click", "Click_AddBucket", "View_Home_Screen", null)
                    }}
                  >
                    Masukkan Keranjang
                  </div>
                }
              </div>
            ) : (
              <div className='order-footer'>
                {loadingBtn ?
                  <div className='btn-add-bucket'>
                    Memuat...
                  </div> :
                  <div className='btn-add-bucket' onClick={() => _checkPrice()}>
                    <p className='m-0' style={{ fontSize: '1.2vw' }}>Periksa harga</p>
                  </div>
                }
              </div>
            )}
          </>
        );
      default:
        return _renderListProduct();
    }
  };

  const _renderModalErrorFilePdf = () => {
    return (
      <ModalAccessDenied
        isOpen={openModalErrorFilePdf}
        isClose={() => setOpenModalErrorFilePdf(false)}
        errorText={"Silahkan upload dokumen dengan ukuran maksimal 5mb"}
        title={"Huhu sayang sekali..."}
      />
    );
  };

  const _renderModalErrorFilePdfFormat = () => {
    return (
      <ModalAccessDenied
        isOpen={openModalErrorFilePdfFormat}
        isClose={() => setOpenModalErrorFilePdfFormat(false)}
        errorText={"Silahkan upload dokumen PO dengan tipe PDF"}
        title={"Huhu sayang sekali..."}
      />
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

  const _renderModalErrorFilecSV = () => {
    return (
      <ModalAccessDenied
        isOpen={openModalErrorFileCsv}
        isClose={() => setOpenModalErrorFileCsv(false)}
        errorText={"Silahkan upload dokumen dengan tipe CSV"}
        title={"Huhu sayang sekali..."}
      />
    );
  };
  const _openModalErrorFileCsv = () => {
    setOpenModalErrorFileCsv(true);
  };
  const _renderModalErrorFileCsvSize = () => {
    return (
      <ModalAccessDenied
        isOpen={openModalErrorFileCsvSize}
        isClose={() => setOpenModalErrorFileCsvSize(false)}
        errorText={"Silahkan upload dokumen CSV maksimum 3mb"}
        title={"Huhu sayang sekali.."}
      />
    );
  };
  const _openModalErrorFileCsvSize = () => {
    setOpenModalErrorFileCsvSize(true);
  };
  const _renderModalErrorFile = () => {
    return (
      <ModalAccessDenied
        isOpen={openModalErrorFile}
        isClose={() => setOpenModalErrorFile(false)}
        errorText={"Silahkan masukkan dokumen PO untuk melanjutkan proses"}
        title={"Huhu sayang sekali..."}
      />
    );
  };
  const _openModalErrorPo = () => {
    setOpenModalErrorPo(true);
  };
  const _renderModalErrorPo = () => {
    return (
      <ModalAccessDenied
        isOpen={openModalErrorPo}
        isClose={() => (setOpenModalErrorPo(false), setLoadingBtn(false))}
        errorText={"Nomor PO kamu tidak benar untuk melanjutkan proses"}
        title={"Huhu sayang sekali..."}
      />
    );
  };
  const _openModalErrorFile = () => {
    setOpenModalErrorFile(true);
  };
  const _renderModalErrorBranch = () => {
    return (
      <ModalAccessDenied
        isOpen={openModalErrorBranch}
        isClose={() => setOpenModalErrorBranch(false)}
        errorText={"Silahkan pilih cabang UT untuk melanjutkan proses"}
        title={"Huhu sayang sekali..."}
      />
    );
  };

  const _openModalErrorBranch = () => {
    setOpenModalErrorBranch(true);
  };
  const _openModalErrorCart = () => {
    setOpenModalCart(true);
  };
  const _renderModalErrorCart = () => {
    return (
      <ModalAccessDenied
        isOpen={openModalCart}
        isClose={() => setOpenModalCart(false)}
        errorText={props.errorCartData}
        title={"Huhu sayang sekali..."}
      />
    );
  };

  const _renderModalErrorCheckPrice = () => {
    return (
      <ModalAccessDenied
        isOpen={modalError}
        isClose={() => setModalError(false)}
        errorText={"Gagal cek harga, silahkan coba kembali"}
        title={"Huhu sayang sekali..."}
      />
    );
  };

  const _renderModalMaterial = () => {
    return (
      <ModalAccessDenied
        isOpen={openModalErrorMaterial}
        isClose={() => setOpenModalErrorMaterial(false)}
        errorText={"Silahkan pilih barang yang tersedia"}
        title={"Huhu sayang sekali..."}
      />
    );
  };

  const _renderModalCart = () => {
    return (
      <ModalAccessDenied
        isOpen={openModalErrorCart}
        isClose={() => setOpenModalErrorCart(false)}
        errorText={"Keranjang anda masih kosong"}
        title={"Huhu sayang sekali..."}
      />
    );
  };

  const _renderModalSuccessAddBucket = () => {
    return (
      <ModalSuccessAddBucket
        isOpen={openModalAddBucket}
        toHome={() => window.location.reload()}
        toBucket={() => props.push(MENU.BUCKET_LIST)}
      />
    )
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

  useEffect(() => {
    if (props.user) {
      props.fetchTermCondition(props.user.tokenResponse.accessToken);
    }
  }, [props.user]);

  useEffect(() => {
    if (props.user) {
      if (props.dataTermCondition) {
        if (props.dataTermCondition.termAndConditionStatus == false) {
          setModalTermIsOpen(true);
          setLogin(false);
        } else {
          if (login) {
            if (props.user.customerCode === "ONETIMESTD") {
              setLogin(false);
              setOpenModalErrorUserOneTimes(true);
            } else {
              setProductFilter(1);
              setLogin(false);
            }
          }
        }
      };
    };
  }, [props.dataTermCondition])

  const _handleLogin = async (data) => {
    await props.login(data);
  };
  const _handleLoginGoogle = async (data) => {
    await props.loginGoogle(data)
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

  const setLogout = async () => {
    setLogin(false);
    props.clearStore();
    localStorage.clear();
    window.location.reload();
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
    setModalTermIsOpen(false);
    setProductFilter(1);
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
        loginGoogle={_handleLoginGoogle}
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
  const _clickOk = () => {
    setOpenModalErrorAr(false);
    localStorage.setItem("CUSTOMER", props.user?.user);
    localStorage.setItem("CUSTOMER", props.user?.user);
    const startDate = moment(new Date());
    const endDate = moment(new Date()).add(idleTimeout / 1000, "second");
    localStorage.setItem("idleTimeoutThreshold", JSON.stringify({ startDate: startDate, endDate: endDate }));
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
    <>
      <main className='login-page'>
        <div className='containerPaddingTop' />
        {_renderImagePromotion()}
        <div className='containerProduct'>
          {_renderSelectByBrand()}
          {_renderCheckStockParts()}
          {_renderUploadMaterial()}
          {_renderTabProduct()}
          {_renderModalErrorFile()}
          {_renderModalErrorBranch()}
          {_renderModalErrorCart()}
          {_renderModalErrorCheckPrice()}
          {_renderModalErrorPo()}
          {_renderModalErrorFilePdf()}
          {_renderModalErrorFilePdfFormat()}
          {_renderModalErrorFilecSV()}
          {_renderModalErrorUserOneTimes()}
          {_renderModalErrorFileCsvSize()}
          {_renderModalSuccessAddBucket()}
          {_renderModalMaterial()}
          {_renderModalCart()}
          {_renderModalTermCondition()}
        </div>
        {_renderListNews()}
        <ModalBranchSelect
          item={branchListOrder}
          isOpen={modalSelect}
          isClose={() => setModal(false)}
          save={(item) => (setModal(false), _setItemBranch(item))}
        />
        <ModalUpload
          isOpen={openModalUpload}
          isClose={() => setOpenModalUpload(false)}
          token={props.tokenResponse}
          download={() => _downloadFile()}
          upload={() => _uploadFileCsv()}
          nameFile={nameFile}
          submit={() => _submitFile()}
          cancel={() => setOpenModalUpload(false)}
        />
        <ModalConfirm
          isOpen={openModalConfirm}
          isClose={() => setOpenModalConfirm(false)}
          titleButtonCancel={"Kembali"}
          titleButtonContinue={"Lanjutkan"}
          title={"Kamu yakin?"}
          dialogTitle={"Kamu akan menghapus barang ini"}
          nameFile={nameFile}
          cancel={() => setOpenModalConfirm(false)}
          submit={() => _deleteChecklist()}
        />
        <ModalConfirm
          isOpen={openModalConfirmBranch}
          isClose={() => setOpenModalConfirmBranch(false)}
          titleButtonCancel={"Kembali"}
          titleButtonContinue={"Lanjutkan"}
          title={"Kamu yakin?"}
          dialogTitle={`Kamu akan melakukan perubahan titik cabang UT `}
          cancel={() => setOpenModalConfirmBranch(false)}
          submit={() => (setOpenModalConfirmBranch(false), setModal(true), setBranchSelect(null))}
        />
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
      </main>
    </>
  );
};

Landing.propTypes = {
  errorDesc: PropTypes.string,
  isLoading: PropTypes.bool,
  login: PropTypes.func,
  tokenResponse: PropTypes.object,
};
Landing.defaultProps = {
  errorDesc: null,
  isLoading: false,
  login: null,
  tokenResponse: null,
};
export default Landing;
