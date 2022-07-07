import PropTypes from "prop-types";
import React from "react";
import "./DetailListOrder.scss";
import Skeleton from "react-loading-skeleton";
import { brakeImg, ImageUdtruck, discountDetail } from "assets/images";
import {
  TimelineRatingActive,
  TimelinePacketActive,
  TimelineInvoiceActive,
  TimelineBagActive,
  TimelinePackingActive,
  TimelineSendActive,
  TimelinePacketNonActive,
  TimelineRatingNonActive,
  TimelineSendNonActive,
  IconCircle,
  TimelineFlag,
  TimelineBagNonActive,
  TimelinePackingNonActive,
  TimelineFlagNon,
  IconDownloadInvoice,
  Star,
  StarGray,
} from "assets/icons";
import { IconCancelOrder } from "assets/icons";
import { CircularProgress, InputBase, LinearProgress, Paper } from "@material-ui/core";
import moment from "moment";
import { formatCurrency } from "utils/format.helper";
import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import ModalCancelOrder from "components/ModalCancelOrder/ModalCancelOrder";
import ModalConfirmCancel from "components/ModalConfirmCancel/ModalConfirmCancel";
import { Row } from "reactstrap";
import ModalRating from "./components/ModalRating";
import ModalAccessDenied from "components/ModalAccessDenied/ModalAccessDenied";
import firebase from "../../firebase/firebase";
import { MENU } from "constants/menu";

class DetailListOrder extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cancelOrder: props.history.location.state != undefined ? props.history.location.state : null,
      statusOrder: 2,
      openModal: false,
      openModalConfirm: false,
      openModalErrFakturInvoice: false,
      titleErrFakturInvoice: "",
      textErrFakturInvoice: "",
      openModalRating: false,
      productIdReview: null,
      timelineData: [],
      timelineForwarderData: [],
    };
  }

  getStatusTimeline(status) {
    const { detailTransaction } = this.props;
    if (detailTransaction.shipments[0].trackingStatus == "Delivered" && status == "3-Delivered") {
      const delivered = {
        statusOrder: "3-Delivered",
        statusOrderDesc: "Order Delivered",
        statusAt: "",
      };
      return delivered;
    } else if (status == "ReviewDone") {
      const review = {
        statusOrder: "ReviewDone",
        statusOrderDesc: "Order Review",
        statusAt: "",
      };
      return review;
    } else {
      const statusData = this.state.timelineData.filter((item) => item.statusOrder == status);
      if (statusData.length < 1) {
        return null;
      } else {
        return statusData[0];
      }
    }
  }

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
    }
  };

  pressFilter(data) {
    if (this.state.filter !== data) {
      this.setState({ filter: data });
    } else {
      this.setState({ filter: 1 });
    }
  }

  submitCancel(data) {
    this.setState({ openModalConfirm: true });
  }

  async componentDidMount() {
    const { state } = this.props.history.location;
    const token = this.props.user.tokenResponse?.accessToken;
    let transactionId = state[0];
    await this.props.fetchDetailTransaction(transactionId, token);
    await this.props.fetchGetTimeline(token, transactionId);
    const { timelineData, detailTransaction } = this.props;
    this.setState({ timelineData: timelineData?.data });
    await this.props.fetchGetTimelineForwarder(token, transactionId);
    this.setState({ timelineForwarderData: this.props.timelineForwarderData?.history });
    if (detailTransaction) {
      await this.props.fetchGetFakturPajak(token, detailTransaction?.soNumber);
      await this.props.fetchGetInvoice(token, detailTransaction?.soNumber);
    }
    await this.handleAnalytic();
    window.scrollTo(0, 0);
  }

  handleAnalytic = async () => {
    const { detailTransaction } = this.props;
    if (detailTransaction) {
      this.setAnalyticClevertap("view", "View_DetailOrder_Screen", "View_DetailOrder_Screen", [
        "View_DetailOrder_Screen",
        {
          Order_Status: this.changeStatusName(
            this.handleLastStatus(),
            detailTransaction?.shipments ? detailTransaction?.shipments[0]?.name == "Free Pickup" ? true : false : false
          )
        },
      ]);
    }
  };

  handleLastStatus = () => {
    var arrStatusOrder = [];
    for (let i = 0; i < this.state.timelineData.length; i++) {
      arrStatusOrder.push(this.state.timelineData[i]?.statusOrder);
    }
    const max = Math.max.apply(Math, arrStatusOrder);
    return max;
  };

  capitalizeEachWord(value) {
    if (value) {
      let splitStr = value.toLowerCase().split(" ");
      for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
      };
      return splitStr.join(" ");
    };
  };

  _renderModalCancelOrder() {
    return (
      <ModalCancelOrder
        isOpen={this.state.openModal}
        isClose={() => this.setState({ openModal: false })}
        cancel={() => this.setState({ openModal: false })}
        onSubmit={(data) => this.submitCancel(data)}
      />
    );
  }

  _renderModalConfirmCancel() {
    return (
      <ModalConfirmCancel
        isOpen={this.state.openModalConfirm}
        isClose={() => this.setState({ openModalConfirm: false })}
        confirm={false}
        cancel={() => this.setState({ openModalConfirm: false })}
        onSubmit={() => this.setState({ openModalConfirm: false })}
      />
    );
  }

  handleDownloadFakturPajak = () => {
    const { fakturPajakInvoice } = this.props;
    if (fakturPajakInvoice.successFakturPajak != null) {
      var binaryData = [];
      binaryData.push(fakturPajakInvoice.successFakturPajak);
      const href = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", "Faktur Pajak.pdf");
      document.body.appendChild(link);
      link.click();
    } else {
      this.setState({
        openModalErrFakturInvoice: true,
        titleErrFakturInvoice: "Lihat Faktur Pajak",
        textErrFakturInvoice: "Faktur pajak belum tersedia",
      });
    }
  };

  handleDownloadInvoice = () => {
    const { fakturPajakInvoice } = this.props;
    if (fakturPajakInvoice.successInvoice != null) {
      var binaryData = [];
      binaryData.push(fakturPajakInvoice.successInvoice);
      const href = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", "Invoice.pdf");
      document.body.appendChild(link);
      link.click();
    } else {
      this.setState({
        openModalErrFakturInvoice: true,
        titleErrFakturInvoice: "Lihat Invoice",
        textErrFakturInvoice: "Invoice belum tersedia",
      });
    }
  };

  _renderModalErrorFakturInvoice = () => {
    return (
      <ModalAccessDenied
        isOpen={this.state.openModalErrFakturInvoice}
        isClose={() => this.setState({ openModalErrFakturInvoice: false })}
        title={this.state.titleErrFakturInvoice}
        errorText={this.state.textErrFakturInvoice}
      />
    );
  };

  _renderHeaderTransaction() {
    const { detailTransaction } = this.props;
    return (
      <div className='defaultPadding-Header defaultContent-center'>
        <p style={{ color: "#707070", fontSize: 18, marginBottom: 0 }}>
          {this.props.isLoading ? (
            <Skeleton height={25} width={100} />
          ) : (
            moment(detailTransaction?.poCustomerDate + "Z").format("DD MMMM YYYY, HH:mm") + " WIB"
          )}
        </p>
        <p style={{ color: "#707070", fontSize: 18, marginBottom: 0, fontWeight: "bold", flex: 1, textAlign: "right" }}>
          {this.props.isLoading ? <Skeleton height={25} width={100} /> : detailTransaction?.externalNumber}
        </p>
        <p style={{ color: "#C60242", fontSize: 18, fontWeight: "bold", marginBottom: 0 }}>
          {this.props.isLoading ?
            <Skeleton height={25} width={100} /> :
            this.changeStatusName(
              detailTransaction?.lastStatus,
              detailTransaction?.shipments ? detailTransaction?.shipments[0]?.name == "Free Pickup" ? true : false : false
            )
          }
        </p>
        {this.handleLastStatus() > 2 && this.handleLastStatus() < 5 ? <div className='lineVertical-status ' /> : null}
        {this.handleLastStatus() > 2 && this.handleLastStatus() < 5 ? (
          <div className='btn-download-invoice' onClick={() => this.handleDownloadFakturPajak()}>
            <img className='img-download-invoice' src={IconDownloadInvoice} />
            <p className='teks-download-invoice'>Lihat Faktur Pajak</p>
          </div>
        ) : null}
        {this.handleLastStatus() > 2 && this.handleLastStatus() < 5 ? (
          <div className='btn-download-invoice' style={{ marginLeft: 10 }} onClick={() => this.handleDownloadInvoice()}>
            <img className='img-download-invoice' src={IconDownloadInvoice} />
            <p className='teks-download-invoice'>Lihat Invoice</p>
          </div>
        ) : null}
      </div>
    );
  }

  _renderDeliveryAddress() {
    const { detailTransaction, user } = this.props;
    return detailTransaction?.shipments?.map((data) => {
      return (
        <div className='boxDA'>
          <p className='titleDA'>{data.name === "Free Pickup" ? "Alamat Pengambilan" : "Alamat Pengiriman"}</p>
          <div className='cardDA'>
            <p className='titleAddress'>{user.customerCode != "ONETIMESTD" ? data.branchSupply.toUpperCase().replace("BRANCH", "CABANG") : null}</p>
            <p
              className={user.customerCode != "ONETIMESTD" ? "nameAddress" : "titleAddress"}
            >{`${data.recipientName}  ${data.recipientPhone === '' ? '' : `(${data.recipientPhone})`}`}</p>
            {data.name === "Free Pickup" ?
              (
                <div>
                  <p className='fullAddress'>
                    {this.capitalizeEachWord(data.branchSupply.toUpperCase().replace("BRANCH", "CABANG"))}
                  </p>
                  <p className='fullAddress'>
                    {this.capitalizeEachWord(data.branchAddress)}
                  </p>
                </div>
              )
              :
              data.recipientCity ||
                data.recipientDistrict ||
                data.recipientSubdistrict ||
                data.recipientProvince ?
                <p className='fullAddress'>
                  {this.capitalizeEachWord(data.recipientCity)}, {" "}
                  {this.capitalizeEachWord(data.recipientDistrict)}, {" "}
                  {this.capitalizeEachWord(data.recipientSubdistrict)}, {" "}
                  {this.capitalizeEachWord(data.recipientProvince)},
                </p> : null
            }
            {data.name !== "Free Pickup" ? <p className='fullAddress' style={{ marginTop: 5 }}>{this.capitalizeEachWord(data.recipientAddress)}</p> : null}
          </div>
        </div>
      );
    });
  }

  _renderDeliveryAddressSkeleton() {
    return (
      <>
        <p className='title-id'>
          <Skeleton height={25} width={150} />
        </p>
        <div className='card-item-title'>
          <p className='title-id'>
            <Skeleton height={25} width={150} />
          </p>
          <p className='title-name'>
            <Skeleton height={15} width={250} />
          </p>
          <p className='title-name'>
            <Skeleton height={15} width={250} />
          </p>
        </div>
      </>
    );
  }

  _renderDetailTransaction() {
    const { detailTransaction } = this.props;
    return (
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <p className='titleDA'>Detail Transaksi</p>
        <div>
          {detailTransaction?.items?.map((item) => {
            return (
              <Paper className='defaultPadding-card' style={{ boxShadow: "none" }}>
                <div className='defaultPadding-items defaultContent-center'>
                  <img
                    className='imageList-order cardImage-order'
                    src={detailTransaction.lastStatus == 5 ? IconCancelOrder : brakeImg}
                  />
                  <div className='containeItems-list containerMarginLeft'>
                    <div className='default-content-column'>
                      <p className='title-kategory-order'>{item.brandName}</p>
                      <p className='dotOrder' style={{ marginLeft: 10, marginRight: 10, marginBottom: 0 }}>
                        {" "}
                        ●{" "}
                      </p>
                      <p className='title-kategory-order'>{item.productName}</p>
                    </div>
                    <p className='titleProduct-order'>{item.productDescription}</p>
                    <div className='defaultContent-column'>
                      <p className='title-price-order'>Rp {formatCurrency(item.price)}</p>
                      {this.props.location.state[1] != 2 ? (
                        <>
                          <p style={{ marginLeft: 10, marginRight: 10, marginBottom: 0 }}> ● </p>
                          <p className='title-qty-order'>{item.quantity} Produk</p>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className='lineVertical-status ' />
                  <div className='containerPrice-list'>
                    <div>
                      <p className='titleKategory-order'>Total Harga Produk</p>
                      <p className='title-price-order'>Rp {formatCurrency(item.subTotalPrice)}</p>
                    </div>
                    {item.isReviewed == false && this.props.location.state[1] == 4 ? (
                      <div
                        className='btn-rating'
                        onClick={() => {
                          this._handleModalRating(item.productId);
                          this.setAnalyticClevertap(
                            "click",
                            "Click_ModalRatingReview",
                            "View_DetailOrder_Screen",
                            null
                          );
                        }}
                      >
                        Beri Nilai
                      </div>
                    ) : this.props.location.state[1] == 4 ? (
                      <div style={{ marginBottom: 20 }}>
                        {this._handleStarRating(item.reviewStar)}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Paper>
            );
          })}
        </div>
      </div>
    );
  }

  _renderDetailTransactionSkeleton() {
    return (
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <p className='title-id'>
          <Skeleton height={20} width={150} />
        </p>
        <div className='defaultMargin'>
          <Paper className='defaultPadding-card' style={{ boxShadow: "none" }}>
            <div className='defaultPadding-items defaultContent-center'>
              <Skeleton height={100} width={100} className='imageList-order cardImage-order' />
              <div className='containeItems-list containerMarginLeft'>
                <p className='titleKategory-order'>
                  <Skeleton height={20} width={100} />
                </p>
                <p className='titleProduct-order'>
                  <Skeleton height={20} width={200} />
                </p>
                <div className='defaultContent-column'>
                  <p className='title-price-order'>
                    <Skeleton height={20} width={100} />
                  </p>
                  <p style={{ marginLeft: 10, marginRight: 10, marginBottom: 0, marginTop: 10 }}>
                    <Skeleton height={10} width={10} circle />
                  </p>
                  <p className='title-qty-order'>
                    <Skeleton height={20} width={100} />
                  </p>
                </div>
              </div>
              <div className='lineVertical-status ' />
              <div className='containeItems-list defaultPadding-items'>
                <p className='titleKategory-order'>
                  <Skeleton height={20} width={150} />
                </p>
                <p className='title-price-order'>
                  <Skeleton height={20} width={100} />
                </p>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    );
  }

  handleSubTotal = () => {
    const { detailTransaction } = this.props;
    var subTotal = 0;
    if (detailTransaction.items) {
      for (let i = 0; i < detailTransaction.items.length; i++) {
        subTotal = subTotal + detailTransaction.items[i].subTotalPrice;
      }
      return subTotal;
    } else {
      return 0;
    }
  };

  _renderPayment() {
    const { detailTransaction } = this.props;
    return (
      <div className='container-payment'>
        <p className='titleDA'>Detail Pesanan</p>
        <div className='container-title'>
          <p className='title-payment'>Metode Pembayaran</p>
          <p className='value-payment'>{detailTransaction?.paymentMethod}</p>
        </div>
        <div className='container-title'>
          <p className='title-payment'>Sub Total</p>
          <p className='value-payment'>Rp {formatCurrency(this.handleSubTotal())}</p>
        </div>
        <div className='container-title'>
          <p className='title-payment'>PPN</p>
          <p className='value-payment'>Rp {formatCurrency(detailTransaction?.ppn)}</p>
        </div>
        <div className='container-title'>
          <p className='title-payment'>Biaya Pengiriman</p>
          {detailTransaction?.shipments ? (
            detailTransaction?.shipments[0]?.insurancePrice !== null ? (
              <p className='value-payment'>
                {formatCurrency(
                  detailTransaction?.shipments
                    ? detailTransaction?.shipments[0]?.totalShipmentPrice -
                    detailTransaction?.shipments[0]?.insurancePrice
                    : 0
                )}
              </p>
            ) : (
              <p className='value-payment'>
                Rp{" "}
                {formatCurrency(detailTransaction?.shipments ? detailTransaction?.shipments[0]?.totalShipmentPrice : 0)}
              </p>
            )
          ) : (
            <p className='value-payment'>
              Rp{" "}
              {formatCurrency(detailTransaction?.shipments ? detailTransaction?.shipments[0]?.totalShipmentPrice : 0)}
            </p>
          )}
        </div>
        {/* HIDE ASURANSI */}
        {/* <div className='container-title'>
          <p className='title-payment'>Asuransi Pengiriman</p>
          {detailTransaction?.shipments ? (
            detailTransaction?.shipments[0]?.insurancePrice !== null ? (
              <p className='value-payment'>
                {formatCurrency(detailTransaction?.shipments ? detailTransaction?.shipments[0]?.insurancePrice : 0)}
              </p>
            ) : (
              <p className='value-payment'>-</p>
            )
          ) : (
            <p className='value-payment'>-</p>
          )}
        </div> */}
        <hr />
        <div className='container-total-payment' style={{ justifyContent: "space-between" }}>
          <p className='total-amount' style={{ color: "#000000", fontFamily: "NunitoSans-Regular" }}>
            Total Pembayaran
          </p>
          <p className='total-amount'>Rp {formatCurrency(detailTransaction?.grandTotal)}</p>
        </div>
      </div>
    );
  }

  _renderPaymentSkeleton() {
    return (
      <div className='container-payment'>
        <p className='title-id'>
          <Skeleton height={20} width={100} />
        </p>
        <div className='container-title'>
          <p className='title-payment'>
            <Skeleton height={20} width={150} />
          </p>
          <p className='value-payment'>
            <Skeleton height={20} width={60} />
          </p>
        </div>
        <div className='container-title'>
          <p className='title-payment'>
            <Skeleton height={20} width={130} />
          </p>
          <p className='value-payment'>
            <Skeleton height={20} width={100} />
          </p>
        </div>
        <div className='container-title'>
          <p className='title-payment'>
            <Skeleton height={20} width={80} />
          </p>
          <p className='value-payment'>
            <Skeleton height={20} width={100} />
          </p>
        </div>
        <hr />
        <div className='container-total-payment'>
          <p className='total-amount'>
            <Skeleton height={30} width={150} />
          </p>
        </div>
      </div>
    );
  }

  _renderBreadCrumps() {
    const breadcrums = [
      {
        url: MENU.HOME,
        name: "Part Online Transaction",
      },
      {
        url: MENU.LIST_ORDER,
        name: "Daftar Pesanan",
      },
    ];
    return <Breadcrumb linkBreadcrumb={breadcrums} typography={"Detail Pesanan"} />;
  }

  changeStatusName = (name, isPickUp) => {
    switch (true) {
      case name === 1:
        return "Menunggu Pembayaran";
      case name === 2:
        return "Pesanan Diproses";
      case name === 3:
        if (isPickUp) {
          return "Siap Diambil";
        } else {
          return "Pesanan Dikirim";
        }
      case name === 4:
        return "Pesanan Selesai";
      case name === 5:
        return "Pesanan Dibatalkan";
      default:
        return "";
    }
  };

  _handleStarRating = (rating) => {
    var ratings = [{ status: false }, { status: false }, { status: false }, { status: false }, { status: false }];
    switch (rating) {
      case 1:
        ratings = [{ status: true }, { status: false }, { status: false }, { status: false }, { status: false }];
        break;
      case 2:
        ratings = [{ status: true }, { status: true }, { status: false }, { status: false }, { status: false }];
        break;
      case 3:
        ratings = [{ status: true }, { status: true }, { status: true }, { status: false }, { status: false }];
        break;
      case 4:
        ratings = [{ status: true }, { status: true }, { status: true }, { status: true }, { status: false }];
        break;
      case 5:
        ratings = [{ status: true }, { status: true }, { status: true }, { status: true }, { status: true }];
        break;
      default:
        ratings = [{ status: false }, { status: false }, { status: false }, { status: false }, { status: false }];
    }
    return (
      <span style={{ display: 'flex', flexDirection: 'row' }}>
        {ratings.map((str, index) => (
          <img src={str.status === true ? Star : StarGray} style={{ height: 23 }} key={index} />
        ))}
      </span>
    );
  };

  handleAfterReview = () => {
    const { detailTransaction } = this.props;
    if (detailTransaction.items) {
      const isReviewAll = detailTransaction?.items.filter(item => item.isReviewed == false);
      if (isReviewAll.length == 0) {
        return "ReviewDone";
      } else {
        return "Review";
      }
    }
  };

  render() {
    if (this.props.isLoading) {
      return <CircularProgress value={100} />;
    }
    const { detailTransaction } = this.props;
    return (
      <div className='container-detail-list-order'>
        {this._renderModalErrorFakturInvoice()}
        {this._renderModalRating()}
        {this._renderBreadCrumps()}
        {this._renderHeaderTransaction()}

        <hr style={{ marginTop: 0 }} />
        {detailTransaction.shipments != undefined
          ? this.props.user?.customerCode == "ONETIMESTD"
            ? detailTransaction?.shipments[0]?.name == "Free Pickup"
              ? this._renderTimelineOneTimesPickUp()
              : this._renderTimelineOneTimes()
            : this._renderTimeline()
          : null}
        <hr style={{ marginTop: 0 }} />
        {this.props.isLoading ? this._renderDeliveryAddressSkeleton() : this._renderDeliveryAddress()}

        <hr style={{ marginTop: 0 }} />
        {this.handleLastStatus() > 2 && this.handleLastStatus() != 5 ? this._renderOrderTracking() : null}
        {this.props.isLoading ? this._renderDetailTransactionSkeleton() : this._renderDetailTransaction()}
        <hr />
        {this.props.isLoading ? this._renderPaymentSkeleton() : this._renderPayment()}

        {this._renderModalCancelOrder()}
        {this._renderModalConfirmCancel()}
      </div>
    );
  }

  _renderTimeline = () => {
    const { detailTransaction } = this.props;
    const timelineItem = [
      {
        status: "Pesanan dibuat",
        statusApi: 1,
        imageActive: TimelineBagActive,
        imageInactive: TimelineBagNonActive,
      },
      {
        status: "Pesanan diproses",
        statusApi: 2,
        imageActive: TimelinePackingActive,
        imageInactive: TimelinePackingNonActive,
      },
      {
        status: "Siap diambil",
        statusApi: 3,
        imageActive: TimelinePacketActive,
        imageInactive: TimelinePacketNonActive,
      },
      {
        status: "Selesai",
        statusApi: 4,
        imageActive: TimelineFlag,
        imageInactive: TimelineFlagNon,
      },
      {
        status: "Pesanan dinilai",
        statusApi: "Review",
        imageActive: TimelineRatingActive,
        imageInactive: TimelineRatingNonActive,
      },
    ];
    return (
      <>
        <div className='containerTimeline'>
          {timelineItem.map((item, index) => (
            <div className='colTimeline' key={index}>
              <div className='rowTimeline'>
                {this.getStatusTimeline(
                  this.handleAfterReview() == "ReviewDone" && item.statusApi == "Review"
                    ? "ReviewDone"
                    : item.statusApi
                ) !== null ? (
                  <>
                    <div className='boxTimeline'>
                      <img className='iconCircle' src={IconCircle} />
                      <img className='iconTimeline' src={item.imageActive} />
                    </div>
                    {index + 1 === timelineItem.length ? null : (
                      <hr className='line-dash-active' style={index === 0 ? { width: "10vw" } : {}} />
                    )}
                  </>
                ) : (
                  <>
                    <div className='radio-border-timeline'>
                      <img width={30} height={30} src={item.imageInactive} />
                    </div>
                    {index + 1 === timelineItem.length ? null : (
                      <hr className='line-dash-nonActive' style={index === 0 ? { width: "10vw" } : {}} />
                    )}
                  </>
                )}
              </div>
              <div className='boxTextTimeline1' style={index === 0 ? { width: 190 } : {}}>
                <p className='titleTimeline'>{item.status}</p>
                {this.getStatusTimeline(item.statusApi) !== null ? (
                  <>
                    {item.statusApi != "ReviewDone" ?
                      <p className='textTimeline'>
                        {moment(this.getStatusTimeline(item.statusApi).statusAt + "Z").format("DD MMM YYYY; HH:mm")} WIB
                      </p> : null
                    }
                    {item.status === "Pesanan dibuat" ? (
                      <p className='textTimeline2'>({detailTransaction.transactionId})</p>
                    ) : item.status === "Pesanan diproses" ? (
                      <p className='textTimeline2'>
                        ({detailTransaction.soNumber ? detailTransaction.soNumber : "ID SO"})
                      </p>
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  _renderTimelineOneTimes = () => {
    const { detailTransaction } = this.props;
    const timelineItem = [
      {
        status: "Menunggu pembayaran",
        statusApi: 1,
        imageActive: TimelineBagActive,
        imageInactive: TimelineBagNonActive,
      },
      {
        status: "Pesanan diproses",
        statusApi: 2,
        imageActive: TimelinePackingActive,
        imageInactive: TimelinePackingNonActive,
      },
      {
        status: "Pesanan dikirim",
        statusApi: 3,
        imageActive: TimelineSendActive,
        imageInactive: TimelineSendNonActive,
      },
      {
        status: "Terkirim",
        statusApi: "3-Delivered",
        imageActive: TimelinePacketActive,
        imageInactive: TimelinePacketNonActive,
      },
      {
        status: "Selesai",
        statusApi: 4,
        imageActive: TimelineFlag,
        imageInactive: TimelineFlagNon,
      },
      {
        status: "Pesanan dinilai",
        statusApi: "Review",
        imageActive: TimelineRatingActive,
        imageInactive: TimelineRatingNonActive,
      },
    ];
    return (
      <>
        <div className='containerTimeline'>
          {timelineItem.map((item, index) => (
            <div className='colTimeline' key={index}>
              <div className='rowTimeline'>
                {this.getStatusTimeline(
                  detailTransaction.shipments[0].trackingStatus == "Delivered" && item.statusApi == "3-Delivered"
                    ? "3-Delivered"
                    : this.handleAfterReview() == "ReviewDone" && item.statusApi == "Review"
                      ? "ReviewDone"
                      : item.statusApi
                ) !== null ? (
                  <>
                    <div className='boxTimeline'>
                      <img className='iconCircle' src={IconCircle} />
                      <img className='iconTimeline' src={item.imageActive} />
                    </div>
                    {index + 1 === timelineItem.length ? null : (
                      <hr className='line-dash-active' style={index === 0 ? { width: "10vw" } : {}} />
                    )}
                  </>
                ) : (
                  <>
                    <div className='radio-border-timeline'>
                      <img width={30} height={30} src={item.imageInactive} />
                    </div>
                    {index + 1 === timelineItem.length ? null : (
                      <hr className='line-dash-nonActive' style={index === 0 ? { width: "10vw" } : {}} />
                    )}
                  </>
                )}
              </div>
              <div className='boxTextTimeline1' style={index === 0 ? { width: 190 } : {}}>
                <p className='titleTimeline'>{item.status}</p>
                {this.getStatusTimeline(item.statusApi) !== null ? (
                  <>
                    {item.statusApi != "3-Delivered" && item.statusApi != "ReviewDone" ? (
                      <p className='textTimeline'>
                        {moment(this.getStatusTimeline(item.statusApi).statusAt + "Z").format("DD MMM YYYY; HH:mm")} WIB
                      </p>
                    ) : null}
                    {item.status === "Menunggu pembayaran" ? (
                      <p className='textTimeline2'>({detailTransaction.transactionId})</p>
                    ) : item.status === "Pesanan diproses" ? (
                      <p className='textTimeline2'>
                        ({detailTransaction.soNumber ? detailTransaction.soNumber : "ID SO"})
                      </p>
                    ) : item.status === "Pesanan dikirim" ? (
                      <p className='textTimeline2'>
                        (
                        {detailTransaction.shipments[0].trackingNumber
                          ? detailTransaction.shipments[0].trackingNumber
                          : "Tracking ID"}
                        )
                      </p>
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };
  _renderTimelineOneTimesPickUp = () => {
    const { detailTransaction } = this.props;
    const timelineItem = [
      {
        status: "Menunggu pembayaran",
        statusApi: 1,
        imageActive: TimelineBagActive,
        imageInactive: TimelineBagNonActive,
      },
      {
        status: "Pesanan diproses",
        statusApi: 2,
        imageActive: TimelinePackingActive,
        imageInactive: TimelinePackingNonActive,
      },
      {
        status: "Siap Diambil",
        statusApi: 3,
        imageActive: TimelinePacketActive,
        imageInactive: TimelinePacketNonActive,
      },
      {
        status: "Selesai",
        statusApi: 4,
        imageActive: TimelineFlag,
        imageInactive: TimelineFlagNon,
      },
      {
        status: "Pesanan dinilai",
        statusApi: "Review",
        imageActive: TimelineRatingActive,
        imageInactive: TimelineRatingNonActive,
      },
    ];
    return (
      <>
        <div className='containerTimeline'>
          {timelineItem.map((item, index) => (
            <div className='colTimeline' key={index}>
              <div className='rowTimeline'>
                {this.getStatusTimeline(
                  this.handleAfterReview() == "ReviewDone" && item.statusApi == "Review"
                    ? "ReviewDone"
                    : item.statusApi
                ) !== null ? (
                  <>
                    <div className='boxTimeline'>
                      <img className='iconCircle' src={IconCircle} />
                      <img className='iconTimeline' src={item.imageActive} />
                    </div>
                    {index + 1 === timelineItem.length ? null : (
                      <hr className='line-dash-active' style={index === 0 ? { width: "10vw" } : {}} />
                    )}
                  </>
                ) : (
                  <>
                    <div className='radio-border-timeline'>
                      <img width={30} height={30} src={item.imageInactive} />
                    </div>
                    {index + 1 === timelineItem.length ? null : (
                      <hr className='line-dash-nonActive' style={index === 0 ? { width: "10vw" } : {}} />
                    )}
                  </>
                )}
              </div>
              <div className='boxTextTimeline1' style={index === 0 ? { width: 190 } : {}}>
                <p className='titleTimeline'>{item.status}</p>
                {this.getStatusTimeline(item.statusApi) !== null ? (
                  <>
                    {item.statusApi != "ReviewDone" ?
                      <p className='textTimeline'>
                        {moment(this.getStatusTimeline(item.statusApi).statusAt + "Z").format("DD MMM YYYY; HH:mm")} WIB
                      </p> : null
                    }
                    {item.status === "Menunggu pembayaran" ? (
                      <p className='textTimeline2'>({detailTransaction.transactionId})</p>
                    ) : item.status === "Pesanan diproses" ? (
                      <p className='textTimeline2'>
                        ({detailTransaction.soNumber ? detailTransaction.soNumber : "ID SO"})
                      </p>
                    ) : item.status === "Pesanan dikirim" ? (
                      <p className='textTimeline2'>
                        (
                        {detailTransaction.shipments[0].trackingNumber
                          ? detailTransaction.shipments[0].trackingNumber
                          : "Tracking ID"}
                        )
                      </p>
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  _handleModalRating = (productId) => {
    this.setState({ openModalRating: !this.state.openModalRating, productIdReview: productId });
  };
  _onSubmitRating = async (rate, review, hide) => {
    const { detailTransaction } = this.props;
    const data = {
      review: {
        productId: this.state.productIdReview,
        reviewDescription: review,
        transactionId: detailTransaction.transactionId,
        star: rate,
        IsAnonymous: hide,
      },
    };
    const token = this.props.user.tokenResponse?.accessToken;
    await this.props.fetchPostReviewProduct(data, token);
    if (this.props.review.data !== null) {
      this._handleModalRating(null);
      this.componentDidMount();
      this.setAnalyticClevertap("action", "Action_RatingReview_Success", "View_DetailOrder_Screen", null);
    } else {
      this.setAnalyticClevertap("action", "Action_RatingReview_Error", "View_DetailOrder_Screen", null);
    }
  };
  _renderModalRating = () => {
    const { user } = this.props;
    return (
      <ModalRating
        isOpen={this.state.openModalRating}
        isClose={this._handleModalRating}
        onSubmit={(rate, review, hide) => this._onSubmitRating(rate, review, hide)}
        user={user}
        isLoading={this.props.review.loading}
      />
    );
  };
  _renderOrderTracking = () => {
    const TIMELINE = this.state.timelineForwarderData;
    if (TIMELINE !== [] && TIMELINE !== undefined) {
      return (
        <div style={{ margin: "3rem 0px" }}>
          <p className='title-id'>Status Pengiriman</p>
          {TIMELINE !== [] &&
            TIMELINE.reverse().map((item, index) => {
              return (
                <div className='con-forwarder-item'>
                  <div
                    className='con-item'
                    style={index === 0 ? { backgroundColor: "#148F0F" } : { backgroundColor: "#f2f2f2" }}
                  >
                    <p className='teks' style={index === 0 ? { color: "white" } : { color: "black" }}>
                      {moment(item.datetime).format("dddd, DD MMMM YYYY ● HH:mm")}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", marginRight: 20, justifyContent: "center" }}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        backgroundColor: index === 0 ? "#148F0F" : "#F2F2F2",
                      }}
                    />
                    {TIMELINE.length === index + 1 ? null : index === 0 ? (
                      <div className='line-dash-active-vertical' />
                    ) : (
                      <div className='line-dash-active-vertical-nonactive' />
                    )}
                  </div>
                  <div style={{ maxWidth: "60%" }}>
                    <p className='value-payment' style={{ marginBottom: 0 }}>
                      {item.remarks}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      );
    } else {
      return null;
    }
  };
}
DetailListOrder.propTypes = {
  errorDesc: PropTypes.string,
  isLoading: PropTypes.bool,
  login: PropTypes.func,
  tokenResponse: PropTypes.object,
};
DetailListOrder.defaultProps = {
  errorDesc: null,
  isLoading: false,
  login: null,
  tokenResponse: null,
};
export default DetailListOrder;
