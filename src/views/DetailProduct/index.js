import DetailProductPage from './DetailProductPage';
import { connect } from 'react-redux';
import {
    BRAND_REQ,
    CATEGORY_REQ,
    FORGOT_PASSWORD,
    IMAGE_SLIDER_REQ,
    SIGNUP,
    VERIFY_CODE
} from "actions/actionTypes";
import { LOGIN_TYPE } from 'actions/actionTypes';
import { forgotPassword, login, signup, verifyCode, changePassword, loginGoogle } from 'actions/user';
import { push } from 'connected-react-router';
import {
    createLoadingSelector,
} from 'utils/selector.helper'
import { detailProductGet, detailProductRelatedGet, reviewDetailProduct } from 'actions/detailProduct';
import { clearError, clearStore } from 'actions/category';
import {
    blockLogin,
    countDownTimerLock,
    countFailedLogin,
    releaseBlockedLogin,
    initialBlockedLoginStatus
} from 'actions/blockedLogin';
import { addWishlist, deleteWishlist } from 'actions/wishlist';
import { postCartData } from 'actions/listNews';
import { searchByUserId } from 'actions/cart';
import { termConditionGet, updateTermCondition } from 'actions/termCondition';

//Set selector loading 
const loadingSelector = createLoadingSelector([LOGIN_TYPE, SIGNUP, FORGOT_PASSWORD, VERIFY_CODE]);
const mapStateToProps = state => ({
    ...state.user,
    isLoading: loadingSelector(state),
    detailProduct: state.detailProduct.detailProduct.data,
    reviewProductData: state.detailProduct.detailProduct.dataReview,
    loadingCart: state.listNews.listNews.loadingCart,
    errorCartData: state.listNews.listNews.errorCartData,
    cartData: state.listNews.listNews.cartData,
    
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

const mapDispatchToProps = dispatch => ({
    push: (url, item) => dispatch(push(url, item)),
    fetchDetailProduct: (id) => dispatch(detailProductGet(id)),
    fetchCartPost: (token, body) => dispatch(postCartData(token, body)),
    fetchCartByUserId: (userId, token) => dispatch(searchByUserId(userId, token)),
    fetchReviewProduct: (productId) => dispatch(reviewDetailProduct(productId)),
    fetchAddWishlist: (token, data) => dispatch(addWishlist(token, data)),
    fetchDeleteSigleWishlist: (token, data) => dispatch(deleteWishlist(token, data)),
    fetchTermCondition: (token) => dispatch(termConditionGet(token)),
    fetchUpdateTermCondition: (token, version) => dispatch(updateTermCondition(token, version)),

    login: (data) => dispatch(login(data)),
    signup: (data) => dispatch(signup(data)),
    clearError: () => dispatch(clearError()),
    clearStore: () => dispatch(clearStore()),
    forgotPassword: ({ email, applicationId }) => dispatch(forgotPassword({ email, applicationId })),
    verifyCode: (data) => dispatch(verifyCode(data)),
    changePassword: (data) => dispatch(changePassword(data)),
    loginGoogle: (data) => dispatch(loginGoogle(data)),

    blockLogin: () => dispatch(blockLogin()),
    countDownTimerLock: (timer) => dispatch(countDownTimerLock(timer)),
    countFailedLogin: (failed_login) => dispatch(countFailedLogin(failed_login)),
    releaseBlockedLogin: () => dispatch(releaseBlockedLogin()),
    initialBlockedLoginStatus: () => dispatch(initialBlockedLoginStatus())
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailProductPage);