import React, { Component } from 'react'
import {
  Row,
  Col,
  Button,
} from 'reactstrap';
import {
  DropIcon
} from "assets/icons";
import "./style/index.scss";
import { IconTimer } from 'assets/icons';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { formatCurrency, formatVaNumber } from "utils/format.helper";
import moment from "moment";
import firebase from "../../firebase/firebase";
import { MENU } from 'constants/menu';


class TransferPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeStatus: 3,
      dataPayment: this.props?.history?.location?.state ? this.props?.history?.location?.state : null,
      isCopied: false,
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
    }
  };

  async componentDidMount() {
    this.setAnalyticClevertap("view", "View_PaymentDetail_Screen", "View_PaymentDetail_Screen", null);
    window.scrollTo(0, 0);
  };

  handleCopyVaNumber = () => {
    navigator.clipboard.writeText(this.state.dataPayment?.paymentNumber);
    this.setState({ isCopied: true });
    this.setAnalyticClevertap("click", "Click_CopyVaNumber", "View_PaymentDetail_Screen", null);
  };

  _renderBreadcrumb = () => {
    const breadcrums = [
      {
        'url': MENU.HOME,
        'name': 'Part Online Transaction'
      }
    ];
    return (
      <Breadcrumb
        linkBreadcrumb={breadcrums}
        typography={"Detail Pembayaran"}
      />
    )
  };

  render() {
    return (
      <Col className='paddingTP'>
        <Col className='breadCrumbTP'>
          {this._renderBreadcrumb()}
        </Col>
        <h3 className="styleTPBold">Pembayaran</h3>
        <Row className="rowTotalPayment">
          <p className="styleTPregular">Total Pembayaran</p>
          <p className="fontPriceTP">RP {formatCurrency(this.state.dataPayment?.grandTotal)}</p>
        </Row>
        <hr className="mt-0"></hr>
        <Col lg="12" md="12" style={{ padding: '0' }}>
          <p className="styleTPregular">{this.state.dataPayment?.paymentMethod}</p>
          <p className="styleTPregular1">Virtual Account Number</p>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <p className="fontRekTP">{formatVaNumber(this.state.dataPayment?.paymentNumber)}</p>
            <p
              className="copyTeks"
              onClick={() => this.handleCopyVaNumber()}
            >{this.state.isCopied ? "Berhasil disalin." : "Salin"}</p>
          </div>
          <p className="styleTPCek">Akan dicek dalam 30 menit setelah pembayaran berhasil</p>
          <p className='styleTPKet'>
            Periksa informasi yang tertera di layar. Pastikan total tagihan dan username sudah benar.
          </p>
          <Row className="rowTimer">
            <img className='iconTimer' src={IconTimer}></img>
            <p className='styleTimer'>Bayar Sebelum {moment(this.state.dataPayment?.paymentExpired + "Z").format("DD MMMM YYYY, HH:mm")} WIB</p>
          </Row>
          <Row className="rowBtnTP">
            <Button style={{ backgroundColor: "#FFD500", border: "none", color: '#000000', float: 'right' }} className="btnOkTP"
              onClick={() => {
                this.setAnalyticClevertap("click", "Click_OK", "View_PaymentDetail_Screen", null);
                this.props.push(MENU.LIST_ORDER, this.state.changeStatus)
              }}
            >OK</Button>
          </Row>
        </Col>
      </Col>
    )
  }
}

export default TransferPage;