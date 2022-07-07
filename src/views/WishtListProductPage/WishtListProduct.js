import React, { useEffect, useState } from "react";
import "./WishtListProduct.scss";
import firebase from "../../firebase/firebase";
import { Row, Col, Modal, ModalBody } from "reactstrap";
import { Star, IconLike, IconMail, IconUTCall, IconAsk } from "assets/icons";
import { imageNotFound } from "assets/images";
import { MENU } from "constants/menu";
import Skeleton from "react-loading-skeleton";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import SearchInputMini from "./../../components/SearchInputMini";
import { Checkbox } from "@material-ui/core";
import * as Utils from "../../utils/format.helper";

const WishtListProduct = (props) => {
  const dataWishlist = props.wishlistData?.data;
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [screenWidth, setScreen] = useState(null);
  const [edit, setEdit] = useState(false);
  const [selectAll, checkListAll] = useState(false);
  const [listWishlist, setListWishlist] = useState([]);
  const [modalDelete, setModalDelete] = useState(false);
  const [filters, setFilters] = useState("");

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
    setAnalyticClevertap("view", "View_Wishlist_Screen", "View_Wishlist_Screen", null);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const { user } = props;
    if (user !== null) {
      async function fetchWishlistData() {
        await props.fetchLisWishlist(user.tokenResponse.accessToken, filters);
      }
      fetchWishlistData();
    }
    if (modalDelete === true) {
      setModalDelete(false);
      setEdit(false);
    }
  }, [props.wishlistDel, filters]);

  useEffect(() => {
    if (dataWishlist != null && dataWishlist != undefined) {
      setArrayDataWishlist();
    }
  }, [dataWishlist]);

  const setArrayDataWishlist = () => {
    const newArray = [];
    for (let i = 0; dataWishlist.length > i; i++) {
      const arr = {
        productId: dataWishlist[i].productId,
        brandName: dataWishlist[i].brandName,
        imageThumbnailUrl: dataWishlist[i].imageThumbnailUrl,
        materialNumber: dataWishlist[i].materialNumber,
        materialName: dataWishlist[i].materialName,
        basePrice: dataWishlist[i].basePrice,
        promotionPrice: dataWishlist[i].promotionPrice,
        rating: dataWishlist[i].rating,
        countReview: dataWishlist[i].countReview,
        discountPercent: dataWishlist[i].discountPercent,
        productSold: dataWishlist[i].productSold,
        isChecked: false,
      };
      newArray.push(arr);
    }
    setListWishlist(newArray);
  }

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

  const selectList = (event, index) => {
    let newArr = listWishlist.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          ["isChecked"]: event.target.checked,
        };
      } else {
        return item;
      }
    });
    setListWishlist(newArr);
    checkListAll(event.target.checked ? false : false);
  }
  const _selectAll = (event) => {
    setAnalyticClevertap("click", "Click_SelectAllWishlist", "View_Wishlist_Screen", null);
    checkListAll(event.target.checked)
    const newCheckBoxObj = [];
    for (let i = 0; listWishlist.length > i; i++) {
      const array = {
        productId: dataWishlist[i].productId,
        brandName: dataWishlist[i].brandName,
        imageThumbnailUrl: dataWishlist[i].imageThumbnailUrl,
        materialNumber: dataWishlist[i].materialNumber,
        materialName: dataWishlist[i].materialName,
        basePrice: dataWishlist[i].basePrice,
        promotionPrice: dataWishlist[i].promotionPrice,
        rating: dataWishlist[i].rating,
        countReview: dataWishlist[i].countReview,
        discountPercent: dataWishlist[i].discountPercent,
        productSold: dataWishlist[i].productSold,
        isChecked: event.target.checked
      };
      newCheckBoxObj.push(array);
    }
    setListWishlist(newCheckBoxObj);
  }
  const _deleteList = async () => {
    setAnalyticClevertap("click", "Click_DeleteWishlist", "View_Wishlist_Screen", null);
    var checkedArray = listWishlist.filter((item) => item.isChecked == true);
    const newArray = [];
    for (let i = 0; checkedArray.length > i; i++) {
      newArray.push(checkedArray[i].productId);
    }
    const { user } = props;
    await props.fetchDeleteBulkWishlist(user.tokenResponse.accessToken, newArray);
    if (props.wishlistDel) {
      setAnalyticClevertap("action", "Action_DeleteWishlist_Success", "View_Wishlist_Screen", null);
    } else {
      setAnalyticClevertap("action", "Action_DeleteWishlist_Error", "View_Wishlist_Screen", null);
    }
  }

  const _renderBreadCrumps = () => {
    const breadcrums = [
      {
        url: MENU.HOME,
        name: "Part Online Transaction",
      },
    ];
    return (
      <>
        <Breadcrumb linkBreadcrumb={breadcrums} typography={"Favorit"} />
        <div style={{ paddingBottom: "1rem" }} />
      </>
    );
  };

  const _renderNotFound = () => {
    return (
      <div className='containerWishlistNotFound'>
        <img src={imageNotFound} className='imgWishlistNotFound'></img>
        <p className='titleWishlistNotFound'>Tidak bisa menemukan barang</p>
      </div>
    )
  };

  const _renderListProduct = () => {
    if (props.wishlistLoading && screenWidth > 900) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Skeleton style={{ margin: 10 }} count={4} height={300} width={200} />
          <Skeleton style={{ margin: 10 }} count={4} height={300} width={200} />
          <Skeleton style={{ margin: 10 }} count={4} height={300} width={200} />
        </div>
      );
    } else if (props.wishlistLoading && screenWidth >= 760 && screenWidth < 900) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Skeleton style={{ margin: 10 }} count={4} height={200} width={160} />
          <Skeleton style={{ margin: 10 }} count={4} height={200} width={160} />
          <Skeleton style={{ margin: 10 }} count={4} height={200} width={160} />
        </div>
      );
    } else if (props.wishlistLoading && screenWidth < 760) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Skeleton style={{ margin: 10 }} count={2} height={200} width={160} />
          <Skeleton style={{ margin: 10 }} count={2} height={200} width={160} />
          <Skeleton style={{ margin: 10 }} count={2} height={200} width={160} />
        </div>
      );
    } else if (props.wishlistData?.meta.totalItems < 1) {
      return _renderNotFound();
    } else if (dataWishlist != undefined && dataWishlist != null) {
      return (
        <div
          style={{
            marginTop: 10,
            marginBottom: 10,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Row className='gridListProductFavorite  defaultMargin'>
            {listWishlist.map((item, index) => {
              return (
                <a
                  key={index}
                  className='cardListLP'
                  href={!edit && `${MENU.DETAIL_PRODUCT}${item.productId}`}
                  style={edit ? { backgroundColor: '#dedede', opacity: '0.7', height: 'auto', paddingBottom: 10 } : { height: 'auto', paddingBottom: 10, textDecoration: 'none' }}
                >
                  <Col>
                    <div className='cardImageLP'>
                      {edit ?
                        <div
                          style={{
                            display: "flex",
                            position: "absolute",
                            top: 20,
                            left: 20,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Checkbox
                            style={{ color: "#5ACC4D", padding: 0, marginLeft: -2, zIndex: 1 }}
                            checked={item.isChecked}
                            onChange={(event) => selectList(event, index)}
                          />
                        </div> : null}
                      <div
                        style={{
                          display: "flex",
                          position: "absolute",
                          top: 20,
                          right: 20,
                          backgroundColor: "#dedede",
                          borderRadius: 10,
                          width: 20,
                          height: 20,
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 1,
                        }}
                      >
                        <img src={IconLike} width='10' height='10' />
                      </div>

                      <img className='imageList' src={item.imageThumbnailUrl} />
                    </div>
                    <p className='titleListProduct'>{item.brandName}</p>
                    <p className='titleListProduct2' style={{ marginBottom: 0 }}>{item.materialName}</p>
                    <p className='titleListProduct' style={{ fontFamily: "SFProText-Regular", opacity: 0.5, marginBottom: 10 }}>({item.materialNumber})</p>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <p className='titleListProduct3'>Rp {Utils.formatCurrency(item.basePrice)}</p>
                      <p className='titleListProduct4' style={{ color: 'rgb(20, 143, 15)', marginLeft: 5, fontSize: 12, marginBottom: 0 }}>{item.discountPercent}</p>
                    </div>
                    <p className='titleListProduct4'>Rp {Utils.formatCurrency(item.promotionPrice)}</p>
                    <p className='titleListProduct' style={{ opacity: 0.8 }}>
                      {item.countReview != 0 ?
                        <img src={Star} style={{ width: 13, height: 13, marginRight: 5 }} /> : null}
                      {item.rating != 0 ?
                        <>{item.rating} <span style={{ marginRight: 10 }}>({item.countReview})</span></> : null}
                      {item.productSold != 0 ? <span>Terjual ({item.productSold})</span> : null}
                    </p>
                  </Col>
                </a>
              );
            })}
          </Row>
        </div>
      );
    } else if (dataWishlist == undefined) {
      return _renderNotFound();
    }
  };

  const _renderModalDelete = () => {
    return (
      <Modal
        centered
        isOpen={modalDelete}
        toggle={() => setModalDelete(false)}
        onClosed={() => setModalDelete(false)}
      >
        <ModalBody className='container-modal-del-wishlist'>
          <div className='del-modal-body'>
            <p className='title-modal'>Kamu Yakin?</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={IconAsk} className='iconModal' />
            </div>
            <p className='titleAvailable'>Kamu akan menghapus item favorit</p>
            <div className='con-btn'>
              <div
                className='btn-cancel'
                onClick={() => {
                  setAnalyticClevertap("click", "Click_CancleChangeWishlist", "View_Wishlist_Screen", null)
                  setModalDelete(false)
                }}
              >
                <p className='text-btn'>Kembali</p>
              </div>
              <div className='btn-submit' onClick={() => _deleteList()} style={{ cursor: "pointer" }}>
                <p className='text-btn'>Lanjutkan</p>
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
        </ModalBody>
      </Modal>
    );
  };

  const _renderHeader = () => {
    return (
      <div className='containerFlex'>
        <div style={{ justifyContent: "flex-start", display: "flex" }}>
          <SearchInputMini
            placeHolder={"Cari Produk"}
            name={filters}
            handleEnterKey={(event) => setFilters(event)}
          />
        </div>
        {edit === false ? (
          !props.wishlistData?.meta.totalItems < 1 ?
            (<div
              className="btn-wish-edit"
              onClick={() => {
                setAnalyticClevertap("click", "Click_ChangeWishlist", "View_Wishlist_Screen", null)
                setEdit(true)
              }}
            >
              <p style={{ marginBottom: 0 }}>Ubah Favorit</p>
            </div>
            ) : (
              <div className="btn-wish-edit" style={{ cursor: 'default' }}>
                <p style={{ marginBottom: 0 }}>Ubah Favorit</p>
              </div>)
        ) : (
          <div className='containerFlex'>
            <div
              className="btn-wish-delete"
              onClick={() => setModalDelete(true)}
            >
              <p style={{ marginBottom: 0 }}>Hapus</p>
            </div>
            <div
              className="btn-wish-cancle"
              onClick={() => {
                setAnalyticClevertap("click", "Click_CancleChangeWishlist", "View_Wishlist_Screen", null)
                setEdit(false)
              }}
            >
              <p style={{ marginBottom: 0 }}>Batal</p>
            </div>
          </div>
        )}
        {edit ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: 'auto',
              marginRight: '6vw',
            }}
          >
            <Checkbox
              style={{ color: "#5ACC4D", padding: 0, marginLeft: -2 }}
              checked={selectAll}
              onChange={(event) => _selectAll(event)}
            />
            <p style={{ marginBottom: 0 }}>Pilih Semua</p>
          </div>
        ) : null}
      </div>
    );
  };
  return (
    <Col className='containerPadding containerPaddingTop'>
      {_renderModalDelete()}
      {_renderBreadCrumps()}
      {_renderHeader()}
      {_renderListProduct()}
    </Col>
  );
};

export default WishtListProduct;
