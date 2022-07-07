import PromotionPage from './PromotionPage';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { promotionList, promotionListHeader } from 'actions/promotions';
import { voucherList } from 'actions/voucher';
import {
    createLoadingSelector,
} from 'utils/selector.helper'
import {
    BRAND_REQ,
    CATEGORY_REQ,
    FORGOT_PASSWORD,
    IMAGE_SLIDER_REQ,
    SIGNUP,
    VERIFY_CODE,
    LOGIN_TYPE
} from "actions/actionTypes";
import { forgotPassword, login, signup, verifyCode, changePassword } from 'actions/user';
import { clearError } from 'actions/category';
import {
    blockLogin,
    countDownTimerLock,
    countFailedLogin,
    releaseBlockedLogin,
    initialBlockedLoginStatus
} from 'actions/blockedLogin';

//Set selector loading 
const loadingSelector = createLoadingSelector([LOGIN_TYPE, SIGNUP, FORGOT_PASSWORD, VERIFY_CODE]);
const mapStateToProps = state => ({
    ...state.user,
    path: state.router.location.pathname,
    promotionListHeader: state.promotions.promotion.promotionListHeader,
    dataPromotion: state.promotions.promotion.data,
    loading: state.promotions.promotion.loading,
    voucherData: state.voucher.voucher.data,
    voucherLoading: state.voucher.voucher.loading,

    register: state.user.register,
    errorRegister: state.user.errorRegister,
    errorStatus: state.category.errorStatus,
    error: state.error,
    errorForgot: state.error.errorForgot,
    errorVerify: state.error.errorVerify,
    verify: state.user.verify,

    failed_count: state.blockedLogin.blockedLogin.failed_count,
    lock_login: state.blockedLogin.blockedLogin.lock_login,
    timer_lock: state.blockedLogin.blockedLogin.timer_lock
});

const mapDispatchToProps = dispatch => ({
    push: (path, item) => dispatch(push(path, item)),
    fetchPromotionList: (BusinessTypeId, GroupId, Page, Sorting, PageSize) => dispatch(promotionList(BusinessTypeId, GroupId, Page, Sorting, PageSize)),
    fetchPromotionHeader: (token) => dispatch(promotionListHeader(token)),
    fetchVoucherList: (token) => dispatch(voucherList(token)),

    login: (data) => dispatch(login(data)),
    signup: (data) => dispatch(signup(data)),
    clearError: () => dispatch(clearError()),
    forgotPassword: ({ email, applicationId }) => dispatch(forgotPassword({ email, applicationId })),
    verifyCode: (data) => dispatch(verifyCode(data)),
    changePassword: (data) => dispatch(changePassword(data)),

    blockLogin: () => dispatch(blockLogin()),
    countDownTimerLock: (timer) => dispatch(countDownTimerLock(timer)),
    countFailedLogin: (failed_login) => dispatch(countFailedLogin(failed_login)),
    releaseBlockedLogin: () => dispatch(releaseBlockedLogin()),
    initialBlockedLoginStatus: () => dispatch(initialBlockedLoginStatus())
});

export default connect(mapStateToProps, mapDispatchToProps)(PromotionPage);