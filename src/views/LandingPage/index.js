import Landing from "./Landing";
import { connect } from "react-redux";
import {
  BRAND_REQ,
  CATEGORY_REQ,
  FORGOT_PASSWORD,
  IMAGE_SLIDER_REQ,
  LOGIN_TYPE,
  SIGNUP,
  VERIFY_CODE
} from "actions/actionTypes";
import { listBrand } from "actions/brand";
import { push } from "connected-react-router";
import { createLoadingSelector } from "utils/selector.helper";
import { clearStore, listCategory } from "actions/category";
import {
  listNewsHome,
  listNewsAdditional,
  getTemplate,
  uploadCsvTemplate,
  uploadAttachment,
  getBranchList,
  getSearchSuggestionList,
  getCheckStock,
  resetStock,
  getCheckPrice,
  postCartData,
} from "actions/listNews";
import { imageSlider } from "actions/promotions";
import { listProduct } from "actions/listProduct";
import { searchByUserId } from 'actions/cart';
import { forgotPassword, login, signup, verifyCode, changePassword, loginGoogle } from 'actions/user';
import { clearError } from 'actions/category';
import {
  blockLogin,
  countDownTimerLock,
  countFailedLogin,
  releaseBlockedLogin,
  initialBlockedLoginStatus
} from 'actions/blockedLogin';
import { termConditionGet, updateTermCondition } from "actions/termCondition";

//Set selector loading
const loadingSelector = createLoadingSelector([BRAND_REQ, CATEGORY_REQ, LOGIN_TYPE, SIGNUP, FORGOT_PASSWORD, VERIFY_CODE]);
const mapStateToProps = (state) => ({
  ...state.user,
  isLoading: loadingSelector(state),
  brandData: state.listBrand.listBrand.data,
  loadingBrand: state.listBrand.listBrand.loading,
  newsHome: state.listNews.listNews.newsHome,
  loadingNews: state.listNews.listNews.loadingNews,
  newsAdditional: state.listNews.listNews.newsAdditional,
  loadingAdditional: state.listNews.listNews.loadingAdditional,
  imageSlider: state.promotions.promotion.image,
  loadingPromo: state.promotions.promotion.loading,
  listProductData: state.listProduct.listProduct.data,
  loadingProduct: state.listProduct.listProduct.loading,
  downloadFile: state.listNews.listNews.downloadFile,
  uploadCsv: state.listNews.listNews.uploadCsv,
  branchList: state.listNews.listNews.branchList,
  suggestionList: state.listNews.listNews.suggestionList,
  stockList: state.listNews.listNews.stockList,
  priceList: state.listNews.listNews.priceList,
  uploadPdf: state.listNews.listNews.uploadPdf,
  cartData: state.listNews.listNews.cartData,
  dataCustomer: state.category.customerCode,
  errorCartData: state.listNews.listNews.errorCartData,
  dataCart: state.cart.searchByUserId.dataCart,

  register: state.user.register,
  errorRegister: state.user.errorRegister,
  errorStatus: state.category.errorStatus,
  error: state.error,
  errorForgot: state.error.errorForgot,
  errorVerify: state.error.errorVerify,
  verify: state.user.verify,
  dataTermCondition: state.termCondition.termCondition.data,

  failed_count: state.blockedLogin.blockedLogin.failed_count,
  lock_login: state.blockedLogin.blockedLogin.lock_login,
  timer_lock: state.blockedLogin.blockedLogin.timer_lock
});

const mapDispatchToProps = (dispatch) => ({
  push: (url, item) => dispatch(push(url, item)),
  loginGoogle: (data) => dispatch(loginGoogle(data)),
  fetchListBrand: () => dispatch(listBrand()),
  fetchListCategory: () => dispatch(listCategory()),
  fetchListNews: (attributValue, PageSize, PageNumber) => dispatch(listNewsHome(attributValue, PageSize, PageNumber)),
  fetchListNewsAdditional: (attributValue, PageSize, PageNumber) =>
    dispatch(listNewsAdditional(attributValue, PageSize, PageNumber)),
  fetchImageslider: () => dispatch(imageSlider()),
  fetchListProduct: (token, page, pageSize) => dispatch(listProduct(token, page, pageSize)),
  fetchDownloadTemplate: (token) => dispatch(getTemplate(token)),
  fetchUploadCsv: (token, formData) => dispatch(uploadCsvTemplate(token, formData)),
  fetchUploadAttachment: (token, file) => dispatch(uploadAttachment(token, file)),
  fetchGetBranchList: (token, IsGetAll, Description) => dispatch(getBranchList(token, IsGetAll, Description)),
  fetchSearch: (token, keyword, idKeyword) => dispatch(getSearchSuggestionList(token, keyword, idKeyword)),
  fetchStock: (token, body) => dispatch(getCheckStock(token, body,)),
  fetchResetStock: () => dispatch(resetStock()),
  fetchCheckPrice: (token, body) => dispatch(getCheckPrice(token, body)),
  fetchCartPost: (token, body) => dispatch(postCartData(token, body)),
  fetchCartByUserId: (userId, token) => dispatch(searchByUserId(userId, token)),
  fetchTermCondition: (token) => dispatch(termConditionGet(token)),
  fetchUpdateTermCondition: (token, version) => dispatch(updateTermCondition(token, version)),

  login: (data) => dispatch(login(data)),
  signup: (data) => dispatch(signup(data)),
  clearError: () => dispatch(clearError()),
  clearStore: () => dispatch(clearStore()),
  forgotPassword: ({ email, applicationId }) => dispatch(forgotPassword({ email, applicationId })),
  verifyCode: (data) => dispatch(verifyCode(data)),
  changePassword: (data) => dispatch(changePassword(data)),

  blockLogin: () => dispatch(blockLogin()),
  countDownTimerLock: (timer) => dispatch(countDownTimerLock(timer)),
  countFailedLogin: (failed_login) => dispatch(countFailedLogin(failed_login)),
  releaseBlockedLogin: () => dispatch(releaseBlockedLogin()),
  initialBlockedLoginStatus: () => dispatch(initialBlockedLoginStatus())
});

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
