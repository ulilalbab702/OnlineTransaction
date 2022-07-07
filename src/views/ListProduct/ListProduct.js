import React, { useEffect, useState } from "react";
import "./ListProduct.scss";
import "../../components/SearchInputMini/SearchInputMini.scss";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";
import { InputBase, Paper } from '@material-ui/core';
import firebase from "../../firebase/firebase";
import { IconZoom, Star, StarGray } from "assets/icons";
import {
  logoKomatsu,
  logoScania,
  logoBomag,
  logoTadano,
  logoUdtruck,
  komatsupc200,
  ImageKomatsu,
  ImageBomag,
  ImageScania,
  ImageUdtruck,
  ImageTadano,
  imageNotFound,
} from "assets/images";
import { MENU } from "constants/menu";
import Skeleton from "react-loading-skeleton";
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { setStorage, getStorage } from "utils/storage.helper";
import * as Utils from "../../utils/format.helper";

const ListProduct = (props) => {
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [productFilter, setProductFilter] = useState(0);
  const [selectView, setSelectView] = useState(false);
  const [valueSelect, setValueSelect] = useState("Select Filter");
  const [check, setCheck] = useState(false);
  const [itemFilter, setItemFilter] = useState([
    { id: 1, value: "PC200", isChecked: false },
    { id: 2, value: "PC195", isChecked: false },
    { id: 3, value: "PC2000", isChecked: false },
    { id: 4, value: "PC3000", isChecked: false },
  ]);
  const [listSelected, setSelected] = useState("");
  const [index, setIndex] = useState(null);
  const [screenWidth, setScreen] = useState(null);
  const [brand, setBrand] = useState(props?.history?.location.state != undefined ? props.history.location.state.brand : "")
  const [category, setCategory] = useState(props?.history?.location.state != undefined ? props.history.location.state.category : "");
  const [minimumPrice, setMinPrice] = useState();
  const [maximumPrice, setMaxPrice] = useState();
  const [ratingValue, setRating] = useState("");
  const [filters, setFilters] = useState("");
  const [submitSearch, setSubmitSearch] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [changePrice, setChangePrice] = useState(false);
  const [imageBranch, setImageBranch] = useState([
    {
      image: ImageKomatsu,
      name: "KOMATSU",
    },
    {
      image: ImageScania,
      name: "SCANIA",
    },

    {
      image: ImageUdtruck,
      name: "UD TRUCK",
    },
    {
      image: ImageBomag,
      name: "BOMAG",
    },
    {
      image: ImageTadano,
      name: "TADANO",
    }
  ]);

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
    setAnalyticClevertap("view", "View_CatalogProduct_Screen", "View_CatalogProduct_Screen", null);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setSearchKeyword(getStorage("SEARCH_PRODUCT"))
  }, [getStorage("SEARCH_PRODUCT")]);

  useEffect(() => {
    async function fetchData() {
      const Params = {
        BrandName: brand,
        Category: category,
        MinimumPrice: minimumPrice,
        MaximumPrice: maximumPrice,
        PageNumber: page,
        RatingValue: ratingValue,
        MaterialName: filters,
        MaterialNumber: filters
      }
      if (isNaN(filters.charAt(0))) {
        Params.MaterialNumber = ""
      } else {
        Params.MaterialName = ""
      }
      if (props.user) {
        const { user } = props;
        await props.fetchListProduct(
          user.tokenResponse.accessToken,
          Params,
          12
        );
      } else {
        await props.fetchListProduct(
          null,
          Params,
          12
        );
      }
    }
    fetchData();
  }, [brand, category, changePrice, ratingValue, submitSearch, page]);

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

  useEffect(() => {
    async function fetchData() {
      await props.fetchListBrand();
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      await props.fetchListCategory();
    }
    fetchData();
  }, []);

  const _renderBanner = () => {
    if (brand != "" && brand != undefined) {
      return (
        <Col className='colBanner'>
          <img className='logoBrand' src={brand == 'KOMATSU' ? logoKomatsu :
            brand == 'SCANIA' ? logoScania : brand == 'UD TRUCK' ? logoUdtruck :
              brand == 'BOMAG' ? logoBomag : logoTadano} />
          <div className='bannerWelcome'>
            <div className='containerResponsiveFlex'>
              <div className='containerTitle'>
                <p className='textBrand'>Suku Cadang {brand}</p>
                <p className='textDescBrand'>
                  Temukan suku cadang yang tepat untuk menjaga alat berat Anda bekerja dengan efisiensi maksimum{" "}
                </p>
              </div>
            </div>
            <img className='imagePC200' src={brand == 'KOMATSU' ? ImageKomatsu :
              brand == 'SCANIA' ? ImageScania : brand == 'UD TRUCK' ? ImageUdtruck :
                brand == 'BOMAG' ? ImageBomag : ImageTadano} />
          </div>
        </Col>
      );
    }
  };

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
        typography={brand == 'KOMATSU' ? 'Komatsu' : brand == 'SCANIA' ? 'Scania' :
          brand == 'UD TRUCK' ? 'UD Trucks' : brand == 'BOMAG' ? 'Bomag' : brand == 'TADANO' ? 'Tadano' : "List Product"}
      />
    )
  };

  const _renderBannerBrand = () => {
    if (brand == "" || brand == undefined) {
      return (
        <div>
          <div className='containerBanner'>
            <img src={logoKomatsu} className='logoBrandBanner' />
            <img src={logoScania} className='logoBrandBanner' />
            <img src={logoUdtruck} className='logoBrandBanner' />
            <img src={logoBomag} className='logoBrandBanner' />
            <img src={logoTadano} className='logoBrandBanner' />
          </div>
          <div className='containerUnit' style={{ backgroundColor: '#ffd500' }}>
            <div className='containerTitle'>
              <p className='textBrandNew'>Temukan Suku Cadang Terbaik</p>
            </div>
            <Row className='rowUnit'>
              {imageBranch.map((item, index) => {
                return (
                  <div className='boxUnit'>
                    <img className={item.name == 'UD TRUCK' ? 'imageBrandUdtruck' :
                      item.name == 'TADANO' ? 'imageBrandTadano' : 'imageBrandKomatsu'} src={item.image} />
                  </div>
                );
              })}
            </Row>
          </div>
        </div>
      );
    }
  };

  const _renderFilter = () => {
    return (
      <div className='colFilter'>
        <p className='titleFilter1'>Filter</p>
        <hr className='lineListProduct' />
        <p className='titleList'>Brand</p>
        <FormGroup check style={{ display: "flex", alignItems: "center", marginTop: 5 }}>
          <Label check>
            <Input
              checked={brand == "" || brand == undefined}
              type='radio'
              name='radio1'
              style={{ marginTop: 0 }}
              onClick={() => {
                setAnalyticClevertap("click", "Click_CatalogProductFilters", "View_CatalogProduct_Screen", ["Click_CatalogProductFilters", { "Brand_Name": "All" }]);
                setBrand("");
              }}
            />
            {" "}
            <p className='titleRadio'>Semua</p>
          </Label>
        </FormGroup>
        {props.brandData != null &&
          props.brandData.map((item) => {
            return (
              <FormGroup check style={{ display: "flex", alignItems: "center", marginTop: 5 }}>
                <Label check>
                  <Input
                    className='radioBtn'
                    checked={brand === item.name}
                    type='radio'
                    name='radio1'
                    style={{ marginTop: '0.05vw' }}
                    onClick={() => {
                      setAnalyticClevertap("click", "Click_CatalogProductFilters", "View_CatalogProduct_Screen", ["Click_CatalogProductFilters", { "Brand_Name": item.name }]);
                      setBrand(item.name);
                    }}
                  />
                  {" "}
                  <p className='titleRadio'>{item.name}</p>
                </Label>
              </FormGroup>
            );
          })}
        <hr />
        <p className='titleList'>Kategori</p>
        <div className='colCategory' style={{ overflow: "scroll", flexDirection: "column", display: "flex", height: '19.5vw' }}>
          <FormGroup check style={{ display: "flex", alignItems: "center", marginTop: 5 }}>
            <Label check>
              <Input
                checked={category == "" || category == undefined}
                type='radio'
                name='radio2'
                style={{ marginTop: 0 }}
                onClick={() => {
                  setAnalyticClevertap("click", "Click_CatalogProductFilters", "View_CatalogProduct_Screen", ["Click_CatalogProductFilters", { "Category_Name": "All" }]);
                  setCategory("");
                }}
              />
              {" "}
              <p className='titleRadio'>Semua</p>
            </Label>
          </FormGroup>
          {props.categoryData != null &&
            props.categoryData.data.map((item) => {
              return (
                <FormGroup check style={{ display: "flex", alignItems: "center", marginTop: 5 }}>
                  <Label check>
                    <Input
                      className='radioBtn'
                      checked={category === item.name}
                      type='radio'
                      name='radio2'
                      style={{ marginTop: '0.05vw' }}
                      onClick={() => {
                        setAnalyticClevertap("click", "Click_CatalogProductFilters", "View_CatalogProduct_Screen", ["Click_CatalogProductFilters", { "Category_Name": item.name }]);
                        setCategory(item.name);
                      }}
                    />
                    {" "}
                    <p className='titleRadio'>{item.name}</p>
                  </Label>
                </FormGroup>
              );
            })}
        </div>

        <hr />
        <p className='titleList'>Nilai</p>
        <Row
          style={{ marginLeft: "1.5rem", marginBottom: "1rem" }}
          onClick={() => {
            setAnalyticClevertap("click", "Click_CatalogProductFilters", "View_CatalogProduct_Screen", ["Click_CatalogProductFilters", { "Rating_Count": 5 }]);
            setRating(5);
          }}
        >
          <Input checked={ratingValue == 5} type='checkbox' name='checkbox1' className='checkboxLP' />{" "}
          <Row style={{ marginLeft: "0.4vw", marginTop: "0.2vw" }}>
            <img className='ratingList' src={Star} />
            <img className='ratingList' src={Star} />
            <img className='ratingList' src={Star} />
            <img className='ratingList' src={Star} />
            <img className='ratingList' src={Star} />
          </Row>
        </Row>
        <Row
          style={{ marginLeft: "1.5rem" }}
          onClick={() => {
            setAnalyticClevertap("click", "Click_CatalogProductFilters", "View_CatalogProduct_Screen", ["Click_CatalogProductFilters", { "Rating_Count": 4 }]);
            setRating(4);
          }}
        >
          <Input checked={ratingValue == 4} type='checkbox' name='checkbox1' className='checkboxLP' />{" "}
          <Row style={{ marginLeft: "5px", marginTop: "3px" }}>
            <img className='ratingList' src={Star} />
            <img className='ratingList' src={Star} />
            <img className='ratingList' src={Star} />
            <img className='ratingList' src={Star} />
            <img className='ratingList' src={StarGray} />
            <p className='titleStar'>Ke Atas</p>
          </Row>
        </Row>
        <Row
          style={{ marginLeft: "1.5rem" }}
          onClick={() => {
            setAnalyticClevertap("click", "Click_CatalogProductFilters", "View_CatalogProduct_Screen", ["Click_CatalogProductFilters", { "Rating_Count": 3 }]);
            setRating(3);
          }}
        >
          <Input checked={ratingValue == 3} type='checkbox' name='checkbox1' className='checkboxLP' />{" "}
          <Row style={{ marginLeft: "5px", marginTop: "3px" }}>
            <img className='ratingList' src={Star} />
            <img className='ratingList' src={Star} />
            <img className='ratingList' src={Star} />
            <img className='ratingList' src={StarGray} />
            <img className='ratingList' src={StarGray} />
            <p className='titleStar'>Ke Atas</p>
          </Row>
        </Row>
        <Row
          style={{ marginLeft: "1.5rem" }}
          onClick={() => {
            setAnalyticClevertap("click", "Click_CatalogProductFilters", "View_CatalogProduct_Screen", ["Click_CatalogProductFilters", { "Rating_Count": "All" }]);
            setRating("");
          }}
        >
          <Input checked={ratingValue == ""} type='checkbox' name='checkbox1' className='checkboxLP' />{" "}
          <Row style={{ marginLeft: "5px", marginTop: "3px" }}>
            <img className='ratingList' src={StarGray} />
            <img className='ratingList' src={StarGray} />
            <img className='ratingList' src={StarGray} />
            <img className='ratingList' src={StarGray} />
            <img className='ratingList' src={StarGray} />
            <p className='titleStar'>Semua</p>
          </Row>
        </Row>
        <hr />
        <p className='titleList'>Harga</p>
        <div className='boxPrice'>
          <p className='rp'>Rp</p>
          <div className='line-vertical-list' />
          <Input
            style={{ border: "0px", background: 'none', fontSize: 14 }}
            type='price'
            name='minPrice'
            id='minPrice'
            placeholder='Minimum Harga'
            value={minimumPrice}
            onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]+/g, ""))}
          />
        </div>
        <div className='boxPrice'>
          <p className='rp'>Rp</p>
          <div className='line-vertical-list' />
          <Input
            style={{ border: "0px", background: 'none', fontSize: 14 }}
            type='price'
            name='maxPrice'
            id='maxPrice'
            placeholder='Maximum Harga'
            value={maximumPrice}
            onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]+/g, ""))}
          />
        </div>
        <div
          className="btn-terapkan"
          onClick={() => {
            setAnalyticClevertap("click", "Click_CatalogProductFilters", "View_CatalogProduct_Screen",
              ["Click_CatalogProductFilters", { "Min-Max_Price": `Rp${minimumPrice ? minimumPrice : 0} - Rp${maximumPrice ? maximumPrice : 0}` }]);
            setChangePrice(!changePrice);
          }}
        >
          <p className="text-terapkan">Terapkan</p>
        </div>
      </div>
    );
  };

  const _renderSearchProduct = () => {
    return (
      <Paper
        className={'search-input-mini'}
        elevation={1}
      >
        <InputBase
          style={{ fontFamily: "SFProText-Bold" }}
          className='search-text'
          placeholder={"Cari Produk"}
          value={filters}
          onKeyPress={(ev) => handleEnterSearch(ev)}
          onChange={(event) => setFilters(event.target.value)}
        />
        <Paper
          className='search-card'
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setAnalyticClevertap("click", "Click_CatalogProductSearch", "View_CatalogProduct_Screen", ["Click_CatalogProductSearch", { "Search_Value": filters }]);
            setSubmitSearch(!submitSearch);
          }}
        >
          <img className='search-icon' alt='icon' src={IconZoom} />
        </Paper>
      </Paper>
    );
  };

  const handleEnterSearch = (ev) => {
    if (ev.key == "Enter") {
      setSubmitSearch(!submitSearch);
      setAnalyticClevertap("click", "Click_CatalogProductSearch", "View_CatalogProduct_Screen", ["Click_CatalogProductSearch", { "Search_Value": filters }]);
    };
  };

  const _renderProductList = () => {
    return (
      <div style={{ flexDirection: "column", display: "flex" }}>
        <Row style={{ paddingLeft: '0.3vw', width: '100%', maxWidth: '65vw' }}>
          <p className="titleFilterList">Produk Promo</p>
          <div style={{ marginLeft: 'auto' }}>
            {_renderSearchProduct()}
          </div>
          <hr className='lineProduct' />
        </Row>
        {
          props.listProductData.data !== [] ?
            _renderListProduct() :
            _renderNotFound()
        }
      </div>
    );
  };

  const _renderNotFound = () => {
    return (
      <div className="container-not-found">
        <img className="img-not-found" src={imageNotFound} />
        <p className="text-not-found">Maaf produk tidak tersedia.</p>
      </div>
    );
  };

  const _renderListProduct = () => {
    if (props.loading && screenWidth > 900) {
      return (
        <Row className='gridListProduct  defaultMargin'>
          <Skeleton style={{ margin: 10 }} count={4} height={300} width={181} />
          <Skeleton style={{ margin: 10 }} count={4} height={300} width={181} />
          <Skeleton style={{ margin: 10 }} count={4} height={300} width={181} />
          <Skeleton style={{ margin: 10 }} count={4} height={300} width={181} />
        </Row>
      );
    } else if (props.loading && screenWidth >= 760 && screenWidth < 900) {
      return (
        <Row className='gridListProduct  defaultMargin'>
          <Skeleton style={{ margin: 10 }} count={4} height={200} width={160} />
          <Skeleton style={{ margin: 10 }} count={4} height={200} width={160} />
          <Skeleton style={{ margin: 10 }} count={4} height={200} width={160} />
          <Skeleton style={{ margin: 10 }} count={4} height={200} width={160} />
        </Row>
      );
    } else if (props.loading && screenWidth < 760) {
      return (
        <Row className='gridListProduct  defaultMargin'>
          <Skeleton style={{ margin: 10 }} count={2} height={200} width={160} />
          <Skeleton style={{ margin: 10 }} count={2} height={200} width={160} />
          <Skeleton style={{ margin: 10 }} count={2} height={200} width={160} />
          <Skeleton style={{ margin: 10 }} count={2} height={200} width={160} />
        </Row>
      );
    } else if (props.listProductData.data.length == 0) {
      return _renderNotFound();
    } else if (props.listProductData != null) {
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
          <Row className='gridListProduct  defaultMargin'>
            {props.listProductData.data.map((item, index) => {
              return (
                <a
                  key={index}
                  className='cardListLP'
                  style={{ height: 'auto', paddingBottom: 10, textDecoration: 'none' }}
                  href={`${MENU.DETAIL_PRODUCT}${item.productId}`}
                  onClick={() => {
                    setAnalyticClevertap("click", "Click_DetailProduct", "View_CatalogProduct_Screen", ["Click_DetailProduct", { "Product_Name": item.materialName }]);
                  }}
                >
                  <Col>
                    <div className='cardImageLP'>
                      <img className='imageList' src={item.imageThumbnailUrl} />
                    </div>
                    <p className='titleListProduct'>{item.brandName}</p>
                    <p className='titleListProduct2' style={{ marginBottom: 0 }}>{item.materialName}</p>
                    <p className='titleListProduct' style={{ fontFamily: "SFProText-Regular", opacity: 0.5, marginBottom: 10 }}>({item.materialNumber})</p>
                    {item.basePrice != item.promotionPrice ?
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <p className='titleListProduct3'>Rp {Utils.formatCurrency(item.basePrice)}</p>
                        <p className='titleListProduct4' style={{ color: 'rgb(20, 143, 15)', marginLeft: 5, fontSize: 12, marginBottom: 0 }}>{item.discountPercent}</p>
                      </div> : null
                    }
                    <p className='titleListProduct4'>Rp {Utils.formatCurrency(item.promotionPrice)}</p>
                    <p className='titleListProduct' style={{ opacity: 0.8 }}>
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
          {props.listProductMeta?.totalPages > 1 ? (
            <div style={{ alignItems: "center", marginRight: '10%', marginTop: '1rem' }}>
              {_renderPagination()}
            </div>
          ) : null}
        </div>
      );
    } else {
      return _renderNotFound();
    }
  };

  const handlePage = (number) => {
    if (page !== number) {
      setAnalyticClevertap("click", "Click_CatalogProductPaging", "View_CatalogProduct_Screen", ["Click_CatalogProductPaging", { "Page_Number": number }]);
      setPage(number);
    }
  };

  const _renderPagination = () => {
    const { totalPages, hasPreviousPage, hasNextPage } = props.listProductMeta;
    const arr = []
    for (let i = 1; i <= totalPages; i++) {
      const newArr = { num: i };
      arr.push(newArr);
    };
    return (
      <div className="con-pagination">
        {
          hasPreviousPage &&
          <span
            className="paging"
            onClick={() => {
              setAnalyticClevertap("click", "Click_CatalogProductPaging", "View_CatalogProduct_Screen", ["Click_CatalogProductPaging", { "Page_Number": page - 1 }]);
              setPage(page - 1);
            }}
          >{"<"}</span>
        }
        {arr && arr.map((item) => (
          <span
            onClick={() => handlePage(item.num)}
            className={item.num == page ? "paging active" : "paging"}
          >{item.num}</span>
        ))}
        {
          hasNextPage &&
          <span
            className="paging"
            onClick={() => {
              setAnalyticClevertap("click", "Click_CatalogProductPaging", "View_CatalogProduct_Screen", ["Click_CatalogProductPaging", { "Page_Number": page + 1 }]);
              setPage(page + 1);
            }}
          >{">"}</span>
        }
      </div>
    );
  };

  return (
    <Col className='containerPaddingLP'>
      {_renderBreadcrumb()}
      {_renderBannerBrand()}
      {_renderBanner()}
      <div className='containerRowProduct'>
        {_renderFilter()}
        {_renderProductList()}
      </div>
    </Col>
  );
};

export default ListProduct;
