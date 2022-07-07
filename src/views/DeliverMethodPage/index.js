import DeliverMethodPage from "./DeliverMethodPage";
import { connect } from "react-redux";
import { LOGIN_TYPE } from "actions/actionTypes";
import { login } from "actions/user";
import { push } from "connected-react-router";
import { createLoadingSelector } from "utils/selector.helper";
import { cartDetail, completeOrder, changeStatus, putListCartByCartId, getPurchaseSummary, getCheckoutProduct, getAttributeName } from "actions/cart";
import { postTransactionProcess } from "actions/transaction";
import { checkCustomer } from "actions/category";
import { getListPaymentMethod, getListShipmentMethod } from "actions/payment";
import { listBillingAddressGet } from "actions/billingAddress";
import { getCheckStock, uploadAttachment } from "actions/listNews";
import { voucherClaimedList } from "actions/voucher";

//Set selector loading
const loadingSelector = createLoadingSelector([LOGIN_TYPE]);
const mapStateToProps = (state) => ({
  ...state.user,
  isLoading: loadingSelector(state),
  cartDetail: state.cart.cart.cartDetail,
  dataCustomer: state.category.customerCode,
  errorCustomer: state.category.errorCustomer,
  succesCreateSo: state.cart.cart.succesCreateSo,
  succesStatus: state.cart.cart.succesStatus,
  transactionSuccess: state.transaction.transaction.transactionSuccess,
  upploadAttach: state.cart.cart.upploadAttach,
  errorCreateSo: state.cart.cart.errorCreateSo,
  errorCartDetail: state.cart.cart.errorCartDetail,
  billingAddressList: state.billingAddress.billingAddress.data,
  dataPut: state.cart.listCart.dataPutCartList,
  errPut: state.cart.listCart.errPutCartList,
  voucherClaimedList: state.voucher.voucher.dataClaimed,
  paymentMethodList: state.listPayments.listPayment.dataPaymentMethod,
  loadingPaymentMethod: state.listPayments.listPayment.loading,
  loadingShipment: state.listPayments.listPayment.loadingShipment,
  dataShipment: state.listPayments.listPayment.dataShipment,
  errorShipment: state.listPayments.listPayment.errorShipment,
  purchaseSummary: state.cart.purchaseSummary.data,
  errorCheckoutProduct: state.cart.cart.succesCheckoutProduct,
  succesCheckoutProduct: state.cart.cart.succesCheckoutProduct,
  stockList: state.listNews.listNews.stockList,
  attributeName: state.cart.attributeName.attributeName,
});

const mapDispatchToProps = (dispatch) => ({
  login: (data) => dispatch(login(data)),
  push: (url, params) => dispatch(push(url, params)),
  fetchCartDetail: (token, id) => dispatch(cartDetail(token, id)),
  checkCustomer: (token) => dispatch(checkCustomer(token)),
  fetchCompleteOrder: (token, body) => dispatch(completeOrder(token, body)),
  fetchChangeStatus: (token, id, status) => dispatch(changeStatus(token, id, status)),
  fetchTransaction: (token, body) => dispatch(postTransactionProcess(token, body)),
  fetchGetBillingList: (userId, token) => dispatch(listBillingAddressGet(userId, token)),
  fetchUploadAttachment: (token, file) => dispatch(uploadAttachment(token, file)),
  fetchPutCartListByCartId: (cartId, data, token) => dispatch(putListCartByCartId(cartId, data, token)),
  fetchVoucherClaimedList: (token, code) => dispatch(voucherClaimedList(token, code)),
  fetchPaymentMethodList: (token) => dispatch(getListPaymentMethod(token)),
  fetchShipmentList: (token, body) => dispatch(getListShipmentMethod(token, body)),
  fetchPurchaseSummary: (cartId, token) => dispatch(getPurchaseSummary(cartId, token)),
  fetchCheckoutProduct: (cartId, token) => dispatch(getCheckoutProduct(cartId, token)),
  fetchStock: (token, body) => dispatch(getCheckStock(token, body)),
  fetchAttributeName: (name) => dispatch(getAttributeName(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeliverMethodPage);
