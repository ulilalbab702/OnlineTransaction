import React, { useState, useEffect } from "react";
import { Row, Col, Button, Input } from "reactstrap";
import OwlCarousel from "react-owl-carousel";
import { Heart, Share, Star, IconDenied, IconUTCall, IconMail, IconSuccess, HeartBlack, Admin } from "assets/icons";
import "./style/index.scss";
import { detailProduct, discountDetailProduct, avatar, avatar2, userIcon } from "assets/images";
import * as Utils from '../../utils/format.helper';
import Skeleton from "react-loading-skeleton";
import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import ModalLogin from "./../../components/ModalLogin/ModalLogin";
import { DialogContent, Modal } from "@material-ui/core";
import { MENU } from "constants/menu";
import firebase from "../../firebase/firebase";
import ModalAccessDenied from "components/ModalAccessDenied/ModalAccessDenied";
import ModalSignUp from "components/ModalSignUp/ModalSignUp";
import ModalVerifyCode from "../../components/ModalVerifyCode/ModalVerifyCode";
import ModalForgotPassword from "../../components/ModalForgotPassword/ModalForgotPassword";
import ModalNewPassword from "components/ModalNewPassword/ModalNewPassword";
import ModalSuccessAddBucket from "components/ModalSuccessAddBucket/ModalSuccessAddBucket";
import moment from "moment";
import { isMobile } from "react-device-detect";
import Viewer from 'react-viewer';
import { FaEnvelope, FaFacebookF, FaLink, FaShareAlt, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { EmailShareButton, FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import parse from 'html-react-parser';
import * as Strap from "reactstrap";

const idleTimeout = 1800000; // 30 menit
let failedCount = 0;
let loginLocked = false;
let timer = {
  minute: 0,
  second: 10,
};
let interval;

const DetailProductPage = (props) => {
  const [description, setDescription] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [isImages, setIsImages] = useState(false);

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
  const [quantity, setQuantity] = useState(1);
  const [successAddBucket, setSuccessAddBucket] = useState(false);
  const [viewImage, setViewImage] = useState(false);
  const [imageAttribute, setImageAttribute] = useState(false);
  const [openModalErrorAddBuket, setOpenModalErrorAddBuket] = useState(false);
  const [openModalErrorBuyNow, setOpenModalErrorBuyNow] = useState(false);
  const [openModalErrReview, setOpenModalErrReview] = useState(false);
  const [modalTermIsOpen, setModalTermIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [changes, setChanges] = useState(false);
  const [cek, setCek] = useState(false);

  const productId = props.match.params.productId;
  const productUrl = window.location.href;
  const cleanUrl = productUrl;

  const [loginLock, setloginLock] = useState(true);
  const [timerDisplay, setTimerDisplay] = useState({ minute: 0, second: 10 });


  useEffect(() => {
    setAnalyticClevertap("view", "View_ProductDetail_Screen", "View_ProductDetail_Screen", null)
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (props.user !== null) {
      localStorage.setItem("CUSTOMER", props.user?.user);
      const startDate = moment(new Date());
      const endDate = moment(new Date()).add(idleTimeout / 1000, "second");
      localStorage.setItem("idleTimeoutThreshold", JSON.stringify({ startDate: startDate, endDate: endDate }));
      setAnalyticClevertap("action", "Action_Login_Success", "View_ProductDetail_Screen", null);
      setLogin(false)
    } else if (props.error.errorLogin) {
      localStorage.setItem("loginTimer", JSON.stringify({ minute: 0, second: 0 }));
      setAnalyticClevertap("action", "Action_Login_Error", "View_ProductDetail_Screen", null);
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
    async function fetchData() {
      await props.fetchDetailProduct(productId);
    }
    fetchData();
  }, [props.user]);

  useEffect(() => {
    async function fetchReview() {
      await props.fetchReviewProduct(productId)
    };
    fetchReview();
  }, []);

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

  const _handleShowImage = () => {
    setAnalyticClevertap("click", "Click_ShareProduct", "View_ProductDetail_Screen", null);
    setViewImage(true);
    setImageAttribute(false);
  };
  const _handleCloseImage = () => {
    setViewImage(false);
  };
  const copyToClipboard = (text) => {
    let textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }
  const onCopyImageButtonClick = () => {
    setAnalyticClevertap("click", "Click_CopyLinkToClipboard", "View_ProductDetail_Screen", null)
    copyToClipboard(cleanUrl);
    setImageAttribute(true);
  }
  const share = () => {
    if (navigator.share) {
      navigator
        .share({
          url: cleanUrl,
        })
        .then(() => {
        })
        .catch(error => {
        });
    }
  }
  const createImageViewToolbar = (toolbars) => {
    if (isMobile) {
      return toolbars.concat([
        {
          key: "copy",
          render: <FaLink />,
          onClick: () => { onCopyImageButtonClick() }
        },
        {
          key: "share",
          render: <FaShareAlt />,
          onClick: () => { share() }
        }

      ]);
    } else if (!isMobile) {
      return toolbars.concat([
        {
          key: "facebook",
          render: <FacebookShareButton url={cleanUrl}>
            <FaFacebookF onClick={() => setAnalyticClevertap("click", "Click_ShareProductByFacebook", "View_ProductDetail_Screen", null)} />
          </FacebookShareButton>,
        },
        {
          key: "twitter",
          render: <TwitterShareButton url={cleanUrl}>
            <FaTwitter onClick={() => setAnalyticClevertap("click", "Click_ShareProductByTwitter", "View_ProductDetail_Screen", null)} />
          </TwitterShareButton>,
        },
        {
          key: "wa",
          render: <WhatsappShareButton url={cleanUrl}>
            <FaWhatsapp onClick={() => setAnalyticClevertap("click", "Click_ShareProductByWhatsapp", "View_ProductDetail_Screen", null)} />
          </WhatsappShareButton>,
        },
        {
          key: "email",
          render: <EmailShareButton url={cleanUrl}>
            <FaEnvelope onClick={() => setAnalyticClevertap("click", "Click_ShareProductByEmail", "View_ProductDetail_Screen", null)} />
          </EmailShareButton>,
        },
        {
          key: "copy",
          render: <FaLink />,
          onClick: () => onCopyImageButtonClick()
        },
      ]);
    }
  }

  const _handleAddWishlist = async () => {
    const { user, detailProduct } = props;
    if (detailProduct?.isWishlisted) {
      if (user) {
        setAnalyticClevertap("action", "Action_DeleteWishlist", "View_ProductDetail_Screen", ["Action_DeleteWishlist", { "Product_Name": props.detailProduct?.materialName }]);
        await props.fetchDeleteSigleWishlist(user.tokenResponse.accessToken, [productId])
        await props.fetchDetailProduct(productId);
      } else {
        setLogin(true);
      }
    } else {
      if (user) {
        setAnalyticClevertap("action", "Action_AddToWishlist", "View_ProductDetail_Screen", ["Action_AddToWishlist", { "Product_Name": props.detailProduct?.materialName }]);
        await props.fetchAddWishlist(user.tokenResponse.accessToken, { productId });
        await props.fetchDetailProduct(productId);
      } else {
        setLogin(true);
      }
    }
  };

  const _renderModalErrorAddBucket = () => {
    return (
      <ModalAccessDenied
        isOpen={openModalErrorAddBuket}
        isClose={() => setOpenModalErrorAddBuket(false)}
        title={"Masukkan Keranjang"}
        errorText={"Gagal memasukkan ke keranjang!"}
      />
    );
  };
  const _renderModalErrorBuyNow = () => {
    return (
      <ModalAccessDenied
        isOpen={openModalErrorBuyNow}
        isClose={() => setOpenModalErrorBuyNow(false)}
        title={"Beli Sekarang"}
        errorText={"Gagal beli sekarang!"}
      />
    );
  };

  const _skeletonDescription = () => {
    return (
      <Col style={{ marginLeft: "3rem" }}>
        <p className="textDescription">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </p>
      </Col>
    )
  };

  const handleStarRating = (rating) => {
    const arr = [];
    for (let i = 0; i < rating; i++) {
      const newArr = { i };
      arr.push(newArr);
    }
    return (
      <Row style={{ marginLeft: "-5px", marginTop: "-10px" }}>
        {arr.map((item) => (
          <img key={item} className='ratingReview' src={Star} />
        ))}
      </Row>
    );
  };
  const _skeletonReview = () => {
    return (
      <div>
        <Row style={{ marginTop: "2rem" }}>
          <Skeleton className='iconAva' height={50} width={50} circle />
          <Col>
            <p className='titleName'>
              <Skeleton width={100} height={20} />
            </p>
            <Row style={{ marginLeft: "-5px", marginTop: "-10px" }}>
              <Skeleton width={20} height={20} circle className='ratingReview' />
              <Skeleton width={20} height={20} circle className='ratingReview' />
              <Skeleton width={20} height={20} circle className='ratingReview' />
              <Skeleton width={20} height={20} circle className='ratingReview' />
              <Skeleton width={20} height={20} circle className='ratingReview' />
            </Row>
            <p className='dateRating'>
              <Skeleton width={80} />
            </p>
            <p className='reviewDesc'>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </p>
          </Col>
        </Row>
        <hr className='mt-0'></hr>
        <Row style={{ marginTop: "2rem" }}>
          <Skeleton className='iconAva' height={50} width={50} circle />
          <Col>
            <p className='titleName'>
              <Skeleton width={100} height={20} />
            </p>
            <Row style={{ marginLeft: "-5px", marginTop: "-10px" }}>
              <Skeleton width={20} height={20} circle className='ratingReview' />
              <Skeleton width={20} height={20} circle className='ratingReview' />
              <Skeleton width={20} height={20} circle className='ratingReview' />
              <Skeleton width={20} height={20} circle className='ratingReview' />
              <Skeleton width={20} height={20} circle className='ratingReview' />
            </Row>
            <p className='dateRating'>
              <Skeleton width={80} />
            </p>
            <p className='reviewDesc'>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </p>
          </Col>
        </Row>
      </div>
    )
  };
  const _renderDescription = () => {
    if (description === 0) {
      if (props.detailProduct !== null) {
        return (
          <Col style={{ marginLeft: "3rem" }}>
            <div className="textDescription">
              {parse(props.detailProduct.materialDescription ? props.detailProduct.materialDescription : "")}
            </div>
          </Col>
        );
      }
      return _skeletonDescription();
    } else {
      if (props.detailProduct !== null) {
        return (
          <div>
            {props.reviewProductData?.data.map((revw, index) => {
              return (
                <>
                  <Row style={{ marginTop: "2rem" }} key={index}>
                    <img className='iconAva' src={revw.isAnonymous || !revw.profilPicture ? userIcon : "data:image/png;base64," + revw.profilPicture} />
                    <Col>
                      <p className='titleName'>{revw.fullName}</p>
                      {handleStarRating(revw.star)}
                      <p className='dateRating'>{moment(revw.reviewDate).format("DD MMMM YYYY")}</p>
                      <p className='reviewDesc'>
                        {revw.reviewDescription}
                      </p>
                      {revw.reviewRepliedDescription ?
                        <Row className="conReplayReview">
                          <img className='avatarReplayReview' src={Admin} />
                          <Col>
                            <p className='titleName' style={{ marginBottom: 0 }}>Admin UT Connect</p>
                            <p className='dateRating'>{moment(revw.reviewRepliedDate).format("DD MMMM YYYY")}</p>
                            <p className='reviewDesc' style={{ marginBottom: 0 }}>
                              {revw.reviewRepliedDescription}
                            </p>
                          </Col>
                        </Row> : null}
                    </Col>
                  </Row>
                  <hr className='mt-0'></hr>
                </>
              )
            })}
          </div>
        );
      }
      return _skeletonReview();
    }
  };

  const _skeletonImage = () => {
    return (
      <div style={{ paddingLeft: "12vw", marginTop: '7vw', flex: 1 }}>
        <Skeleton width={300} height={300} className='imageDetailProduct' />
        <Row className='gridListImage'>
          <Col>
            <div className='cardImageItem'>
              <Skeleton className='imageItem' />
            </div>
          </Col>
          <Col>
            <div className='cardImageItem'>
              <Skeleton className='imageItem' />
            </div>
          </Col>
          <Col>
            <div className='cardImageItem'>
              <Skeleton className='imageItem' />
            </div>
          </Col>
          <Col>
            <div className='cardImageItem'>
              <Skeleton className='imageItem' />
            </div>
          </Col>
        </Row>
      </div>
    )
  };

  const _renderImage = () => {
    if (props.detailProduct !== null) {
      if (props.detailProduct.imageUrls !== undefined) {
        return (
          <div style={{ paddingLeft: "12vw", marginTop: '0', flex: 1 }}>
            <div className="conImageDetailProduct">
              <img
                className='imageDetailProduct'
                src={
                  isImages ?
                    imageUrl :
                    props.detailProduct.imageThumbnailUrl
                }
              />
            </div>
            <div className="container-carousel">
              <OwlCarousel
                className="carousel-product-detail"
                nav={true}
                navContainerClass={'owl-nav2'}
                navClass={['owl-prev2', 'owl-next2']}
                dots={false}
                items={4}
                navText={[
                  '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
                  "<i class='fa fa-chevron-right'></i>",
                ]}
              >
                <span
                  className='cardImageItem'
                  onClick={() => {
                    setImageUrl(props.detailProduct?.imageThumbnailUrl);
                    setIsImages(true);
                  }}
                >
                  <img className='imageItem' src={props.detailProduct?.imageThumbnailUrl} />
                </span>
                {props.detailProduct.imageUrls.map((item) => {
                  return (
                    <span
                      className='cardImageItem'
                      onClick={() => {
                        setAnalyticClevertap("click", "Click_ImageThumbnail", "View_ProductDetail_Screen", null);
                        setImageUrl(item);
                        setIsImages(true);
                      }}
                    >
                      <img className='imageItem' src={item} />
                    </span>
                  );
                })}
              </OwlCarousel>
            </div>
          </div>
        )
      }
    }
    else {
      return _skeletonImage();
    }
  }

  const _skeletonDescProduct = () => {
    return (
      <div style={{ paddingLeft: "7vw", marginTop: '7vw', flex: 1 }}>
        <p className='titleBrandProduct'>
          <Skeleton width={150} height={20} />
        </p>
        <p className='titleProductDetail'>
          <Skeleton width={200} height={25} />
        </p>
        <Row>
          <Skeleton height={20} width={25} className='ratingProduct' circle />
          <Skeleton height={20} width={40} className='titleRating' />
          <Skeleton height={20} width={70} className='descRating' />
          <Skeleton height={10} width={15} className='titleRating' circle />
          <Skeleton height={20} width={50} className='descRating' />
          <Skeleton height={20} width={50} className='titleRating' />
        </Row>
        <hr className='mt-4'></hr>
        <Row>
          <Skeleton height={30} width={150} className='priceProduct' />
          <Skeleton height={25} width={120} className='priceBefore' />
          <Skeleton height={25} width={40} className='discountProduct' />
        </Row>
        <hr className='mt-2'></hr>
        <Row>
          <p className='serialNumberProduct'>
            <Skeleton width={100} height={20} />
          </p>
          <Col>
            <Row>
              <p className='unitCodeProduct'>
                <Skeleton width={25} height={20} />
              </p>
              <p className='canBeUse'>
                <Skeleton width={150} height={20} />
              </p>
            </Row>
            <Row>
              <p className="ml-2">
                <Skeleton width={50} height={20} />
              </p>
              <p className="ml-2">
                <Skeleton width={50} height={20} />
              </p>
              <p className="ml-2">
                <Skeleton width={50} height={20} />
              </p>
            </Row>
          </Col>
        </Row>
        <hr className='mt-0'></hr>
        <Row>
          <p className='serialNumberProduct'>
            <Skeleton width={100} height={20} />
          </p>
          <Col>
            <Row>
              <p className='unitDiscountProduct'>
                <Skeleton width={150} />
              </p>
            </Row>
            <Row>
              <p className='unitDiscountProduct'>
                <Skeleton width={150} />
              </p>
            </Row>
          </Col>
        </Row>
        <hr className='mt-0'></hr>
        <Row>
          <p className='serialNumberProduct'>
            <Skeleton width={100} height={20} />
          </p>
          <Col>
            <p className='serialNumberProduct'>
              <Skeleton width={80} height={20} />
            </p>
          </Col>
        </Row>
        <Row>
          <p className='serialNumberProduct'>
            <Skeleton width={100} height={20} />
          </p>
          <Col>
            <Skeleton width={100} height={20} />
          </Col>
        </Row>
        <hr className='mt-0'></hr>
        <Row>
          <p className='buyButton px-2'>
            <Skeleton height={15} />
          </p>
          <p className='addButton px-2'>
            <Skeleton height={15} />
          </p>
        </Row>
      </div>
    )
  };

  const _clickBucket = async (value) => {
    const { user } = props;
    if (user) {
      const body = {
        isBuyNow: value,
        poCustomer: "",
        poCustomerDate: "",
        filename: "",
        path: "",
        inquiryNumber: "",
        carts: [{
          "productId": productId,
          "itemQty": quantity,
          "price": props.detailProduct.basePrice,
          "orderType": 1
        }],
        cookiesData: "",
        branchId: null,
      };
      if (value === true) {
        const data = await props.fetchCartPost(user.tokenResponse.accessToken, body);
        const { errorCartData, cartData } = props;
        if (data != null && data != "400") {
          props.push(MENU.BUCKET_LIST, data.cartId);
          setAnalyticClevertap("action", "Action_BuyNowProduct_Success", "View_ProductDetail_Screen", ["Action_BuyNowProduct_Success", { "Product_Name_Qty": data.cartDetail[0].partDescription + '_Qty = ' + data.cartDetail[0].itemQty }]);
        } else {
          if (errorCartData) {
            setAnalyticClevertap("action", "Action_BuyNowProduct_Error", "View_ProductDetail_Screen", ["Action_BuyNowProduct_Error", { "Error_Message": errorCartData }]);
          }
          setOpenModalErrorBuyNow(true);
        }
      } else {
        const data = await props.fetchCartPost(user.tokenResponse.accessToken, body);
        const { errorCartData, cartData } = props;
        if (data != null && data != "400") {
          setAnalyticClevertap("action", "Action_AddProductToBucket_Success", "View_ProductDetail_Screen", ["Action_AddProductToBucket_Success", { "Product_Name_Qty": data.cartDetail[0].partDescription + '_Qty = ' + data.cartDetail[0].itemQty }]);
          setSuccessAddBucket(true);
        } else {
          if (errorCartData) {
            setAnalyticClevertap("action", "Action_AddProductToBucket_Error", "View_ProductDetail_Screen", ["Action_AddProductToBucket_Error", { "Error_Message": errorCartData }]);
          }
          setOpenModalErrorAddBuket(true);
        }
      }
      await props.fetchCartByUserId(user.userId, user.tokenResponse.accessToken);
    } else {
      setLogin(true)
    }
  }

  const _renderModalSuccessAddBucket = () => {
    return (
      <ModalSuccessAddBucket
        isOpen={successAddBucket}
        toHome={() => setSuccessAddBucket(false)}
        toBucket={() => props.push(MENU.BUCKET_LIST)}
      />
    )
  };

  const _renderDescProduct = () => {
    if (props.detailProduct !== null) {
      return (
        <div className='bgTP' style={{ paddingLeft: "0", marginTop: '0', marginLeft: "0px !important", flex: 1 }}>
          <p className='titleBrandProduct'>{props.detailProduct.brandName}</p>
          <p className='titleProductDetail'>{props.detailProduct.materialName}</p>
          <Row>
            <img className='ratingProduct' src={Star} />
            <p className='titleRating'>{props.detailProduct.rating}</p>
            <p className='descRating'>{`(${props.detailProduct.reviewCount} Ulasan)`}</p>
          </Row>
          <hr className='my-3' style={{ marginLeft: -15 }}></hr>
          <Row>
            <p className='priceProduct'>Rp {Utils.formatCurrency(props.detailProduct.promotionPrice)}</p>
            {props.detailProduct.customerDiscount !== "" ?
              (<p className='priceBefore'>Rp {Utils.formatCurrency(props.detailProduct.basePrice)}</p>) : null}
            {props.detailProduct.discountPercent !== "" ?
              (<p className='discountProduct'>{props.detailProduct.discountPercent}</p>) : null}
          </Row>
          <hr className='my-3' style={{ marginLeft: -15 }}></hr>
          <Row>
            <p className='serialNumberProduct'>Kode produk</p>
            <Col>
              <p className='materialNumber'>{props.detailProduct.materialNumber}</p>
            </Col>
          </Row>
          <hr className='my-3' style={{ marginLeft: -15 }}></hr>
          <Row>
            <p className='serialNumberProduct'>Model unit</p>
            <Col>
              <Row style={{ marginRight: 0 }}>
                {props.detailProduct.modelUnit.map((item) => (
                  <p className='unitCodeBrand'>{item}</p>
                ))}
              </Row>
            </Col>
          </Row>
          <hr className='my-3' style={{ marginLeft: -15 }}></hr>
          <Row>
            <p className='serialNumberProduct'>Kategori</p>
            <Col>
              <p className='materialNumber'>{props.detailProduct.category}</p>
            </Col>
          </Row>
          <hr className='my-3' style={{ marginLeft: -15 }}></hr>
          <Row>
            <p className='serialNumberProduct'>Berat</p>
            <Col>
              <p className='materialNumber'>{props.detailProduct.weight} gram</p>
            </Col>
          </Row>
          <hr className='my-3' style={{ marginLeft: -15 }}></hr>
          <Row>
            <p className='serialNumberProduct'>Dimensi produk</p>
            <Col>
              <p className='materialNumber'>{props.detailProduct.length} x {props.detailProduct.width} x {props.detailProduct.height} cm<sup>3</sup></p>
            </Col>
          </Row>
          <hr className='my-3' style={{ marginLeft: -15 }}></hr>
          <Row>
            <p className='serialNumberProduct'>Pengiriman</p>
            <Col>
              <p className='materialNumber'>{props.detailProduct?.isCourierAvaliable ? "Dapat dikirim" : "Ambil di cabang"}</p>
            </Col>
          </Row>
          <hr className='my-3' style={{ marginLeft: -15 }}></hr>
          <Row>
            <Row style={{ display: 'flex', marginLeft: 0, marginRight: 0, flexDirection: 'row' }}>
              <span className="qty" onClick={quantity < 2 ? null : () => setQuantity(quantity - 1)}>-</span>
              <span className="qty number">{quantity}</span>
              <span className="qty" onClick={() => setQuantity(quantity + 1)}>+</span>
            </Row>
            {props.loadingCart ?
              <p className='buyButton'>Loading...</p> :
              <p className='buyButton' style={{ cursor: 'pointer' }} onClick={() => _clickBucket(true)}>Beli Sekarang</p>}
            {props.loadingCart ?
              <p className='addButton'>Loading...</p> :
              <p className='addButton' style={{ cursor: 'pointer' }} onClick={() => _clickBucket(false)}>Masukkan Keranjang</p>}
          </Row>
        </div>
      )
    }
    else {
      return _skeletonDescProduct();
    }
  }

  const _renderBreadcrumb = () => {
    const breadcrums = [
      {
        'url': MENU.HOME,
        'name': 'Part Online Transaction'
      }
    ];
    return (
      <Breadcrumb
        linkBreadcrumb={breadcrums}
        typography={"Detail Produk"}
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
            window.location.reload();
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

  const _renderModalErrReview = () => {
    return (
      <ModalAccessDenied
        isOpen={openModalErrReview}
        isClose={() => setOpenModalErrReview(false)}
        title={"Ulasan Produk"}
        errorText={"Ulasan produk masih kosong."}
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
    <div style={{ marginBottom: "4rem" }} >
      <Viewer
        visible={viewImage}
        onClose={() => _handleCloseImage()}
        onMaskClick={() => _handleCloseImage()}
        images={[{ src: props.detailProduct?.imageThumbnailUrl, alt: 'Copied to clipboard: ' + cleanUrl }]}
        noNavbar={true}
        attribute={imageAttribute}
        zoomSpeed={0.1}
        noImgDetails={true}
        rotatable={false}
        scalable={false}
        changeable={false}
        showTotal={false}
        customToolbar={toolbars => createImageViewToolbar(toolbars)}
      />
      <div style={{ margin: '0 10%', marginTop: '6vw', marginBottom: '1rem' }}>
        {_renderBreadcrumb()}
      </div>
      <Row className='defaultFlexProduct'>
        {_renderImage()}
        {_renderDescProduct()}
      </Row>
      <hr className='mt-0'></hr>
      <Row>
        <Row style={{ marginLeft: "1rem", flex: 1 }}>
          <p
            className={description === 0 ? "descriptionProductActive" : "descriptionProduct"}
            onClick={() => {
              setAnalyticClevertap("click", "Click_ProductDescription", "View_ProductDetail_Screen", null);
              setDescription(0);
            }}
          >
            {props.detailProduct !== null ?
              "Deskripsi" :
              <Skeleton height={25} width={100} />
            }
          </p>
          <p
            className={description === 1 ? "descriptionProductActive" : "descriptionProduct"}
            onClick={() => {
              setAnalyticClevertap("click", "Click_ProductReview", "View_ProductDetail_Screen", null);
              props.detailProduct.reviewCount < 1 ?
                setOpenModalErrReview(true) :
                setDescription(1)
            }}
          >
            {props.detailProduct !== null ?
              `Ulasan (${props.detailProduct.reviewCount})` :
              <Skeleton height={25} width={100} />
            }
          </p>
        </Row>
        {props.detailProduct !== null ?
          <Row style={{ marginRight: "4rem", justifyContent: "flex-end", flex: 1 }}>
            <p className='descriptionFavourite' style={{ cursor: 'pointer' }} onClick={() => _handleAddWishlist()}>Favorit</p>
            <img className='iconFavourite' src={props.detailProduct.isWishlisted ? Heart : HeartBlack} onClick={() => _handleAddWishlist()} />
            <p className='descriptionFavourite' style={{ cursor: 'pointer' }} onClick={() => _handleShowImage()}>Bagikan</p>
            <img className='iconFavourite' src={Share} onClick={() => _handleShowImage()} />
          </Row> :
          <Row style={{ marginRight: "4rem", justifyContent: "flex-end", flex: 1 }}>
            <p className='descriptionFavourite'>
              <Skeleton width={100} height={20} />
            </p>
            <Skeleton height={20} width={20} className='iconFavourite' />
            <p className='descriptionFavourite'>
              <Skeleton width={100} height={20} />
            </p>
            <Skeleton height={20} width={20} className='iconFavourite' />
          </Row>
        }
      </Row>
      <hr className='mt-0'></hr>
      {_renderDescription()}
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
      {_renderModalSuccessAddBucket()}
      {_renderModalErrorAddBucket()}
      {_renderModalErrorBuyNow()}
      {_renderModalErrReview()}
      {_renderModalTermCondition()}
    </div>
  );
};
export default DetailProductPage;

