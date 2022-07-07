import React, { Component } from "react";
import { Row, Col, Button } from "reactstrap";
import Skeleton from 'react-loading-skeleton';
import "./style/index.scss";
import { IconCalendar } from "assets/icons";
import * as Utils from 'utils/format.helper';
import Viewer from 'react-viewer';
import { EmailShareButton, FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { FaFacebookF, FaLink, FaTwitter, FaEnvelope, FaWhatsapp, FaShareAlt } from 'react-icons/fa';
import { isMobile } from 'react-device-detect';
import firebase from "../../firebase/firebase";
import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import parse from "html-react-parser";
import { MENU } from "constants/menu";
class DetailPromotionPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.promotionId,
      imageUrl: "",
      value: "",
      voucher: 0,
      listPromotion: null,
      loading: false,
      dataDetail: null,
      viewImage: false,
      imageAttribute: false,
      imageganti: ''
    };
    const promoUrl = window.location.href;
    this.cleanUrl = promoUrl;
  }
  async componentDidMount() {
    this._getDetail(this.state.id);
    this._getList();
    window.scrollTo(0, 0);
  };

  setAnalyticClevertap = (action, event, screen, product) => {
    if (this.props.user) {
      const { userName } = this.props.user;
      if (product !== null) {
        window.clevertapEventProduct(`${product[0] + "_LogedIn"}`, product[1]);
      } else {
        window.clevertapEvent(`${event + "_LogedIn"}`, this.props.user);
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

  async _getDetail(promotionId) {
    this.setState({ loading: true })
    await this.props.fetchDetailPromotion(promotionId);
    const { dataDetail } = this.props;
    const imageUrl = this.props.match.params.imageUrl;
    const img = imageUrl.replaceAll(',', '/');
    const img2 = img.replaceAll('|', '?');
    this.setState({ loading: false, imageUrl: img2, dataDetail })
    this.setAnalyticClevertap("view", "View_DetailPromotion_Screen", "View_DetailPromotion_Screen", ["View_DetailPromotion_Screen", { "Promotion_Name": this.props.dataDetail.promotionName }]);
  }
  async getDetailClick(id) {
    this.setState({ loading: true })
    await this.props.fetchDetailPromotion(id);
    const { dataDetail } = this.props;
    this.setState({ loading: false, dataDetail })
    this.setAnalyticClevertap("view", "View_DetailPromotion_Screen", "View_DetailPromotion_Screen", ["View_DetailPromotion_Screen", { "Promotion_Name": this.props.dataDetail.promotionName }]);
  }
  async _getList() {
    this.setState({ loading: true })
    const response = await this.props.fetchPromotionList('', '', 1, 0, 3)
    if (response != null && response != '400') {
      this.setState({ listPromotion: response, loading: false })
    }
  }

  viewImage() {
    this.setState({ viewImage: true, imageAttribute: false })
  }

  closeImage() {
    this.setState({ viewImage: false })
  }

  copyToClipboard = (text) => {
    let textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }

  onCopyImageButtonClick() {
    this.copyToClipboard(this.cleanUrl);
    this.setState({ imageAttribute: true });
  }

  share() {
    if (navigator.share) {
      navigator
        .share({
          url: this.cleanUrl,
        })
        .then(() => {

        })
        .catch(error => {

        });
    }
  }

  _skeletonDataDetail = () => {
    return (
      <Col lg="6" md="6" className='marginResponsive'>
        <h3 className='styleTitlePromotion'>
          <Skeleton height={30} width={150} />
        </h3>
        <Skeleton height={300} width={500} />
        <p className='titlePromoDetail'>
          <Skeleton height={30} width={150} />
        </p>
        <Row style={{ alignItems: 'center' }}>
          <Skeleton height={22} width={22} style={{ marginLeft: 20, marginRight: 10 }} circle />
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <Skeleton height={22} width={100} />
            <p className='boldPeriodeDetail'>
              {" "}
              <Skeleton height={22} width={200} />
            </p>
          </div>
        </Row>
        <p className='descriptionPromo'>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </p>
        <p className='titlePoin'><Skeleton height={25} width={100} /></p>
        <Row style={{ alignItems: 'center', marginTop: 5 }}>
          <Skeleton height={20} width={20} style={{ marginLeft: 20, marginRight: 10 }} circle />
          <Skeleton height={20} width={100} />
        </Row>
        <p className='titlePoin'><Skeleton height={25} width={100} /></p>
        <Row style={{ alignItems: 'center', marginTop: 5 }}>
          <Skeleton height={20} width={20} style={{ marginLeft: 20, marginRight: 10 }} circle />
          <Skeleton height={20} width={100} />
        </Row>
        <p className='titlePoin'><Skeleton height={25} width={100} /></p>
        <Row style={{ alignItems: 'center', marginTop: 5 }}>
          <Skeleton height={20} width={20} style={{ marginLeft: 20, marginRight: 10 }} circle />
          <Skeleton height={20} width={100} />
        </Row>
      </Col>
    )
  };
  _skeletonListPromotion = () => {
    return (
      <Col lg="6" md="6" className="paddingPromoLainnya">
        <div className='gridListDetailPromo'>
          <h3 className='styleTitlePromotion'><Skeleton height={30} width={150} /></h3>
          <div className='cardListPromotion' style={{ cursor: 'pointer' }}>
            <Col>
              <Skeleton className='imageListPromotion' height={80} />
              <p className='titleProduct'>
                <Skeleton height={25} width={150} />
              </p>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row', }}>
                  <Skeleton height={20} width={20} style={{ margin: 0, marginRight: 10 }} />
                </div>
                <div style={{ display: 'flex' }}>
                  <p className='titleKategoriProduct'>
                    <Skeleton height={20} width={50} />
                  </p>
                  <p className='boldPeriode'>
                    <Skeleton height={20} width={100} />
                  </p>
                </div>
              </div>
              <p className='seeDetail'>
                <Skeleton height={15} width={50} />
              </p>
            </Col>
          </div>
          <div className='cardListPromotion' style={{ cursor: 'pointer' }}>
            <Col>
              <Skeleton className='imageListPromotion' height={80} />
              <p className='titleProduct'>
                <Skeleton height={25} width={150} />
              </p>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row', }}>
                  <Skeleton height={20} width={20} style={{ margin: 0, marginRight: 10 }} />
                </div>
                <div style={{ display: 'flex' }}>
                  <p className='titleKategoriProduct'>
                    <Skeleton height={20} width={50} />
                  </p>
                  <p className='boldPeriode'>
                    <Skeleton height={20} width={100} />
                  </p>
                </div>
              </div>
              <p className='seeDetail'>
                <Skeleton height={15} width={50} />
              </p>
            </Col>
          </div>
        </div>
        <p className='seeOther'>
          <Skeleton height={30} width={100} />
        </p>
      </Col>
    )
  };

  createImageViewToolbar(toolbars) {
    if (isMobile) {
      return toolbars.concat([
        {
          key: "copy",
          render: <FaLink />,
          onClick: () => { this.onCopyImageButtonClick() }
        },
        {
          key: "share",
          render: <FaShareAlt />,
          onClick: () => { this.share() }
        }

      ]);
    } else if (!isMobile) {
      return toolbars.concat([
        {
          key: "facebook",
          render: <FacebookShareButton url={this.cleanUrl}>
            <FaFacebookF />
          </FacebookShareButton>,
        },
        {
          key: "twitter",
          render: <TwitterShareButton url={this.cleanUrl}>
            <FaTwitter />
          </TwitterShareButton>,
        },
        {
          key: "wa",
          render: <WhatsappShareButton url={this.cleanUrl}>
            <FaWhatsapp />
          </WhatsappShareButton>,
        },
        {
          key: "email",
          render: <EmailShareButton url={this.cleanUrl}>
            <FaEnvelope />
          </EmailShareButton>,
        },
        {
          key: "copy",
          render: <FaLink />,
          onClick: () => this.onCopyImageButtonClick()
        },
      ]);
    }
  }

  _renderBreadcrumb = () => {
    const breadcrums = [
      {
        'url': '/Landing',
        'name': 'Landing'
      },
      {
        'url': '/Landing/Promotion',
        'name': 'List promosi'
      },
    ];
    return (
      <div className="marginResponsive" style={{ marginBottom: '1rem' }}>
        <Breadcrumb
          linkBreadcrumb={breadcrums}
          typography={"Detail promosi"}
        />
      </div>
    )
  };

  render() {
    return (
      <div className='containerPromotion'>
        {this._renderBreadcrumb()}
        <div className="containerRowResponsive">
          <Viewer
            visible={this.state.viewImage}
            onClose={() => { this.closeImage() }}
            onMaskClick={() => { this.closeImage() }}
            images={[{ src: this.state.imageganti !== '' ? this.state.imageganti : this.state.imageUrl, alt: 'Copied to clipboard: ' + this.cleanUrl }]}
            noNavbar={true}
            attribute={this.state.imageAttribute}
            zoomSpeed={0.1}
            noImgDetails={true}
            rotatable={false}
            scalable={false}
            changeable={false}
            showTotal={false}
            customToolbar={toolbars => this.createImageViewToolbar(toolbars)}
          />
          {this.state.loading && this.state.dataDetail != null ? this._skeletonDataDetail() :
            <Col lg="6" md="6" className='marginResponsive'>
              <h3 className='styleTitlePromotion'>
                Detail Promo
              </h3>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  this.setAnalyticClevertap("click", "Click_ImageDetailPromotion", "View_DetailPromotion_Screen", ["Click_ImageDetailPromotion", { "Promotion_Name": this.props.dataDetail.promotionName }]);
                  this.viewImage();
                }}
              >
                <img className='imagePromotion' src={this.state.imageUrl} />
              </div>

              <p className='titlePromoDetail'>{!this.state.dataDetail ? "-" : this.state.dataDetail.promotionName}</p>
              <Row style={{ alignItems: 'center' }}>
                <img className='imageCalendar' src={IconCalendar} />
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <p className='titlePeriodeDetail'>Promo Periode :</p>
                  <p className='boldPeriodeDetail'>
                    {" "}
                    {!this.state.dataDetail
                      ? "-"
                      : `${Utils.formatDate(this.state.dataDetail.validFrom)} - ${Utils.formatDate(this.state.dataDetail.validTo)}`}{" "}
                  </p>
                </div>
              </Row>
              <p className='descriptionPromo'>{parse(!this.state.dataDetail ? "-" : this.state.dataDetail.description)}</p>
              <p className='titlePoin'>Area</p>
              {!this.state.dataDetail
                ? "-"
                : this.state.dataDetail.area.map((item) => {
                  return (
                    <Row style={{ alignItems: 'center' }}>
                      <p className='dotPoin'>•</p>
                      <p className='titlePeriodeDetail'>{item.attributeDescription}</p>
                    </Row>
                  );
                })}
              <p className='titlePoin'>Model</p>
              {!this.state.dataDetail
                ? "-"
                : this.state.dataDetail.unitModels.map((item) => {
                  return (
                    <Row style={{ alignItems: 'center' }}>
                      <p className='dotPoin'>•</p>
                      <p className='titlePeriodeDetail'>{item.attributeDescription}</p>
                    </Row>
                  );
                })}
              <p className='titlePoin'>Cari Spare Part Disini:</p>
              <Row style={{ alignItems: 'center' }}>
                {/* <p className='dotPoin'>•</p> */}
                <p className='titlePeriodeDetail' style={{ marginLeft: '1.3rem', marginTop: '0.5rem', cursor: 'pointer', color: '#0b9cab',fontWeight: 'bold', textDecoration: 'underline' }} onClick={() => this.props.push(MENU.LIST_PRODUCT)}>
                  {`https://${window.location.host + MENU.LIST_PRODUCT}`}
                </p>
              </Row>
            </Col>}

          {!this.state.listPromotion ? this._skeletonListPromotion() :
            <Col lg="6" md="6" className="paddingPromoLainnya">
              <div className='gridListDetailPromo'>
                <h3 className='styleTitlePromotion'>Promo Lainnya</h3>
                {this.state.listPromotion.data.map((item) => {
                  return (
                    <div className='cardListPromotion' style={{ cursor: 'pointer' }}>
                      <Col>
                        <img className='imageListPromotion' src={item.imageUrl} />
                        <p className='titleProduct'>{item.promotionName}</p>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'row', }}>
                            <img className='imageCalendar' src={IconCalendar} style={{ margin: 0, marginRight: 10 }} />
                          </div>

                          <div style={{ display: 'flex' }}>
                            <p className='titleKategoriProduct'>Promo Periode :</p>
                            <p className='boldPeriode'> {Utils.formatDate(item.validUntil)} </p>
                          </div>
                        </div>
                        <p className='seeDetail' onClick={() => (this.setState({ id: item.promotionId, imageUrl: item.imageUrl }), this.getDetailClick(item.promotionId))}>Lihat Detail</p>
                      </Col>
                    </div>
                  )
                })}
              </div>
              <p
                className='seeOther'
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  this.setAnalyticClevertap("click", "Click_SeeMorePromotion", "View_DetailPromotion_Screen", null);
                  this.props.push(MENU.PROMOTION)
                }}
              >Lihat Promo Lainnya ➔</p>
            </Col>}
        </div>
      </div>
    );
  }
}

export default DetailPromotionPage;
