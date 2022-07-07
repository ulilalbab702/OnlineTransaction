import React, { Component } from "react";
import { Row, Col, Button } from "reactstrap";
import Skeleton from 'react-loading-skeleton';
import "./style/index.scss";
import { IconCalendar, IconUserDelete } from "assets/icons";
import * as Utils from 'utils/format.helper';
import Viewer from 'react-viewer';
import { EmailShareButton, FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { FaFacebookF, FaLink, FaTwitter, FaEnvelope, FaWhatsapp, FaShareAlt } from 'react-icons/fa';
import { isMobile } from 'react-device-detect';
import firebase from "../../firebase/firebase";
import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import { MENU } from "constants/menu";

class DetailVoucherPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.voucherId,
      imageUrl: null,
      value: "",
      voucher: 0,
      listPromotion: null,
      listVoucher: null,
      loading: false,
      dataDetail: null,
      viewImage: false,
      imageAttribute: false,
      imageganti: '',
      claimStatus: 0,
    };
    const promoUrl = window.location.href;
    const pattern = "/https:,,";
    this.cleanUrl = promoUrl.substr(0, promoUrl.indexOf(pattern));
  }
  async componentDidMount() {
    this.setDataFromParam();
    this.getListVoucher();
    this.getDetailVoucher();
  }

  setDataFromParam() {
    const imgUrl = this.props.match.params.imageUrl;
    const img = imgUrl.replaceAll(',', '/');
    const img2 = img.replaceAll('|', '?');
    this.setState({ imageUrl: img2 });
  }

  async getDetailVoucher() {
    const { user } = this.props;
    await this.props.fetchDetailVoucher(user.tokenResponse.accessToken, this.state.id)
    const { dataVoucherDetail } = this.props;
    this.setState({ dataDetail: dataVoucherDetail });
  }

  async getListVoucher() {
    const { user } = this.props;
    await this.props.fetchVoucherList(user.tokenResponse.accessToken, 3)
    if (this.props.dataVoucherList?.data !== undefined) {
      this.setState({ listVoucher: this.props.dataVoucherList?.data });
    }
  }

  claimVoucher = async (voucherId) => {
    const { user } = this.props;
    const body = { "voucherId": voucherId };
    await this.props.fetchVoucherClaim(user.tokenResponse.accessToken, body);
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

  _handleChange = async (item) => {
    const { user } = this.props;
    await this.props.fetchDetailVoucher(user.tokenResponse.accessToken, item.id)
    const { dataVoucherDetail } = this.props;
    this.setState({ dataDetail: dataVoucherDetail });
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
  _skeletonListVoucher = () => {
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

  // dummy action claim voucher
  _handleClaim = () => {
    if (this.state.claimStatus > 2) {
      this.setState({ claimStatus: 0 });
    } else {
      this.setState({ claimStatus: this.state.claimStatus + 1 });
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
        'name': 'List voucher'
      },
    ];
    return (
      <div className="marginResponsive" style={{ marginBottom: '1rem' }}>
        <Breadcrumb
          linkBreadcrumb={breadcrums}
          typography={"Detail voucher"}
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
          {this.props.voucherLoading ? this._skeletonDataDetail() :
            <Col lg="6" md="6" className='marginResponsive'>
              <h3 className='styleTitlePromotion'>
                Detail Voucher
              </h3>
              <div onClick={() => { this.viewImage() }}>
                <img className='imagePromotion' src={this.state.imageUrl} />
              </div>
              <p className='titlePromoDetail'>{!this.state.dataDetail ? "-" : this.state.dataDetail.title}</p>
              <Row style={{ alignItems: 'center' }}>
                <img className='imageCalendar' src={IconCalendar} />
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <p className='titlePeriodeDetail'>Periode Promo :</p>
                  <p className='boldPeriodeDetail'>
                    {" "}
                    {!this.state.dataDetail
                      ? "-"
                      : `${Utils.formatDate(this.state.dataDetail.promoStart)} - ${Utils.formatDate(this.state.dataDetail.promoEnd)}`}{" "}
                  </p>
                </div>
              </Row>
              <p className='descriptionPromo'>{!this.state.dataDetail ? "-" : this.state.dataDetail.description}</p>
              <div className="containerClaim">
                <p className="codeClaim">{!this.state.dataDetail ? "-" : this.state.dataDetail.voucherCode}</p>
                {this.props.claimLoading ?
                  <span className="btn-claim">Loading...</span> :
                  <span className="btn-claim" onClick={() => this.claimVoucher(this.state.dataDetail.id)}>Klaim Voucher</span>}
              </div>
              <div
                className="containerClaimStatus"
                style={
                  this.props.claimSuccess === true ? { display: 'flex', backgroundColor: '#5ACC4D' } :
                    this.props.claimSuccess === false ? { display: 'flex', backgroundColor: '#D11836' } :
                      { display: 'none' }
                }
              >
                {this.props.claimSuccess === false ?
                  <img src={IconUserDelete} style={{ marginBottom: 'auto', marginRight: 10 }} />
                  : null}
                <p style={{ marginBottom: 0 }}>
                  {
                    this.props.claimSuccess === true ? "Voucher berhasil diklaim" :
                      this.props.claimSuccess === false ? `Mohon maaf voucher tidak bisa diklaim, info lebih lanjut silahkan hubungi chatbot kami "Tanya Cindy"` : ""
                  }
                </p>
              </div>
            </Col>}
          {this.state.listVoucher === null ? this._skeletonListVoucher() :
            <Col lg="6" md="6" className="paddingPromoLainnya">
              <div className='gridListDetailPromo'>
                <h3 className='styleTitlePromotion'>Voucher Lainnya</h3>
                {this.state.listVoucher.map((item) => {
                  return (
                    <div className='cardListPromotion' style={{ cursor: 'pointer' }}>
                      <Col>
                        <img className='imageListPromotion' src={item.image} />
                        <p className='titleProduct'>{item.title}</p>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'row', }}>
                            <img className='imageCalendar' src={IconCalendar} style={{ margin: 0, marginRight: 10 }} />
                          </div>
                          <div style={{ display: 'flex' }}>
                            <p className='titleKategoriProduct'>Promo Periode :</p>
                            <p className='boldPeriode'>{Utils.formatDate(item.promoStart)} - {Utils.formatDate(item.promoEnd)}</p>
                          </div>
                        </div>
                        <p className='seeDetail' onClick={() => { this.setState({ id: item.id, imageUrl: item.image }); this._handleChange(item) }}>Lihat Detail</p>
                      </Col>
                    </div>
                  )
                })}
              </div>
              <p className='seeOther' style={{ cursor: 'pointer' }} onClick={() => this.props.push(MENU.PROMOTION)}>Lihat Voucher Lainnya ➔</p>
            </Col>}
        </div>
      </div>
    );
  }
}

export default DetailVoucherPage;
