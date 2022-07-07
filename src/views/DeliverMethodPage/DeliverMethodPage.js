import PropTypes from "prop-types";
import React from "react";
import "./DeliverMethodPage.scss";
import {
  IconWalletFillet,
  IconTransfer,
  IconOnlineWallet,
  IconDebit,
  IconWarehouse,
  IconCeklist,
  IconWalletWhite,
  IconVerify,
  IconDenied,
  IconUTCall,
  IconMail,
  CloudUpload,
  IconPDF,
  Dropdown,
  IconShipment,
} from "assets/icons";

import { Row, Col, Input } from "reactstrap";
import { DialogContent, Modal, Paper, Checkbox } from "@material-ui/core";
import ModalShippment from "./components/ModalShippment";
import CircularProgress from "@material-ui/core/CircularProgress";
import "react-sweet-progress/lib/style.css";
import Skeleton from "react-loading-skeleton";
import * as Utils from "../../utils/format.helper";
import firebase from "../../firebase/firebase";
import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import ModalSuccessCreateOrder from "components/ModalSuccessCreateOrder/ModalSuccessCreateOrder";
import ModalErrorPurchase from "components/ModalErrorPurchase/ModalErrorPurchase";
import ModalAccessDenied from "components/ModalAccessDenied/ModalAccessDenied";
import ModalMyVoucher from "./components/ModalMyVoucher";
import ModalNotReadyStock from "./components/ModalNotReadyStock";
import { Progress } from "react-sweet-progress";
import { brakeImg } from "assets/images";
import { MENU } from "constants/menu";


class DeliverMethodPage extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      showPassword: false,
      modalShippment: false,
      modalSuccessOrder: false,
      filter: 1,
      purchaseOrder: "",
      listPaymentdata: [],
      sortingSelect: null,
      selectPayment: null,
      loading: false,
      screen: null,
      isModalVerify: false,
      modalAr: false,
      errorCustomer: false,
      message: "",
      messageSO: "",
      page: 1,
      changeStatus: 3,
      deliveryMethode: false,
      cartId: this.props?.history?.location.state != undefined ? this.props.history.location.state : null,
      paymentName: "",
      bankSelected: "",
      bankSelectedName: "",
      bankSelectRadio: null,
      dataAddress: null,
      dataShipment: [],
      pdfFileName: null,
      filePdf: null,
      openModalErrorFilePdf: false,
      openModalErrorFilePdfFormat: false,
      openModalErrorPo: false,
      openModalErrorFile: false,
      openModalNotReadyStock: false,
      showDetail: true,
      openModalMyVoucher: false,
      promoCode: "",
      listVoucherClaimed: null,
      specialChar: false,
      isUseVoucher: false,
      listPaymentMethod: null,
      paymentSelected: null,
      shipmentTitle: null,
      shipmentName: null,
      shipmentDate: null,
      shipmentPrice: 0,
      shipmentId: null,
      shipmentInsurancePrice: 0,
      isinsurance: false,
      succesCheckoutProduct: null,
      isReadyStock: false,
      tax: 0,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    this._initApi();
    this.setAnalyticClevertap("view", "View_DeliveryMethod_Screen", "View_DeliveryMethod_Screen", null);
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
    window.scrollTo(0, 0);
    if (this.props.user.customerCode != "ONETIMESTD") {
      this._setItemShipmentCustUT();
    };
  }

  async _initApi() {
    const { user } = this.props;
    await this.props.fetchCheckoutProduct(this.props?.history?.location.state, user.tokenResponse.accessToken)
    const { succesCheckoutProduct } = this.props;
    if (succesCheckoutProduct != null) {
      this.setState({ purchaseOrder: succesCheckoutProduct.poCustomer });
    } else if (this.props.errorCheckoutProduct != null) {
      this.setState({ openModalErrorPurchase: true });
    }
    if (user.customerCode != "ONETIMESTD") {
      await this.props.checkCustomer(user.tokenResponse.accessToken);
      if (this.props.errorCustomer != null) {
        this.setState({ errorCustomer: true });
      }
    } else if (user.customerCode == "ONETIMESTD") {
      await this._checkStock();
    }

    await this.props.fetchAttributeName('tax')
    const { attributeName } = this.props;
    if (attributeName) {
      const selectedTax = attributeName.data.filter(item => item.display == true)
      this.setState({ tax: parseFloat(String(selectedTax[0].value)) / 100 })
    }

    await this.props.fetchPurchaseSummary(this.props?.history?.location.state, user.tokenResponse.accessToken)
    const { purchaseSummary } = this.props;
    if (purchaseSummary != null) {
      this.setState({ purchaseSummary })
    }

    await this.props.fetchPaymentMethodList(user.tokenResponse.accessToken);
    if (this.props.paymentMethodList !== null) {
      this.setState({ listPaymentMethod: this.props.paymentMethodList });
    }
    await this.props.fetchGetBillingList(user.userId, user.tokenResponse.accessToken);
    const { billingAddressList } = this.props;
    if (billingAddressList) {
      for (let i = 0; this.props.billingAddressList.length > i; i++) {
        if (this.props.billingAddressList[i].isPrimary) {
          this.setState({ dataAddress: this.props.billingAddressList[i] });
        }
      }
      if (succesCheckoutProduct) {
        const cartId = []
        for (let i = 0; succesCheckoutProduct.cartDetail.length > i; i++) {
          cartId.push(succesCheckoutProduct.cartDetail[i].cartDetailId)
        }
        const body = {
          shippingCost: {
            origin: succesCheckoutProduct.branchCode,
            destination: {
              subdistrict: this.state.dataAddress?.village,
              district: this.state.dataAddress?.districts,
              city: this.state.dataAddress?.city,
              province: this.state.dataAddress?.province,
              zipcode: this.state.dataAddress?.postalCode,
            },
            cartId: cartId,
            iswood: true,
            isinsurance: true,
            thirdpartycode: "",
          },
        };
        await this.props.fetchShipmentList(user.tokenResponse.accessToken, body);
        const { dataShipment } = this.props;
        if (dataShipment) {
          this.setState({ dataShipment: dataShipment.response ? dataShipment.response.result : [] });
        }
      }
    }
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

  _eventInputPO = (value) => {
    let format = /[ `!@#$%^&*+\=\[\]{};'"\\|<>\?~]/;
    this.setState({ purchaseOrder: value });
    if (format.test(value) == false) {
      this.setState({ specialChar: false });
    } else {
      this.setState({ specialChar: true });
    }
  };

  resize = () => {
    this.setState({ screen: window.innerWidth });
  };
  componentWillUnmount() {
    window.removeEventListener("resize", this.resize.bind(this));
  }

  capitalizeEachWord(value) {
    let splitStr = value.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  }

  _setItemShipment = (shipmentId, isInsurence, insurance, kurir, expedisi, date, price) => {
    this.setAnalyticClevertap("action", "Action_SelectShipment", "View_DeliveryMethod_Screen", ["Action_SelectShipment", { "Shipment_Title": expedisi }]);
    this.setState({
      shipmentTitle: expedisi,
      shipmentName: kurir,
      shipmentDate: date,
      shipmentPrice: price,
      shipmentInsurancePrice: insurance,
      isinsurance: false,
      shipmentId: shipmentId,
      modalShippment: false,
    });
  };

  _setItemShipmentCustUT = () => {
    this.setState({
      shipmentTitle: "Ambil Sendiri",
      shipmentName: null,
      shipmentDate: "Hanya dapat melayani pada jam operasional 09.00 - 15.00",
      shipmentPrice: "Bebas Biaya",
      shipmentInsurancePrice: null,
      isinsurance: false,
      shipmentId: null,
      modalShippment: false,
    });
  };

  _renderModalConfirmPkps = () => {
    const { isModalVerify } = this.state;
    return (
      <Modal
        open={isModalVerify}
        onClose={() => this.setState({ isModalVerify: !isModalVerify })}
        className='modal-container'
      >
        <DialogContent className='confirmation-modal-content'>
          <div className='modal-pkps'>
            <p className='confirm-title'> Konfirmasi PKPS</p>
            <img src={IconVerify} alt='icon-verify' className='img-container' />
            <p className='verify-code-title'>Kode Verifikasi</p>
            <p className='text-description'>
              Demi keamanan transaksi, silahkan masukkan kode verifikasi yang telah dikirimkan ke nomor telepon kamu
            </p>
            <div className='verify-code'>
              <input maxLength='1' />
              <input maxLength='1' />
              <input maxLength='1' />
              <input maxLength='1' />
              <input maxLength='1' />
              <input maxLength='1' />
            </div>
            <div className='btn-submit'>Kirim</div>
            <p className='resend-code'>Kirim Ulang Kode</p>
          </div>
        </DialogContent>
      </Modal>
    );
  };

  onSearchVoucher = async (code) => {
    const { user } = this.props;
    await this.props.fetchVoucherClaimedList(user.tokenResponse.accessToken, code);
    if (this.props.voucherClaimedList != null) {
      this.setState({ listVoucherClaimed: this.props.voucherClaimedList });
    }
  };

  _renderModalMyVoucher = () => {
    return (
      <ModalMyVoucher
        onSearch={(code) => this.onSearchVoucher(code)}
        dataVoucher={this.props.voucherClaimedList}
        isOpen={this.state.openModalMyVoucher}
        isClose={() => this.setState({ openModalMyVoucher: false })}
        onSubmit={(voucher) => this.setState({ promoCode: voucher.voucherCode, openModalMyVoucher: false })}
      />
    );
  };

  _renderModalSuccessCreateOrder = () => {
    const { succesCreateSo, user } = this.props;
    const paymentExpired = succesCreateSo?.paymentExpired ? succesCreateSo?.paymentExpired.split("+00:00")[0] : null;
    return (
      <ModalSuccessCreateOrder
        isOpen={this.state.modalSuccessOrder}
        isOnetime={user.customerCode == "ONETIMESTD" ? true : false}
        toOrderList={() => {
          succesCreateSo?.paymentNumber ?
            this.props.push(MENU.TRANSFER, {
              "paymentExpired": paymentExpired,
              "paymentNumber": succesCreateSo?.paymentNumber,
              "grandTotal": succesCreateSo?.grandTotal,
              "grandTotal": succesCreateSo?.grandTotal,
              "paymentMethod": succesCreateSo?.paymentMethod,
            }
            ) :
            document.location.replace(MENU.LIST_ORDER)
        }}
      />
    );
  };

  _renderModalErrorPurchase = () => {
    return (
      <ModalErrorPurchase
        isOpen={false}
        onSubmit={() => this.props.push(MENU.HOME)}
        errorText={"Kamu tidak dapat mengakses laman ini"}
        title={"Huhu sayang sekali..."}
      />
    );
  };

  _renderModalNotReadyStock = () => {
    const { succesCheckoutProduct } = this.props;
    return (
      <ModalNotReadyStock
        isOpen={this.state.openModalNotReadyStock}
        isClose={() => this.setState({ openModalNotReadyStock: false })}
        onSubmit={() => this.props.push(MENU.BUCKET_LIST, succesCheckoutProduct.cartId)}
      />
    );
  };

  _renderBreadcrump = () => {
    const breadcrums = [
      {
        url: MENU.HOME,
        name: "Part Online Transaction",
      },
      {
        url: MENU.BUCKET_LIST,
        name: "Keranjang",
      },
      {
        url: MENU.BILLING,
        name: "Informasi Kontak",
      },
    ];
    return <Breadcrumb linkBreadcrumb={breadcrums} typography={"Pembayaran"} />;
  };

  _clickPdf = async () => {
    this.setAnalyticClevertap("click", "Click_OpenModalPODocument", "View_DeliveryMethod_Screen", null);
    document.getElementById("uploadPdf").click();
    document.getElementById("uploadPdf").onchange = async () => {
      var file = document.getElementById("uploadPdf").files[0];
      var size = file.size / 1024 / 1024;
      if (size > 3 && file.type === "application/pdf") {
        this._openModalErrorFilePdf();
      } else if (file.type != "application/pdf") {
        this._openModalErrorFilePdfFormat();
      } else if (file.type === "application/pdf" && file.size <= 5242880) {
        const { user } = this.props;
        const formData = new FormData();
        formData.append("file", file);
        const resp = await this.props.fetchUploadAttachment(user.tokenResponse.accessToken, formData);
        if (resp != null || resp != 400) {
          this.setState({ pdfFileName: resp.fileName, filePdf: resp.path });
          this.setAnalyticClevertap("action", "Action_AddPODocument_Success", "View_DeliveryMethod_Screen", ["Action_AddPODocument_Success", { "PO_Document_Name": resp.fileName }]);
        } else {
          this.setAnalyticClevertap("action", "Action_AddPODocument_Error", "View_DeliveryMethod_Screen", ["Action_AddPODocument_Error", { "PO_Document_Name": null }]);
        }
      }
    };
  };

  _renderPKPS = () => {
    return this.state.loading === true && this.state.screen > 900 ? (
      <Skeleton style={{ margin: 10 }} count={1} height={100} width={550} />
    ) : this.state.loading === true && this.state.screen >= 760 && this.state.screen < 900 ? (
      <Skeleton style={{ margin: 10 }} count={1} height={100} width={500} />
    ) : this.state.loading === true && this.state.screen < 760 ? (
      <Skeleton style={{ margin: 10 }} count={1} height={100} width={200} />
    ) : (
      <div
        className='card-item-title'
        style={{ marginTop: 20, flexDirection: "column", display: "flex", alignItems: "center" }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                className='card-wallet'
                style={
                  this.props.dataCustomer?.arBlock || this.props.dataCustomer?.creditBlock
                    ? { backgroundColor: "#D0021B" }
                    : { backgroundColor: "#148F0F" }
                }
              >
                <img src={IconWalletWhite} width='25' height='25' />
              </div>
              {this.props.dataCustomer ? (
                <div style={{ marginLeft: 20 }}>
                  <p className='title-status-payment'>Status</p>
                  <p
                    className='title-price-payment'
                    style={
                      this.props.dataCustomer?.arBlock || this.props?.dataCustomer.creditBlock
                        ? { color: "#D0021B" }
                        : { color: "#148F0F" }
                    }
                  >
                    {this.props.dataCustomer?.arBlock || this.props.dataCustomer?.creditBlock ? "Not Available" : "Available"}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className='cardPO'>
          <p className='titlePO'>Nomor PO</p>
          <Input
            type='text'
            value={this.state.purchaseOrder}
            disabled={this.props.dataCustomer?.arBlock || this.props.dataCustomer?.creditBlock ? true : false}
            placeholder={"Ketik Nomor PO ..."}
            style={this.state.specialChar ? { borderColor: "red" } : null}
            onChange={(event) => this._eventInputPO(event.target.value)}
          />
          <div className='rowSelectFile'>
            <p className='titlePO'>Dokumen PO</p>
            <div
              className='selectFile'
              style={
                this.props.dataCustomer?.arBlock || this.props.dataCustomer?.creditBlock
                  ? { cursor: 'default' } : {}
              }
            >
              <input id='uploadPdf' hidden type='file' onChange={() => this._clickPdf()} accept='application/pdf' />
              <img src={CloudUpload} className='iconUpload' />
              <p onClick={
                this.props.dataCustomer?.arBlock || this.props.dataCustomer?.creditBlock
                  ? null
                  : () => this._clickPdf()
              }
                className='textSelectFile'
              >
                Pilih Dokumen
              </p>
            </div>
          </div>
          {this.state.pdfFileName ? (
            <div className='rowPdf'>
              <img src={IconPDF} className='iconPdf' />
              <Col>
                <Row style={{ justifyContent: "space-between", padding: "0 1vw", marginBottom: "0.5vw" }}>
                  <p className='titlePdf'>{this.state.pdfFileName}</p>
                  <p className='titlePdf'>100%</p>
                </Row>
                <Progress percent={100} status='success' />
              </Col>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  _renderEWallet = () => {
    return (
      <div
        className='card-item-title'
        style={{
          marginTop: 20,
          flexDirection: "column",
          display: "flex",
        }}
      >
        {this.state.listPaymentMethod
          ?.filter((item) => item.name == "E-Wallet")[0]
          .paymentChannels.map((data) => (
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => this.setState({ eWalletSelect: data.name })}
            >
              {this.state.eWalletSelect === data.name ? this._renderRadio() : this._renderRadioUnselect()}
              <div
                className='card-bank'
                style={{
                  flexDirection: "row",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <p className='title-bank'>{data.name}</p>
                <img src={data.icon} className='margin-image-bank iconWallet' />
              </div>
            </div>
          ))}
      </div>
    );
  };

  render() {
    return (
      <>
        <div className='paddingBreadCrumps'>{this._renderBreadcrump()}</div>
        {this._renderModalConfirmPkps()}
        {this._renderModalSuccessCreateOrder()}
        {this._renderModalErrorPurchase()}
        {this._renderModalErrorPo()}
        {this._renderModalErrorFilePdf()}
        {this._renderModalErrorFilePdfFormat()}
        {this._renderModalErrorFile()}
        {this._renderModalMyVoucher()}
        {this._renderModalNotReadyStock()}
        <main className='listMethode-page default-margin-left-right'>
          {this._renderModalDenied()}
          {this._renderModalError()}
          <ModalShippment
            customerCode={this.props.user.customerCode}
            dataBranch={this.props.succesCheckoutProduct}
            dataShipment={this.state.dataShipment}
            isOpen={this.state.modalShippment}
            isClose={() => {
              this.setState({ modalShippment: false });
              this.setAnalyticClevertap("click", "Click_CloseModalShipment", "View_DeliveryMethod_Screen", null);
            }}
            simpan={(shipmentId, isInsurence, insurance, kurir, expedisi, date, price) =>
              this._setItemShipment(shipmentId, isInsurence, insurance, kurir, expedisi, date, price)
            }
          />

          <div className='default-flex-row default-margin-left-right'>
            <div className='default-flex-one ' style={{ flexDirection: "column" }}>
              <p className='default-margin-left-right default-margin-top-bottom title-methode'>Alamat Pengiriman</p>
              {this.state.loading === true && this.state.screen > 900 ? (
                <Skeleton style={{ margin: 10 }} count={1} height={100} width={550} />
              ) : this.state.loading === true && this.state.screen >= 760 && this.state.screen < 900 ? (
                <Skeleton style={{ margin: 10 }} count={1} height={100} width={500} />
              ) : this.state.loading === true && this.state.screen < 760 ? (
                <Skeleton style={{ margin: 10 }} count={1} height={100} width={200} />
              ) : (
                this.props.user?.customerCode == "ONETIMESTD" ?
                  this._renderDeliveryMethode() : this._renderDeliveryMethodeCustomerUT()
              )}
              <p className='default-margin-left-right default-margin-top-bottom title-methode'>Cabang UT</p>
              {this.state.loading === true && this.state.screen > 900 ? (
                <Skeleton style={{ margin: 10 }} count={1} height={100} width={550} />
              ) : this.state.loading === true && this.state.screen >= 760 && this.state.screen < 900 ? (
                <Skeleton style={{ margin: 10 }} count={1} height={100} width={500} />
              ) : this.state.loading === true && this.state.screen < 760 ? (
                <Skeleton style={{ margin: 10 }} count={1} height={100} width={200} />
              ) : (
                this._renderBranch()
              )}
              <p className='default-margin-left-right default-margin-top-bottom title-methode'>Pilihan Pengiriman</p>
              <div style={{ flexDirection: "column", display: "flex", flex: 1 }}>
                {this.state.loading === true && this.state.screen > 900 ? (
                  <Skeleton style={{ margin: 10 }} count={1} height={100} width={550} />
                ) : this.state.loading === true && this.state.screen >= 760 && this.state.screen < 900 ? (
                  <Skeleton style={{ margin: 10 }} count={1} height={100} width={500} />
                ) : this.state.loading === true && this.state.screen < 760 ? (
                  <Skeleton style={{ margin: 10 }} count={1} height={100} width={200} />
                ) : (
                  this._renderKurir()
                )}

                <p className='default-margin-left-right default-margin-top-bottom title-methode'>Pilihan Pembayaran</p>
                {this.props.loadingPaymentMethod === true && this.state.screen > 900 ? (
                  <Skeleton style={{ margin: 10 }} count={4} height={100} width={130} />
                ) : this.props.loadingPaymentMethod === true && this.state.screen >= 760 && this.state.screen < 900 ? (
                  <Skeleton style={{ margin: 10 }} count={4} height={100} width={130} />
                ) : this.props.loadingPaymentMethod === true && this.state.screen < 760 ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Skeleton style={{ margin: 10 }} count={1} height={100} width={200} />
                    <Skeleton style={{ margin: 10 }} count={1} height={100} width={200} />
                    <Skeleton style={{ margin: 10 }} count={1} height={100} width={200} />
                    <Skeleton style={{ margin: 10 }} count={1} height={100} width={200} />
                  </div>
                ) : this.state.listPaymentMethod != null ? (
                  <div className='default-flex-row-card'>
                    {this.state.listPaymentMethod.map((item) => {
                      return (
                        <Paper
                          className='card-payment'
                          style={this.state.sortingSelect === item.name ? { border: "solid #148F0F" } : null}
                          onClick={() => {
                            if (this.state.sortingSelect === item.name) {
                              this.setState({ sortingSelect: null });
                            } else {
                              this.setAnalyticClevertap("click", "Click_PaymentMethod", "View_DeliveryMethod_Screen", ["Click_PaymentMethod", { "Payment_Method": item.name }]);
                              this.setState({ sortingSelect: item.name, selectPayment: item });
                            }
                          }}
                        >
                          {this.state.sortingSelect === item.name ? (
                            <img src={IconCeklist} className='iconChecklist' />
                          ) : null}
                          <img className='iconCard' src={item.icon} />
                          <p className='title-select-payment'>{item.name}</p>
                        </Paper>
                      );
                    })}
                  </div>
                ) : null}

                {this.state.sortingSelect === "PKPS" ||
                  this.state.sortingSelect === "Credit Info No" ||
                  this.state.sortingSelect === "PQC" ||
                  this.state.sortingSelect === "CITIBANK" ||
                  this.state.sortingSelect === "SANF" ||
                  this.state.sortingSelect === "ONESHOOT" ||
                  this.state.sortingSelect === "BCA CBA" ||
                  this.state.sortingSelect === "BNF" ||
                  this.state.sortingSelect === "BCA" ||
                  this.state.sortingSelect === "BRI" ||
                  this.state.sortingSelect === "BFI" ||
                  this.state.sortingSelect === "BCA SC" ? (
                  <div>
                    <div
                      className='card-item-title'
                      style={{ marginTop: 20, flexDirection: "column", display: "flex" }}
                    >
                      {this._renderBank(this.state.selectPayment)}
                    </div>
                    {this._renderPKPS()}
                  </div>
                ) : (
                  <div className='card-item-title' style={{ marginTop: 20, flexDirection: "column", display: "flex" }}>
                    {this._renderBank(this.state.selectPayment)}
                  </div>
                )}
              </div>
            </div>
            {this.state.loading === true && this.state.screen > 900 ? (
              <Skeleton style={{ margin: 10 }} count={1} height={200} width={450} />
            ) : this.state.loading === true && this.state.screen >= 760 && this.state.screen < 900 ? (
              <Skeleton style={{ margin: 10 }} count={1} height={100} width={450} />
            ) : this.state.loading === true && this.state.screen < 760 ? (
              <Skeleton style={{ margin: 10 }} count={1} height={100} width={180} />
            ) : (
              this._renderPromotion()
            )}
          </div>
        </main>
      </>
    );
  }

  _clickMail = () => {
    if (this.state.messageSO != "") {
      let text = "mailto:utmobileapp@unitedtractors.com?subject=Question for UT Connect Team&body=";
      let mail = text.concat(this.state.messageSO);
      window.open(mail);
    } else {
      window.open("mailto:utmobileapp@unitedtractors.com?subject=Question for UT Connect Team");
    }
  };

  _renderModalDenied = () => {
    return (
      <Modal open={this.state.modalAr} onClose={() => this.state.modalAr} className='modal-container'>
        <DialogContent className='container-modal-denied'>
          <div className='container-denied'>
            <p className='title-denied'>Huhu sayang sekali...</p>
            <img src={IconDenied} alt='denied-icon' style={{ width: "30%", alignSelf: "center" }} />
            {this.state.message != "" ? (
              <p className='mt-2 title-message'>Maaf, {this.state.message}. Silahkan hubungi admin kami </p>
            ) : (
              <p className='mt-2 title-message'>
                Kami tidak dapat melanjutkan proses pembayaran, silahkan coba kembali{" "}
              </p>
            )}
            <div className='btn-confirm-denied' onClick={() => this.setState({ modalAr: false })}>
              <p className='title-confirm'>OK</p>
            </div>
            <p className='title-contact'>Butuh informasi tambahan? Kontak kami</p>
            <div className='container-footer-contact'>
              <img className='marginIcon' src={IconUTCall} alt='ut-call-icon' />
              <img src={IconMail} style={{ cursor: "pointer" }} alt='mail-icon' onClick={() => this._clickMail()} />
            </div>
          </div>
        </DialogContent>
      </Modal>
    );
  };
  _renderModalError = () => {
    return (
      <Modal open={this.state.errorCustomer} onClose={() => this.state.errorCustomer} className='modal-container'>
        <DialogContent className='container-modal-denied'>
          <div className='container-denied'>
            <p className='title-denied'>Huhu sayang sekali...</p>
            <img src={IconDenied} alt='denied-icon' style={{ width: "30%", alignSelf: "center" }} />
            <p className='mt-2 title-message'>Kami tidak dapat melanjutkan proses pembayaran, silahkan coba kembali </p>
            <div
              className='btn-confirm-denied'
              onClick={() => {
                this.setState({ errorCustomer: false });
                this.props.history.goBack();
              }}
            >
              <p className='title-confirm'>OK</p>
            </div>
            <p className='title-contact'>Butuh informasi tambahan? Kontak kami</p>
            <div className='container-footer-contact'>
              <img className='marginIcon' src={IconUTCall} alt='ut-call-icon' />
              <img
                src={IconMail}
                style={{ cursor: "pointer" }}
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

  _renderModalErrorPo = () => {
    return (
      <ModalAccessDenied
        isOpen={this.state.openModalErrorPo}
        isClose={() => this.setState({ openModalErrorPo: false })}
        errorText={"Mohon periksa kembali nomor PO kamu untuk melanjutkan proses"}
        title={"Huhu sayang sekali..."}
      />
    );
  };

  _openModalErrorPo = () => {
    this.setState({ openModalErrorPo: true });
  };

  _renderModalErrorFilePdf = () => {
    return (
      <ModalAccessDenied
        isOpen={this.state.openModalErrorFilePdf}
        isClose={() => this.setState({ openModalErrorFilePdf: false })}
        errorText={"Silahkan upload dokumen PO maksimum 3mb "}
        title={"Huhu sayang sekali.."}
      />
    );
  };

  _openModalErrorFilePdf = () => {
    this.setState({ openModalErrorFilePdf: true });
  };

  _renderModalErrorFilePdfFormat = () => {
    return (
      <ModalAccessDenied
        isOpen={this.state.openModalErrorFilePdfFormat}
        isClose={() => this.setState({ openModalErrorFilePdfFormat: false })}
        errorText={"Silahkan upload dokumen PO dengan tipe PDF"}
        title={"Huhu sayang sekali..."}
      />
    );
  };

  _openModalErrorFilePdfFormat = () => {
    this.setState({ openModalErrorFilePdfFormat: true });
  };

  _renderModalErrorFile = () => {
    return (
      <ModalAccessDenied
        isOpen={this.state.openModalErrorFile}
        isClose={() => this.setState({ openModalErrorFile: false })}
        errorText={"Silahkan masukkan dokumen PO untuk melanjutkan proses"}
        title={"Huhu sayang sekali..."}
      />
    );
  };

  _openModalErrorFile = () => {
    this.setState({ openModalErrorFile: true });
  };

  _handleApplyVoucher = () => {
    if (this.state.promoCode != "") {
      this.setState({ isUseVoucher: true });
    }
  };

  calculation = (price, expedisi, insurance) => {
    const fixExpedisi = expedisi === 'Bebas Biaya' ? 0 : expedisi
    const data = (Number(price) + (Number(fixExpedisi) + Number(this.state.isinsurance ? insurance : 0)))
    return data
  }

  _renderPromotion = () => {
    if (this.props?.succesCheckoutProduct != null) {
      return (
        <div className='cardPromotion'>
          <Col className='p-0'>
            <Col className='kontenCardPurchaseSummary'>
              <Row
                className='pl-0 orderDetailTitle'
                onClick={() => this.setState({ showDetail: !this.state.showDetail })}
              >
                <div className='teksSummary'>{!this.state.showDetail ? "Tampilkan" : "Sembunyikan"}</div>
                <img
                  className={!this.state.showDetail ? "orderDetailArrowShow" : "orderDetailArrowHide"}
                  src={Dropdown}
                  alt='orderDetailArrow'
                />
              </Row>
              {this.props?.succesCheckoutProduct.cartDetail.map((cartDetail, index) => {
                return (
                  <Row
                    key={index}
                    className='mt-4'
                    style={!this.state.showDetail ? { display: "none" } : { display: "flex" }}
                  >
                    <Col md={5}>
                      <div className='conImgDetail'>
                        <img
                          style={{ maxWidth: '90%', maxHeight: '90%', margin: 'auto' }}
                          src={cartDetail.imageThumbnailUrl ? cartDetail.imageThumbnailUrl : brakeImg}
                          alt='imgDetail'
                        />
                      </div>
                    </Col>
                    <Col md={7} className='pl-0'>
                      <p className='detailBrand mt-1'>{cartDetail.brandName}</p>
                      <p className='detailProductDesc mt-1'>
                        {cartDetail.partDescription.length > 30
                          ? cartDetail.partDescription.slice(0, 30) + "..."
                          : cartDetail.partDescription}
                      </p>
                      <p className='detailPriceAfter mb-1' style={{ color: '#000000', fontFamily: 'SFProText-Bold' }}>{cartDetail.itemQty} Produk</p>
                      {cartDetail.price !== cartDetail.basePrice
                        && cartDetail.basePrice !== 0
                        && cartDetail.percentDiscount !== 0
                        && cartDetail.percentDiscount !== null
                        && cartDetail.percentDiscount !== "-Infinity" ?
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <p className='detailProductBefore mt-1'>Rp {Utils.formatCurrency(cartDetail.basePrice)}</p>
                          <p className='detailPriceAfter mt-1' style={{ fontSize: 12, marginLeft: 5, color: 'rgb(20, 143, 15)' }}>{cartDetail.percentDiscount}</p>
                        </div> : null
                      }
                      <p className='detailPriceAfter' style={{ color: '#fa591d' }}>Rp {Utils.formatCurrency(cartDetail.price)}</p>
                    </Col>
                  </Row>
                );
              })}
              <hr style={{ borderTop: "1px solid #707070", opacity: "0.15", margin: "1.5rem 0", width: "100%" }}></hr>
              <Col lg='12' md='12' className='pl-0 teksSummary'>
                Ringkasan Pembayaran
              </Col>
              <Col className='p-0 '>
                <Row className='subTotalBL'>
                  <div className='teksSubTotalBL'>Sub Total</div>
                  <div className='hargaSubTotalBL'>Rp {Utils.formatCurrency(this.props?.purchaseSummary?.subTotalPrice)}</div>
                </Row>
                <Row className='subTotalBL'>
                  <div className='teksSubTotalBL'>Biaya Pengiriman</div>
                  <div className='hargaSubTotalBL'>Rp {Utils.formatCurrency(this.state.shipmentPrice === 'Bebas Biaya' ? 0 : this.state.shipmentPrice)}</div>
                </Row>
                {/* HIDE ASURANSI */}
                {/* <Row className='subTotalBL'>
                  <div className='teksSubTotalBL'>Asuransi Pengiriman</div>
                  <div className='hargaSubTotalBL'>Rp {this.state.isinsurance ? Utils.formatCurrency(Number(this.state.shipmentInsurancePrice)) : 0}</div>
                </Row> */}
                <Row className='subTotalBL'>
                  <div className='teksSubTotalBL'>PPN</div>
                  <div className='hargaSubTotalBL'>Rp {Utils.formatCurrency((this.props?.purchaseSummary?.subTotalPrice * this.state.tax).toFixed(0))}</div>
                </Row>
                <hr
                  style={{
                    borderTop: "1px dashed #707070",
                    opacity: "0.5",
                    marginTop: "1rem",
                    width: "100%",
                    marginBottom: "0",
                  }}
                ></hr>
                <Row className='subTotalBL'>
                  <div className='teksSubTotalBL'>Total Pembayaran</div>
                  <div className='hargaSubTotalBL1'>Rp {Utils.formatCurrency(this.calculation(this.props?.purchaseSummary?.totalPrice, this.state.shipmentPrice, this.state.shipmentInsurancePrice))}</div>
                </Row>
              </Col>
            </Col>
            <Col lg='12' className='bgCheckoutBL'>
              <div
                className='btnCheckoutBL'
                style={this.state.shipmentTitle != null && this.state.bankSelected && !this.props.dataCustomer?.arBlock && !this.props.dataCustomer?.creditBlock ?
                  {} : { cursor: 'default', backgroundColor: '#b9b9b9' }
                }
                onClick={this.state.shipmentTitle != null && this.state.bankSelected && !this.props.dataCustomer?.arBlock && !this.props.dataCustomer?.creditBlock ?
                  (this.state.loadingCheckout === true ? null : () => this._clickCheckout()) : null
                }
              >
                {this.state.loadingCheckout === true ? (
                  <CircularProgress />
                ) : (
                  <p className='titleCheckout'>Proses Pesanan</p>
                )}
              </div>
            </Col>
          </Col>
        </div>
      );
    }
    return this._renderSkeletonPromotion();
  };

  _currency = (number) => {
    const data = Number(number);
    return data.toFixed(0);
  };

  _checkStock = async () => {
    const { user, succesCheckoutProduct, stockList } = this.props;
    let partNumber = [];
    for (let i = 0; succesCheckoutProduct.cartDetail.length > i; i++) {
      partNumber.push(succesCheckoutProduct.cartDetail[i].partNumber);
    };

    const data = {
      customerCode: user.customerCode,
      plantCode: succesCheckoutProduct.branchCode,
      partNumber,
    };
    await this.props.fetchStock(user.tokenResponse.accessToken, data);
    if (stockList) {
      this._isReadyStock();
    }
  };

  _isReadyStock = () => {
    const { stockList, succesCheckoutProduct } = this.props;
    const { cartDetail } = succesCheckoutProduct;
    let listProduct = [];
    for (let j = 0; j < stockList.length; j++) {
      const data = {
        partDescription: cartDetail[j].partDescription,
        qty: cartDetail[j].itemQty,
        stock: this._currency(stockList[j].stock),
      };
      listProduct.push(data);
    }
    const statusReadyStock = listProduct.filter(item => item.qty <= item.stock)
    if (statusReadyStock.length != 0) {
      this.setState({ isReadyStock: true });
    } else {
      this.setState({ isReadyStock: false });
    }
  };

  clevertapEventCharge = () => {
    const dataProduct = this.props.succesCheckoutProduct?.cartDetail;
    var arr = [];
    if (dataProduct && dataProduct !== []) {
      for (let i = 0; i < dataProduct.length; i++) {
        const newArr = {
          "Brand": dataProduct[i].brandName,
          "ProductName": dataProduct[i].partDescription,
          "PartNumber": dataProduct[i].partNumber,
          "Quantity": dataProduct[i].itemQty,
          "Price": dataProduct[i].price && dataProduct[i].price !== 0 ? dataProduct[i].price : dataProduct[i].basePrice
        };
        arr.push(newArr);
      };
    };
    const chargeData = {
      "TotalPayment": this.calculation(this.props?.purchaseSummary?.totalPrice, this.state.shipmentPrice, this.state.shipmentInsurancePrice),
      "PaymentMethod": this.state.bankSelectedName,
      "Shipment": this.state.shipmentTitle,
      "ChargedID": this.props.user.userId,
      "Items": arr
    };
    window.clevertapEventCharge(chargeData);
  };

  _clickCheckout = async () => {
    const { user } = this.props;
    if (user.customerCode !== "ONETIMESTD") {
      if (this.state.purchaseOrder.length > 0 && !this.state.specialChar) {
        if (this.state.pdfFileName && this.state.filePdf) {
          this.setState({ loadingCheckout: true });
          const {
            tokenResponse: { accessToken },
          } = this.props.user;

          const bodyPut = {
            poCustomer: this.state.purchaseOrder,
            filename: this.state.pdfFileName,
            path: this.state.filePdf,
            carts: [],
          };
          if (this.state.dataAddress !== null) {
            bodyPut.billingId = this.state.dataAddress.billingId
          }
          for (let i = 0; this.props.succesCheckoutProduct.cartDetail.length > i; i++) {
            const array = {
              productId: this.props.succesCheckoutProduct.cartDetail[i].productId,
              itemQty: this.props.succesCheckoutProduct.cartDetail[i].itemQty,
              price: this.props.succesCheckoutProduct.cartDetail[i].price,
            };
            bodyPut.carts.push(array);
          }
          await this.props.fetchPutCartListByCartId(this.props.succesCheckoutProduct.cartId, bodyPut, accessToken);
          const { dataPut, errPut } = this.props;
          const { user } = this.props;
          if (dataPut) {
            if (this.props.dataCustomer) {
              if (this.props.dataCustomer?.arBlock || this.props.dataCustomer?.creditBlock) {
                this.setState({ modalAr: true, loadingCheckout: false });
              } else {
                const { userName } = this.props.user;
                const body = {
                  CartId: this.props.succesCheckoutProduct.cartId,
                  shipmentId: this.state.shipmentId,
                  paymentId: this.state.bankSelected,
                }
                if (this.state.dataAddress !== null) {
                  body.shipmentDetail = {
                    contact: this.state.dataAddress.contactNumber,
                    city: this.state.dataAddress.city,
                    district: this.state.dataAddress.districts,
                    subdistrict: this.state.dataAddress.village,
                    village: this.state.dataAddress.village,
                    province: this.state.dataAddress.province,
                    postalcode: this.state.dataAddress.postalCode,
                    detailAddress: this.state.dataAddress.address,
                    fullName: this.state.dataAddress.fullName,
                    isinsurance: false,
                  }
                } else {
                  body.shipmentDetail = {
                    fullName: `${user.firstName} ${user.lastName}`,
                  }
                }
                await this.props.fetchCompleteOrder(user.tokenResponse.accessToken, body);
                const { succesCreateSo, errorCreateSo } = this.props;
                if (errorCreateSo && errorCreateSo != null) {
                  this.setAnalyticClevertap("action", "Action_CreateSO_Error", "View_DeliveryMethod_Screen", ["Action_CreateSO_Error", { "Cart_Id": this.props.succesCheckoutProduct.cartId }]);
                  this.setState({
                    loadingCheckout: false,
                    modalAr: true,
                    messageSO: errorCreateSo?.response?.data?.status?.desc,
                  });
                } else {
                  this.setAnalyticClevertap("action", "Action_CreateSO_Success", "View_DeliveryMethod_Screen", ["Action_CreateSO_Success", { "Cart_Id": this.props.succesCheckoutProduct.cartId }]);
                  this.clevertapEventCharge();
                  this.setState({ loadingCheckout: false });
                  localStorage.removeItem("FILE_PATH_ACTIVE");
                  localStorage.removeItem("FILE_NAME_ACTIVE");
                  localStorage.removeItem("BRANCH_ACTIVE");
                  localStorage.removeItem("PO_ACTIVE");
                  this.setState({ modalSuccessOrder: true });
                }
              }
            } else if (errPut) {

            }
          }
        } else {
          this._openModalErrorFile();
        }
      } else {
        this._openModalErrorPo();
      }
    } else {
      if (this.state.isReadyStock == true) {
        this.setState({ loadingCheckout: true });
        const body = {
          CartId: this.props.succesCheckoutProduct.cartId,
          shipmentId: this.state.shipmentId,
          paymentId: this.state.bankSelected,
          shipmentDetail: {
            contact: this.state.dataAddress.contactNumber,
            city: this.state.dataAddress.city,
            district: this.state.dataAddress.districts,
            subdistrict: this.state.dataAddress.village,
            village: this.state.dataAddress.village,
            province: this.state.dataAddress.province,
            postalcode: this.state.dataAddress.postalCode,
            detailAddress: this.state.dataAddress.address,
            fullName: this.state.dataAddress.fullName,
            isinsurance: false,
          },
        };
        await this.props.fetchCompleteOrder(user.tokenResponse.accessToken, body);
        const { succesCreateSo, errorCreateSo } = this.props;
        if (errorCreateSo && errorCreateSo != null) {
          this.setAnalyticClevertap("action", "Action_CreateSO_Error", "View_DeliveryMethod_Screen", ["Action_CreateSO_Error", { "Cart_Id": this.props.succesCheckoutProduct.cartId }]);
          this.setState({
            loadingCheckout: false,
            modalAr: true,
            messageSO: errorCreateSo.response.data.status.desc,
          });
        } else {
          this.setAnalyticClevertap("action", "Action_CreateSO_Success", "View_DeliveryMethod_Screen", ["Action_CreateSO_Success", { "Cart_Id": this.props.succesCheckoutProduct.cartId }]);
          this.clevertapEventCharge();
          this.setState({ loadingCheckout: false });
          this.setState({ modalSuccessOrder: true });
        }
      } else {
        this.setState({ openModalNotReadyStock: true })
      }
    }
  };
  _renderSkeletonPromotion = () => {
    return (
      <div className='cardPromotion'>
        <Col className='p-0'>
          <Col className='kontenCardPurchaseSummary'>
            <Col lg='12' md='12' className='pl-0 skTitleBL'>
              <Skeleton height={20} />
            </Col>
            <Col className='p-0 '>
              <Row className='subTotal'>
                <Skeleton width={100} height={15} />
                <Skeleton width={100} height={15} />
              </Row>
              <Row className='subTotal'>
                <Skeleton width={100} height={15} />
                <Skeleton width={100} height={15} />
              </Row>
              <hr
                style={{
                  borderTop: "1px dashed #707070",
                  opacity: "0.5",
                  marginTop: "1rem",
                  width: "100%",
                  marginBottom: "1rem",
                }}
              ></hr>
              <Row className='subTotal'>
                <Skeleton width={100} height={15} />
                <Skeleton width={100} height={15} />
              </Row>
            </Col>
          </Col>
          <Col lg='12' className='bgCheckoutBL'>
            <div className='btnCheckoutBL'>
              <Skeleton width={150} height={15} />
            </div>
          </Col>
        </Col>
      </div>
    );
  };

  _renderDelivery() {
    if (this.props.dataCustomer) {
      return (
        <div className='card-item-title'>
          <p className='title-id'>{this.props.dataCustomer?.customerName}</p>
          <p className='title-name'>{this.props.dataCustomer?.address}</p>
        </div>
      );
    }
  }

  _renderDeliveryMethode() {
    if (this.state.dataAddress) {
      return (
        <div className='card-item-title'>
          <p className='labelDA'>{this.state.dataAddress.addressLabel}</p>
          <p className='nameDA'>
            {this.capitalizeEachWord(this.state.dataAddress.fullName)} ({this.state.dataAddress.contactNumber})
          </p>
          <p className='detailDA'>
            {this.capitalizeEachWord(this.state.dataAddress.city)}, {" "}
            {this.capitalizeEachWord(this.state.dataAddress.districts)}, {" "}
            {this.capitalizeEachWord(this.state.dataAddress.village)}, {" "}
            {this.capitalizeEachWord(this.state.dataAddress.province)},
          </p>
          <p className='detailDA'>{this.capitalizeEachWord(this.state.dataAddress.address)}</p>
        </div>
      );
    }
  }

  _renderDeliveryMethodeCustomerUT() {
    const { dataCustomer } = this.props;
    if (dataCustomer) {
      return (
        <div className='card-item-title'>
          <p className='labelDA'>{dataCustomer?.customerName}</p>
          <p className='detailDA'>{this.capitalizeEachWord(dataCustomer?.address)}</p>
        </div>
      );
    }
  }


  _renderBank(payment) {
    return payment?.paymentChannels.map((data, index) => {
      return (
        <div
          key={data.paymentId}
          style={{ flexDirection: "row", display: "flex", alignItems: "center" }}
          onClick={() => {
            this.setState({ bankSelected: data.paymentId, bankSelectedName: data.name });
            this.setAnalyticClevertap("click", "Click_PaymentChannel", "View_DeliveryMethod_Screen", ["Click_PaymentChannel", { "Payment_Channel": data.name }]);
          }}
        >
          {this.state.bankSelected == data.paymentId ? this._renderRadio() : this._renderRadioUnselect()}
          <div
            className='card-bank'
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <p className='title-bank'>{data.name}</p>
            <img src={data.icon} className='margin-image-bank iconBank' />
          </div>
        </div>
      );
    });
  }

  _renderBranch() {
    if (this.props.succesCheckoutProduct != null) {
      return (
        <div
          className='card-item-title'
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 0 }}>
            <img src={IconWarehouse} width='50' height='50' />
          </div>
          <div style={{ flex: 1 }}>
            <p className='title-id' style={{ textAlign: "left", marginLeft: 20 }}>
              {this.props.succesCheckoutProduct.branchDescription.toUpperCase().replace("UT BRANCH ", "")}
            </p>
            <p className='title-name' style={{ textAlign: "left", marginLeft: 20 }}>
              {this.props.succesCheckoutProduct.branchAddress}
            </p>
          </div>
        </div>
      );
    }
  }

  _renderKurir() {
    if (this.state.shipmentTitle != null) {
      return (
        <div>
          <div style={{ flexDirection: "row", display: "flex" }}>
            <div style={{ flex: 1 }}>
              <p className='title-kurir'>{this.state.shipmentTitle}</p>
              <p className='title-item-kurir'>{this.state.shipmentName}</p>
              <p className='title-name' style={{ marginLeft: 2 }}>
                {this.state.shipmentTitle !== "Ambil Sendiri"
                  ? `(Estimasi ${this.state.shipmentDate} hari)`
                  : `(Estimasi ${this.state.shipmentDate})`
                }
              </p>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                flexDirection: "column",
                marginRight: 40,
              }}
            >
              {this.props.user.customerCode == "ONETIMESTD" ?
                <div className='button-change' onClick={() => this.setState({ modalShippment: true })}>
                  <p className='title-change'>Ubah</p>
                </div>
                : null
              }
              <p className='title-price'>
                {" "}
                {this.state.shipmentPrice === "Bebas Biaya"
                  ? this.state.shipmentPrice
                  : `Rp. ${Utils.formatCurrency(this.state.shipmentPrice)}`}
              </p>
            </div>
          </div>
          {/* HIDE ASURANSI */}
          {/* {this.state.isinsurance ? (
            <div
              className='container-shippment-row'
              style={{
                backgroundColor: "#F1F1F1",
                height: 40,
                alignItems: "center",
                paddingLeft: 10,
                marginBottom: 10,
                marginRight: 40,
              }}
            >
              <div style={{ display: "flex", flex: 1 }}>
                <p className='title-name-expedisi'>Asuransi Pengiriman</p>
              </div>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "row",
                  height: 40,
                  alignItems: "center",
                  marginRight: 20,
                }}
              >
                <p className='title-price-expedisi' style={{ marginBottom: 0 }}>
                  Rp. {Utils.formatCurrency(this.state.shipmentInsurancePrice)}
                </p>
              </div>
            </div>
          ) : null} */}
        </div>
      );
    } else {
      return (
        <div
          className='cardBranch'
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 0 }}>
            <img src={IconShipment} width='50' height='50' />
          </div>
          <div style={{ flex: 1 }}>
            <p className='title-id' style={{ textAlign: "left", marginLeft: 20 }}>
              Pilihan Pengiriman
            </p>
          </div>
          <div
            style={{ cursor: "pointer" }}
            className='btnSelectBranch'
            onClick={() => {
              this.setState({ modalShippment: true });
              this.setAnalyticClevertap("click", "Click_OpenModalShipment", "View_DeliveryMethod_Screen", null);
            }}
          >
            <p className='titleCheckout'>Pilih Pengiriman</p>
          </div>
        </div>
      );
    }
  }
  _renderRadio() {
    return (
      <div className='radio-border'>
        <div className='radio-button' />
      </div>
    );
  }
  _renderRadioUnselect() {
    return <div className='radio-border-disable'></div>;
  }
}
DeliverMethodPage.propTypes = {
  errorDesc: PropTypes.string,
  isLoading: PropTypes.bool,
  login: PropTypes.func,
  tokenResponse: PropTypes.object,
};
DeliverMethodPage.defaultProps = {
  errorDesc: null,
  isLoading: false,
  login: null,
  tokenResponse: null,
};
export default DeliverMethodPage;
