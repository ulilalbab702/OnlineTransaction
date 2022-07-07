import HomePage from './HomePage';
import { connect } from 'react-redux';
import {
    FORGOT_PASSWORD,
    IMAGE_SLIDER_REQ,
    LOGIN_TYPE,
    SIGNUP,
    VERIFY_CODE
} from 'actions/actionTypes';
import { newsImageSlider, newsProfileNews, newsMainNews } from 'actions/listNews'
import { push } from 'connected-react-router';
import {
    createLoadingSelector,
} from 'utils/selector.helper'
import { forgotPassword, login, signup, verifyCode, changePassword, loginGoogle } from 'actions/user';
import { clearError, clearStore } from 'actions/category';
import {
    blockLogin,
    countDownTimerLock,
    countFailedLogin,
    releaseBlockedLogin,
    initialBlockedLoginStatus
} from 'actions/blockedLogin';
import { listNewsHome } from 'actions/listNews';
import { imageSlider } from 'actions/promotions';
import { getAllVideo, getFiturUTConnectAction } from 'actions/video';
import { termConditionGet, updateTermCondition } from 'actions/termCondition';

//Set selector loading 
const loadingSelector = createLoadingSelector([IMAGE_SLIDER_REQ, LOGIN_TYPE, SIGNUP, FORGOT_PASSWORD, VERIFY_CODE]);
const mapStateToProps = state => ({
    ...state.user,
    isLoading: loadingSelector(state),
    register: state.user.register,
    errorRegister: state.user.errorRegister,
    errorStatus: state.category.errorStatus,
    error: state.error,
    errorForgot: state.error.errorForgot,
    errorVerify: state.error.errorVerify,
    verify: state.user.verify,
    newsHome: state.listNews.listNews.newsHome,
    loadingNews: state.listNews.listNews.loadingNews,
    imageSlider: state.promotions.promotion.image,
    loadingPromo: state.promotions.promotion.loading,
    videoData: state.video.video.data,
    dataFitur: state.video.fitur.dataFitur,
    dataTermCondition: state.termCondition.termCondition.data,

    failed_count: state.blockedLogin.blockedLogin.failed_count,
    lock_login: state.blockedLogin.blockedLogin.lock_login,
    timer_lock: state.blockedLogin.blockedLogin.timer_lock
});

const mapDispatchToProps = dispatch => ({
    push: (url) => dispatch(push(url)),
    login: (data) => dispatch(login(data)),
    loginGoogle: (data) => dispatch(loginGoogle(data)),
    signup: (data) => dispatch(signup(data)),
    clearError: () => dispatch(clearError()),
    clearStore: () => dispatch(clearStore()),
    forgotPassword: ({ email, applicationId }) => dispatch(forgotPassword({ email, applicationId })),
    verifyCode: (data) => dispatch(verifyCode(data)),
    changePassword: (data) => dispatch(changePassword(data)),
    fetchListNews: (attributValue, PageSize, PageNumber) => dispatch(listNewsHome(attributValue, PageSize, PageNumber)),
    fetchImageslider: () => dispatch(imageSlider()),
    fetchGetAllVideo: (PageNumber, PageSize) => dispatch(getAllVideo(PageNumber, PageSize)),
    fetchGetFiturUTConnect: () => dispatch(getFiturUTConnectAction()),
    fetchTermCondition: (token) => dispatch(termConditionGet(token)),
    fetchUpdateTermCondition: (token, version) => dispatch(updateTermCondition(token, version)),

    blockLogin: () => dispatch(blockLogin()),
    countDownTimerLock: (timer) => dispatch(countDownTimerLock(timer)),
    countFailedLogin: (failed_login) => dispatch(countFailedLogin(failed_login)),
    releaseBlockedLogin: () => dispatch(releaseBlockedLogin()),
    initialBlockedLoginStatus: () => dispatch(initialBlockedLoginStatus())
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);