import BucketListPage from "./BucketListPage";
import { connect } from "react-redux";
import { LOGIN_TYPE } from "actions/actionTypes";
import { login } from "actions/user";
import { push } from "connected-react-router";
import { createLoadingSelector } from "utils/selector.helper";
import {
  listCart,
  searchByUserId,
  getListCartByCartId,
  putListCartByCartId,
  getPurchaseSummary,
  deleteAllCart,
  deleteCartDetail,
  getPurchaseCheckout,
  getCheckoutProduct,
  getAttributeName
} from "actions/cart";
import { getBranchList, getCheckStock } from "actions/listNews";

//Set selector loading
const loadingSelector = createLoadingSelector([LOGIN_TYPE]);
const mapStateToProps = (state) => ({
  ...state.user,
  isLoading: loadingSelector(state),
  cartList: state.cart.cart.data,
  cartListError: state.cart.cart.err,
  dataCart: state.cart.searchByUserId.dataCart,
  dataCartList: state.cart.listCart.dataCartList,
  purchaseSummary: state.cart.purchaseSummary.data,
  stockList: state.listNews.listNews.stockList,
  dataPut: state.cart.listCart.dataPutCartList,
  branchList: state.listNews.listNews.branchList,
  loading: state.cart.listCart.loading,
  attributeName: state.cart.attributeName.attributeName,
});

const mapDispatchToProps = (dispatch) => ({
  login: (data) => dispatch(login(data)),
  push: (url, item) => dispatch(push(url, item)),
  fetchCartList: (token) => dispatch(listCart(token)),
  fetchCartByUserId: (userId, token) => dispatch(searchByUserId(userId, token)),
  fetchCartListByCartId: (cartId, token) => dispatch(getListCartByCartId(cartId, token)),
  fetchPutCartListByCartId: (cartId, data, token) => dispatch(putListCartByCartId(cartId, data, token)),
  fetchPurchaseSummary: (cartId, token) => dispatch(getPurchaseSummary(cartId, token)),
  fetchStock: (token, body) => dispatch(getCheckStock(token, body)),
  deleteCart: (cartId, body, token) => dispatch(deleteAllCart(cartId, body, token)),
  deleteCartDetail: (cartDetailId, token) => dispatch(deleteCartDetail(cartDetailId, token)),
  fetchGetBranchList: (token) => dispatch(getBranchList(token)),
  fetchAttributeName: (name) => dispatch(getAttributeName(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BucketListPage);
