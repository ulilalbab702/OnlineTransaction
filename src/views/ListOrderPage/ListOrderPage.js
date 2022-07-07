import PropTypes from "prop-types";
import React from "react";
import "./style/index.scss";
import { brakeImg, ImageUdtruck, discountDetail, imageNotFound } from "assets/images";
import { MENU } from "constants/menu";
import { Paper, Modal, DialogContent } from "@material-ui/core";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import { formatCurrency } from "utils/format.helper";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { Row } from "reactstrap";
import SearchInputMini from "./../../components/SearchInputMini";
import {
  IconCancleOrder, IconTimer, Star, StarGray
} from "assets/icons";
import firebase from "../../firebase/firebase";
import ModalCancelOrder from "components/ModalCancelOrder/ModalCancelOrder";
import ModalAfterCancel from "./component/ModalAfterCancel";

class ListOrderPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCollapse: false,
      showPassword: false,
      filter: 0,
      sortingSelect: 0,
      keywordParts: "",
      openModalUpload: false,
      orderTransaction: null,
      isLoading: false,
      isLoadingMore: false,
      openModalCancleOrder: false,
      listCancel: [],
      transactionIdCancel: '',
      openModalAfterCancel: false,
      loadingOrderReceived: false,
      sortingCustOnetime: [
        {
          name: "Semua",
          index: 0,
        },
        {
          name: "Menunggu Pembayaran",
          index: 1,
        },
        {
          name: "Pesanan diproses",
          index: 2,
        },
        {
          name: "Pesanan dikirim",
          index: 3,
        },
        {
          name: "Pesanan Selesai",
          index: 4,
        },
        {
          name: "Pesanan Dibatalkan",
          index: 5,
        },
      ],
      sortingCustCode: [
        {
          name: "Semua",
          index: 0,
        },
        {
          name: "Pesanan diproses",
          index: 2,
        },
        {
          name: "Siap Diambil",
          index: 3,
        },
        {
          name: "Pesanan Selesai",
          index: 4,
        },
        {
          name: "Pesanan Dibatalkan",
          index: 5,
        },
      ],
      listAllOrder: [
        {
          name: "Komatsu",
          product: "Battery Komatsu K150A",
          image: ImageUdtruck,
          price: "30.000.000",
          qty: "11",
          total: "30.000.000",
          date: "05 January 2021",
          invoice: "(INV/20210103/XXI/I/716407831)",
          status: "Order Delivered",
          moreProduct: false,
          orderCanceled: false,
        },
        {
          name: "Komatsu",
          product: "Battery Komatsu K150A",
          image: ImageUdtruck,
          price: "30.000.000",
          qty: "11",
          total: "60.000.000",
          date: "05 January 2021",
          invoice: "(INV/20210103/XXI/I/716407831)",
          status: "Order Canceled",
          moreProduct: true,
          orderCanceled: true,
        },
      ],
      listOrderCreate: [
        {
          name: "Komatsu",
          product: "Battery Komatsu K150A",
          image: ImageUdtruck,
          price: "30.000.000",
          qty: "11",
          total: "33.000.000",
          date: "05 January 2021",
          invoice: "(INV/20210103/XXI/I/716407831)",
          status: "Order Delivered",
          moreProduct: false,
          orderCanceled: false,
        },
      ],
      listOrderRTPU: [
        {
          name: "Komatsu",
          product: "Battery Komatsu K150A",
          image: ImageUdtruck,
          price: "30.000.000",
          qty: "11",
          total: "30.000.000",
          date: "05 January 2021",
          invoice: "(INV/20210103/XXI/I/716407831)",
          status: "Ready to Pick Up",
          moreProduct: false,
          orderCanceled: false,
        },
      ],
      listOrderCanceled: [
        {
          name: "Komatsu",
          product: "Battery Komatsu K150A",
          image: ImageUdtruck,
          price: "30.000.000",
          qty: "11",
          total: "30.000.000",
          date: "05 January 2021",
          invoice: "(INV/20210103/XXI/I/716407831)",
          status: "Order Canceled",
          moreProduct: false,
          orderCanceled: true,
        },
      ],
    };
    this.page = 1;
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

  async pressFilter(data) {
    this.setAnalyticClevertap("click", "Click_FilterOrderList", "View_ListOrder_Screen", ["Click_FilterOrderList", { "Order_Status": data.name }]);
    this.page = 1;
    const { keywordParts } = this.state;
    let param = {
      UserId: this.props.user?.userId,
      LastStatus: data.index,
      POCustomer: keywordParts,
      PageNumber: this.page,
    };
    const token = this.props.user?.tokenResponse?.accessToken;
    if (this.state.filter != data.index) {
      this.setState({ filter: data.index });
      if (data.index === 0) {
        delete param.LastStatus;
        this.setState({ isLoading: true });
        await this.props.fetchTransactionOrder(param, token);
        const { orderTransaction } = this.props;
        this.setState({ orderTransaction: orderTransaction.data, isLoading: false });
      } else {
        this.setState({ isLoading: true });
        await this.props.fetchTransactionOrder(param, token);
        const { orderTransaction } = this.props;
        this.setState({ orderTransaction: orderTransaction.data, isLoading: false });
      }
    } else {
      this.setState({ filter: 0, isLoading: true });
      delete param.LastStatus;
      await this.props.fetchTransactionOrder(param, token);
      const { orderTransaction } = this.props;
      this.setState({ orderTransaction: orderTransaction.data, isLoading: false });
    }
  }

  componentDidMount = async () => {
    this.setAnalyticClevertap("view", "View_ListOrder_Screen", "View_ListOrder_Screen", null);
    window.scrollTo(0, 0);
    this.page = 1;
    const token = this.props.user?.tokenResponse?.accessToken;
    const { keywordParts } = this.state;
    let data = {
      UserId: this.props.user?.userId,
      POCustomer: keywordParts,
      PageNumber: this.page,
    };
    this.setState({ isLoading: true });
    await this.props.fetchTransactionOrder(data, token);
    const { orderTransaction } = this.props;
    this.setState({ orderTransaction: orderTransaction.data, isLoading: false });

    if (!this.props.dataListCancel) {
      await this.props.fetchListCancel(token)
      const { dataListCancel } = this.props;
      if (dataListCancel?.data) {
        for (let i = 0; i < dataListCancel.data.length; i++) {
          this.state.listCancel.push(dataListCancel.data[i].cancelReason)
        }
      }
    }
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize.bind(this));
  }
  resize = () => {
    this.setState({ screen: window.innerWidth });
  };

  _handleChangeKeyword = async (event) => {
    this.page = 1;
    const { userId } = this.props;
    const token = this.props.user?.tokenResponse?.accessToken;
    const { filter, keywordParts } = this.state;
    this.setState({ keywordParts: event.toUpperCase() });
    if (filter !== 0) {
      this.setState({ isLoading: true });
      await this.props.fetchTransactionOrder(
        { UserId: this.props.user?.userId, LastStatus: filter, POCustomer: event, PageNumber: this.page },
        token
      );
      const { orderTransaction } = this.props;
      this.setState({ orderTransaction: orderTransaction.data, isLoading: false });
    } else {
      this.setState({ isLoading: true });
      await this.props.fetchTransactionOrder(
        { UserId: this.props.user?.userId, POCustomer: event, PageNumber: this.page },
        token
      );
      const { orderTransaction } = this.props;
      this.setState({ orderTransaction: orderTransaction.data, isLoading: false });
    }
  };

  handleOrderReceived = async (id) => {
    this.setState({ loadingOrderReceived: true })
    const token = this.props.user?.tokenResponse?.accessToken;
    const body = {
      transactionId: id
    }
    await this.props.fetchPatchOrderReceived(token, body);
    const { dataPatchOrderReceived, errorPatchOrderReceived } = this.props;
    if (dataPatchOrderReceived == 200) {
      this.setAnalyticClevertap("action", "Action_OrderReceived_Success", "View_ListOrder_Screen", null);
      this.pressFilter({ name: "Pesanan Selesai", index: 4 });
      this.componentDidMount();
      this.setState({ loadingOrderReceived: false })
    } else if (errorPatchOrderReceived) {
      this.setAnalyticClevertap("action", "Action_OrderReceived_Error", "View_ListOrder_Screen", null);
      this.setState({ loadingOrderReceived: false })
    }
  }

  render() {
    const { user } = this.props;
    return (
      <>
        <main className='listOrder-page'>
          {this._renderModalAfterCancel()}
          {this._renderModalCancelOrder()}
          {this._renderBreadCrumps()}
          {
            <div style={{ display: "flex", flexDirection: "row" }}>
              <p className='textTitleOrder' style={{ width: "50%" }}>
                Daftar Pesanan
              </p>
              <div style={{ justifyContent: "flex-end", width: "45%", display: "flex" }}>
                <SearchInputMini
                  placeHolder={"Masukkan nomor pesanan atau PO"}
                  name={this.state.keywordParts}
                  handleEnterKey={(event) => this._handleChangeKeyword(event)}
                />
              </div>
            </div>
          }

          <p className='lineHorizontal' />
          {user.customerCode != "ONETIMESTD" ? this._renderFilterCustCode() : this._renderFilterCustOneTime()}
          {this.state.isLoading ? this._renderOrderListSkeleton() : this._renderOrderList()}
        </main>
      </>
    );
  }

  _renderBreadCrumps() {
    const breadcrums = [
      {
        url: MENU.HOME,
        name: "Part Online Transaction",
      },
    ];
    return (
      <>
        <Breadcrumb linkBreadcrumb={breadcrums} typography={"Daftar Pesanan"} />
        <div style={{ paddingBottom: "1rem" }} />
      </>
    );
  }

  _renderFilterCustOneTime() {
    return (
      <div>
        <div className='containerHeaderSortOrder'>
          {this.state.sortingCustOnetime.map((item) => {
            return (
              <div
                onClick={() => this.pressFilter(item)}
                className='cardSortOrder'
                style={
                  item.index === this.state.filter
                    ? { backgroundColor: "#ffd500", cursor: "pointer", color: "#000000" }
                    : { backgroundColor: "#f1f1f1", cursor: "pointer", color: "#404040" }
                }
              >
                <p className={item.index === this.state.filter ? 'cardTitleSortOrder active' : 'cardTitleSortOrder'}>{item.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  _renderFilterCustCode() {
    return (
      <div>
        <div className='containerHeaderSortOrder'>
          {this.state.sortingCustCode.map((item) => {
            return (
              <div
                onClick={() => this.pressFilter(item)}
                className='cardSortOrder'
                style={
                  item.index === this.state.filter
                    ? { backgroundColor: "#ffd500", cursor: "pointer", color: "#000000", padding: "10px 25px", marginRight: "2em" }
                    : { backgroundColor: "#f1f1f1", cursor: "pointer", color: "#404040", padding: "10px 25px", marginRight: "2em" }
                }
              >
                <p className={item.index === this.state.filter ? 'cardTitleSortOrder active' : 'cardTitleSortOrder'}>{item.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
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
        return "Pesanan selesai";
      case name === 5:
        return "Pesanan Dibatalkan";
      default:
        return "";
    }
  };
  _handleShowMore = () => {
    this.setState({ showCollapse: !this.state.showCollapse });
  };
  _ShowMore = async (value) => {
    this.setAnalyticClevertap("click", "Click_ShowMoreOrder", "View_ListOrder_Screen", null);
    this.page = this.page + value;
    const token = this.props.user?.tokenResponse?.accessToken;
    const { keywordParts } = this.state;
    let data = {
      UserId: this.props.user?.userId,
      POCustomer: keywordParts,
      PageNumber: this.page,
    };
    this.setState({ isLoadingMore: true });
    await this.props.fetchTransactionOrder(data, token);
    this.setState({ isLoadingMore: false });
    const { orderTransaction } = this.props;
    this.setState({ orderTransaction: this.state.orderTransaction.concat(orderTransaction.data) });
  };

  _renderOrderNotFound = () => {
    return (
      <div className='containerNotFound'>
        <img src={imageNotFound} className='imgNotFound'></img>
        <p className='titleNotFound'>Tidak bisa menemukan pesanan</p>
      </div>
    );
  };

  submitCancel = async (data) => {
    const token = this.props.user?.tokenResponse?.accessToken;
    const body = {
      transactionId: this.state.transactionIdCancel,
      reason: data
    }
    this._renderModalAfterCancel(true)
    await this.props.fetchPatchCancelReason(token, body);
    const { dataPatchCancelReason, errorPatchCancelReason } = this.props;
    if (dataPatchCancelReason) {
      this.setAnalyticClevertap("action", "Action_CancleOrder_Success", "View_ListOrder_Screen", null);
      this.setState({ openModalAfterCancel: true })
      this.componentDidMount()
    } else if (errorPatchCancelReason) {
      this.setAnalyticClevertap("action", "Action_CancleOrder_Error", "View_ListOrder_Screen", null);
      this.setState({ openModalAfterCancel: true })
    }
  }

  _openModalCancel(data) {
    this.setState({ openModalCancleOrder: true, transactionIdCancel: data })
    this.setAnalyticClevertap("click", "Click_ModalCancleOrder", "View_ListOrder_Screen", null);
  }

  _renderModalAfterCancel = () => {
    return (
      <ModalAfterCancel
        isOpen={this.state.openModalAfterCancel}
        isClose={() => this.setState({ openModalAfterCancel: false })}
        data={this.props.dataPatchCancelReason}
      />
    )
  }

  _renderModalCancelOrder() {
    return (
      <ModalCancelOrder
        isOpen={this.state.openModalCancleOrder}
        isClose={() => this.setState({ openModalCancleOrder: false })}
        cancel={() => this.setState({ openModalCancleOrder: false })}
        listCancel={this.state.listCancel}
        onSubmit={(data) => this.submitCancel(data)}
      />
    )
  }

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
  }

  _renderOrderListSkeleton() {
    return (
      <div style={{ marginBottom: 10 }}>
        <div className='containerCardProduct'>
          <Paper className='default-padding-card'>
            <div className='default-content-top'>
              <p className='titleDateOrder'>
                <Skeleton height={20} width={100} />
              </p>
              <div className='rowInvoice'>
                <p className='titleInvoiceOrder'>
                  <Skeleton />
                </p>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className='line-vertical-status' />
                  <p className='titleStatusOrder'>
                    <Skeleton height={20} width={150} />
                  </p>
                </div>
              </div>
            </div>
            <p className='lineHorizontal-card' />
            <div className='default-content-mid'>
              <Skeleton height={105} width={105} />
              <div className='container-items-list container-margin-left'>
                <p className='title-kategory-order'>
                  <Skeleton />
                </p>
                <p className='title-product-order'>
                  <Skeleton />
                </p>
                <div className='default-content-column'>
                  <p className='titlePrice-order'>
                    <Skeleton width={100} />
                  </p>
                  <p className='dotOrder' style={{ marginLeft: 10, marginRight: 10, marginBottom: 0, marginTop: 10 }}>
                    <Skeleton height={10} width={10} circle />
                  </p>
                  <p className='titleQty-order' style={{ marginTop: 5 }}>
                    <Skeleton width={100} />
                  </p>
                </div>
              </div>
              <div className='line-vertical' />
              <div className='container-items-list'>
                <p className='title-kategory-order'>
                  <Skeleton height={20} width={150} />
                </p>
                <p className='titlePrice-order'>
                  <Skeleton height={20} width={100} />
                </p>
              </div>
            </div>

            <div className='default-content-row-mid' style={{ backgroundColor: "#f9f9f9" }}>
              <p className='title-kategory-order'>
                <Skeleton height={25} width={150} />
              </p>
              <p className='titlePriceTotal-order'>
                <Skeleton height={25} width={100} />
              </p>
            </div>
            <div className='default-content-row-bottom'>
              <div className='rowButtonOrder'>
                <div className='button-detail'>
                  <p className='textBuy'>
                    <Skeleton height={16} width={100} />
                  </p>
                </div>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    );
  }

  _renderOrderList() {
    const { user } = this.props;
    return (
      <div style={{ marginBottom: 10 }}>
        <div className='containerCardProduct'>
          {this.state.orderTransaction?.length === 0
            ? this._renderOrderNotFound()
            : this.state.orderTransaction?.map((item) => {
              return (
                <Paper className='default-padding-card'>
                  <div className='default-content-top'>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <p className='titleDateOrder'>{moment(item.createdDate + "Z").format("DD MMMM YYYY, HH:mm")} WIB</p>
                    </div>
                    <div className='rowInvoice'>
                      <p className='titleInvoiceOrder'>{item.orderCanceled ? "" : item.invoice}</p>
                      <p className='titleStatusOrder' style={{ color: "#707070" }}>
                        {item.poCustomer ? `(${item.poCustomer})` : null}
                      </p>
                      <div className='line-vertical-status' />
                      <p
                        className='titleStatusOrder'
                        style={item.lastStatus === 5 ? { color: "#d0021b" } : item.lastStatus === 4 ? { color: "#148F0F" } : { color: "#F4CB00" }}
                      >
                        {this.changeStatusName(
                          item.lastStatus,
                          item.shipments[0]?.name == "Free Pickup" ? true : false
                        )}
                      </p>
                    </div>
                  </div>
                  <p className='lineHorizontal-card' />
                  {!this.state.showCollapse ? (
                    <div className='default-content-mid'>
                      <img className='image-list-order card-image-order' src={brakeImg} />
                      <div className='container-items-list container-margin-left'>
                        <div className='default-content-column'>
                          <p className='title-kategory-order'>{item.items[0]?.brandName}</p>
                          <p className='dotOrder' style={{ marginLeft: 10, marginRight: 10, marginBottom: 5 }}>
                            {" "}
                            ●{" "}
                          </p>
                          <p className='title-kategory-order'>{item.items[0]?.productName}</p>
                        </div>

                        <p className='title-product-order'>{item.items[0]?.productDescription}</p>
                        <div className='default-content-column'>
                          <p className='titlePrice-order'>{formatCurrency(item.items[0]?.price)}</p>
                          <p className='dotOrder' style={{ marginLeft: 10, marginRight: 10, marginBottom: 0 }}>
                            {" "}
                            ●{" "}
                          </p>
                          <p className='titleQty-order'>{item.items[0]?.quantity} Produk</p>
                        </div>
                      </div>
                      <div className='line-vertical' />
                      <div className='container-items-list' style={{ justifyContent: 'left' }}>
                        <p className='title-kategory-order'>Harga Produk</p>
                        <p className='titlePrice-order'>Rp {formatCurrency(item.items[0]?.subTotalPrice)}</p>
                        {item.lastStatus === 1 ?
                          (<Row className="payTimer">
                            <img src={IconTimer} alt="timer" />
                            <p className="textTimer">Bayar Sebelum {moment(`${item?.paymentExpired}Z`).format("DD MMM YYYY, HH:mm")} WIB</p>
                          </Row>
                          ) : null}
                      </div>
                    </div>
                  ) : (
                    <>
                      {item.items.map((data) => {
                        return (
                          <div className='default-content-mid'>
                            <img className='image-list-order card-image-order' src={brakeImg} />
                            <div className='container-items-list container-margin-left'>
                              <div className='default-content-column'>
                                <p className='title-kategory-order'>{data.brandName}</p>
                                <p className='dotOrder' style={{ marginLeft: 10, marginRight: 10, marginBottom: 0 }}>
                                  {" "}
                                  ●{" "}
                                </p>
                                <p className='title-kategory-order'>{data.productName}</p>
                              </div>
                              <p className='title-product-order'>{data.productDescription}</p>
                              <div className='default-content-column'>
                                <p className='titlePrice-order'>{formatCurrency(data.price)}</p>
                                <p className='dotOrder' style={{ marginLeft: 10, marginRight: 10, marginBottom: 0 }}>
                                  {" "}
                                  ●{" "}
                                </p>
                                <p className='titleQty-order'>{data.quantity} Produk</p>
                              </div>
                            </div>
                            <div className='line-vertical' />
                            <div className='container-items-list'>
                              <p className='title-kategory-order'>Harga Produk</p>
                              <p className='titlePrice-order'>Rp {formatCurrency(data.subTotalPrice)}</p>
                              <Row style={{ marginLeft: 5, marginTop: 8 }}>
                              </Row>
                              <p className='titlePrice-order'></p>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                  {item.items.length > 1 ? (
                    <div
                      className='default-content-column-mid'
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        this._handleShowMore()
                        this.setAnalyticClevertap("click", "Click_ShowMoreProduct", "View_ListOrder_Screen", ["Click_ShowMoreProduct", { "Product_Count": item.items.length }]);
                      }}
                    >
                      <p className='lineHorizontal-card' />
                      <div className='cardMoreProduct'>
                        <p className='title-item-more'>
                          {this.state.showCollapse
                            ? "Sembunyikan Produk"
                            : `Lihat ${item.items.length - 1} Produk Lainnya`}
                        </p>
                        <p style={{ color: "#707070", marginLeft: 6 }}> ▼ </p>
                      </div>
                    </div>
                  ) : null}
                  <div className='default-content-row-mid' style={{ backgroundColor: "#f9f9f9" }}>
                    <p className='title-kategory-order'>Total Harga</p>
                    <p className='titlePriceTotal-order'>Rp {formatCurrency(item.grandTotal)}</p>
                  </div>
                  <div className='default-content-row-bottom'>
                    {item.lastStatus === 1 ?
                      <span
                        className="btn-cancle-order"
                        onClick={() => this._openModalCancel(item.transactionId)}
                      >
                        <img className="icon-cancle" src={IconCancleOrder} />Batalkan Pesanan
                      </span> : null}
                    <div className='rowButtonOrder'>
                      {item.lastStatus === 5 ? null :
                        item.lastStatus === 1 ?
                          <div
                            className='button-detail'
                            onClick={() => {
                              this.props.push(MENU.TRANSFER, {
                                "paymentExpired": item?.paymentExpired,
                                "paymentNumber": item?.paymentNumber,
                                "grandTotal": item?.grandTotal,
                                "grandTotal": item?.grandTotal,
                                "paymentMethod": item?.paymentMethod,
                              })
                              this.setAnalyticClevertap("click", "Click_PayNow", "View_ListOrder_Screen", null);
                            }}
                          >
                            <p className='textBuy'>Bayar Sekarang</p>
                          </div> : item.lastStatus === 3 ?
                            <div className='button-detail'>
                              {this.state.loadingOrderReceived ? (
                                <p className='textBuy'>Memuat...</p>
                              ) : (
                                <p className='textBuy' onClick={() => this.handleOrderReceived(item.transactionId)}>Pesanan Diterima</p>
                              )}
                            </div> :
                            null
                      }
                    </div>
                    <div
                      className='button-detail-lacak'
                      onClick={() => {
                        this.setAnalyticClevertap("click", "Click_DetailOrder", "View_ListOrder_Screen", ["Click_DetailOrder", { "Order_Status": this.changeStatusName(item.lastStatus, item.shipments[0]?.name == "Free Pickup" ? true : false) }]);
                        this.props.push(`${MENU.DETAIL_LIST_ORDER}/${item.transactionId}`, [item.transactionId, item.lastStatus])
                      }}
                    >
                      <p className='textBuy'>Detail Pesanan</p>
                    </div>
                  </div>
                </Paper>
              );
            })}
        </div>
        {this.props.orderTransaction?.meta?.hasNextPage === true ? (
          <div style={{ alignItems: "center", cursor: "pointer", justifyContent: "center", display: "flex" }}>
            {this.state.isLoadingMore ? (
              <div className='cardMore'>
                <p className='titleButtonMore'> Memuat ...</p>
              </div>
            ) : (
              <div className='cardMore' onClick={() => this._ShowMore(1)}>
                <p className='titleButtonMore'> Tampilkan Lebih Banyak Pesanan</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  }

  _renderOrderCreate() {
    return (
      <div style={{ marginBottom: 10 }}>
        <div className='containerCardProduct'>
          {this.state.listOrderCreate.map((item) => {
            return (
              <Paper className='default-padding-card'>
                <div className='default-content-top'>
                  <p className='titleDateOrder'>{item.date}</p>
                </div>
                <p className='lineHorizontal-card' />
                <div className='default-content-mid'>
                  <img className='image-list-order card-image-order' src={item.image} />
                  <div className='container-items-list container-margin-left'>
                    <p className='title-kategory-order'>{item.name}</p>
                    <p className='title-product-order'>{item.product}</p>
                    <div className='default-content-column'>
                      <p className='titlePrice-order'>{item.price}</p>
                      <p style={{ marginLeft: 10, marginRight: 10, marginBottom: 0 }}> ● </p>
                      <p className='titleQty-order'>{item.qty} Produk</p>
                    </div>
                  </div>
                  <div className='line-vertical ' />
                  <div className='container-items-list'>
                    <p className='title-kategory-order'>Total Harga</p>
                    <p className='titlePrice-order'>Rp {item.total}</p>
                  </div>
                </div>
                {item.moreProduct ? (
                  <div className='default-content-column-mid'>
                    <p className='lineHorizontal-card' />
                    <div className='cardMoreProduct'>
                      <p className='title-item-more'>Lihat 2 Produk Lainnya</p>
                      <p style={{ color: "#707070", marginLeft: 6 }}> ▼ </p>
                    </div>
                  </div>
                ) : null}
                <div className='default-content-row-mid' style={{ backgroundColor: "#f9f9f9" }}>
                  <p className='title-kategory-order'>Total Harga</p>
                  <p className='titlePriceTotal-order'>Rp {item.total}</p>
                </div>
                <div className='default-content-row-bottom'>
                  <div className='rowButtonOrder'>
                    <div className='button-detail' onClick={() => this.props.push(MENU.DETAIL_LIST_ORDER)}>
                      <p className='textBuy'>Detail Transaksi</p>
                    </div>
                  </div>
                </div>
              </Paper>
            );
          })}
        </div>
      </div>
    );
  }

  _renderOrderRTPU() {
    return (
      <div style={{ marginBottom: 10 }}>
        <div className='containerCardProduct'>
          {this.state.listOrderRTPU.map((item) => {
            return (
              <Paper className='default-padding-card'>
                <div className='default-content-top'>
                  <p className='titleDateOrder'>{item.date}</p>
                  <div className='rowInvoice'>
                    <p className='titleInvoiceOrder'>{item.orderCanceled ? "" : item.invoice}</p>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div className='line-vertical-status' />
                      <p
                        className='titleStatusOrder'
                        style={item.orderCanceled ? { color: "#d0021b" } : { color: "#148f0f" }}
                      >
                        {item.status}
                      </p>
                    </div>
                  </div>
                </div>
                <p className='lineHorizontal-card' />
                <div className='default-content-mid'>
                  <img className='image-list-order card-image-order' src={item.image} />
                  <div className='container-items-list container-margin-left'>
                    <p className='title-kategory-order'>{item.name}</p>
                    <p className='title-product-order'>{item.product}</p>
                    <div className='default-content-column'>
                      <p className='titlePrice-order'>{item.price}</p>
                      <p style={{ marginLeft: 10, marginRight: 10, marginBottom: 0 }}> ● </p>
                      <p className='titleQty-order'>{item.qty} Produk</p>
                    </div>
                  </div>
                  <div className='line-vertical ' />
                  <div className='container-items-list'>
                    <p className='title-kategory-order'>Total Harga</p>
                    <p className='titlePrice-order'>Rp {item.total}</p>
                  </div>
                </div>
                {item.moreProduct ? (
                  <div className='default-content-column-mid'>
                    <p className='lineHorizontal-card' />
                    <div className='cardMoreProduct'>
                      <p className='title-item-more'>Lihat 2 Produk Lainnya</p>
                      <p style={{ color: "#707070", marginLeft: 6 }}> ▼ </p>
                    </div>
                  </div>
                ) : null}
                <div className='default-content-row-mid' style={{ backgroundColor: "#f9f9f9" }}>
                  <p className='title-kategory-order'>Total Harga</p>
                  <p className='titlePriceTotal-order'>Rp {item.total}</p>
                </div>
                <div className='default-content-row-bottom'>
                  <div className='rowButtonOrder'>
                    <div className='button-detail' onClick={() => this.props.push(MENU.DETAIL_LIST_ORDER)}>
                      <p className='textBuy'>Detail Transaksi</p>
                    </div>
                  </div>
                </div>
              </Paper>
            );
          })}
        </div>
      </div>
    );
  }

  _renderOrderCanceled() {
    return (
      <div style={{ marginBottom: 10 }}>
        <div className='containerCardProduct'>
          {this.state.listOrderCanceled.map((item) => {
            return (
              <Paper className='default-padding-card'>
                <div className='default-content-top'>
                  <p className='titleDateOrder'>{item.date}</p>
                  <div className='rowInvoice'>
                    <p className='titleInvoiceOrder'>{item.orderCanceled ? "" : item.invoice}</p>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div className='line-vertical-status' />
                      <p
                        className='titleStatusOrder'
                        style={item.orderCanceled ? { color: "#d0021b" } : { color: "#148f0f" }}
                      >
                        {item.status}
                      </p>
                    </div>
                  </div>
                </div>
                <p className='lineHorizontal-card' />
                <div className='default-content-mid'>
                  <img className='image-list-order card-image-order' src={item.image} />
                  <div className='container-items-list container-margin-left'>
                    <p className='title-kategory-order'>{item.name}</p>
                    <p className='title-product-order'>{item.product}</p>
                    <div className='default-content-column'>
                      <p className='titlePrice-order'>{item.price}</p>
                      <p style={{ marginLeft: 10, marginRight: 10, marginBottom: 0 }}> ● </p>
                      <p className='titleQty-order'>{item.qty} Produk</p>
                    </div>
                  </div>
                  <div className='line-vertical ' />
                  <div className='container-items-list'>
                    <p className='title-kategory-order'>Total Harga</p>
                    <p className='titlePrice-order'>Rp {item.total}</p>
                  </div>
                </div>
                {item.moreProduct ? (
                  <div className='default-content-column-mid'>
                    <p className='lineHorizontal-card' />
                    <div className='cardMoreProduct'>
                      <p className='title-item-more'>Lihat 2 Produk Lainnya</p>
                      <p style={{ color: "#707070", marginLeft: 6 }}> ▼ </p>
                    </div>
                  </div>
                ) : null}
                <div className='default-content-row-mid' style={{ backgroundColor: "#f9f9f9" }}>
                  <p className='title-kategory-order'>Total Harga</p>
                  <p className='titlePriceTotal-order'>Rp {item.total}</p>
                </div>
                <div className='default-content-row-bottom'>
                  <div className='rowButtonOrder'>
                    <div
                      className='button-detail'
                      onClick={() => this.props.push(MENU.DETAIL_LIST_ORDER, "Cancel Order")}
                    >
                      <p className='textBuy'>Detail Pembatalan</p>
                    </div>
                  </div>
                </div>
              </Paper>
            );
          })}
        </div>
      </div>
    );
  }
}
ListOrderPage.propTypes = {
  errorDesc: PropTypes.string,
  isLoading: PropTypes.bool,
  login: PropTypes.func,
  tokenResponse: PropTypes.object,
};
ListOrderPage.defaultProps = {
  errorDesc: null,
  isLoading: false,
  login: null,
  tokenResponse: null,
};
export default ListOrderPage;
