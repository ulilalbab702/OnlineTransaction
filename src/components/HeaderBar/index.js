import { connect } from 'react-redux';
import DefaultHeader from './DefaultHeader'
import { push } from 'connected-react-router';
import { login, signup, forgotPassword, verifyCode, changePassword, loginGoogle } from '../../actions/user'
import { LOGIN_TYPE, SIGNUP, FORGOT_PASSWORD, TERM_CONDITION_REQ } from 'actions/actionTypes';
import { createLoadingSelector } from 'utils/selector.helper';
import { checkCustomer, clearStore, listCategory } from 'actions/category';
import { searchByUserId } from 'actions/cart';
import {
   blockLogin,
   countDownTimerLock,
   countFailedLogin,
   releaseBlockedLogin,
   initialBlockedLoginStatus
} from 'actions/blockedLogin';
import { listBrand } from 'actions/brand';
import { termConditionGet, updateTermCondition } from 'actions/termCondition';

const loadingSelector = createLoadingSelector([LOGIN_TYPE, SIGNUP, FORGOT_PASSWORD, TERM_CONDITION_REQ]);
const mapStateToProps = (state) => ({
   ...state.user,
   path: state.router.location.pathname,
   user: state.user,
   isLoading: loadingSelector(state),
   brandData: state.listBrand.listBrand.data,
   categoryData: state.listBrand.listCategory.data,
   dataCustomer: state.category.customerCode,
   dataCart: state.cart.searchByUserId.dataCart,
   dataTermCondition: state.termCondition.termCondition.data,

   register: state.user.register,
   error: state.error,
   errorRegister: state.user.errorRegister,
   failed_count: state.blockedLogin.failed_count,
   lock_login: state.blockedLogin.blockedLogin.lock_login,
   timer_lock: state.blockedLogin.blockedLogin.timer_lock
})

const mapDispatchToProps = (dispatch) => ({
   push: (path, item) => dispatch(push(path, item)),
   login: (param) => dispatch(login(param)),
   loginGoogle: (data) => dispatch(loginGoogle(data)),
   clearStore: () => dispatch(clearStore()),
   signup: (data) => dispatch(signup(data)),
   checkCustomer: (token) => dispatch(checkCustomer(token)),
   fetchCartByUserId: (userId, token) => dispatch(searchByUserId(userId, token)),
   forgotPassword: (data) => dispatch(forgotPassword(data)),
   verifyCode: (data) => dispatch(verifyCode(data)),
   changePassword: (data) => dispatch(changePassword(data)),
   fetchListBrand: () => dispatch(listBrand()),
   fetchListCategory: () => dispatch(listCategory()),
   fetchTermCondition: (token) => dispatch(termConditionGet(token)),
   fetchUpdateTermCondition: (token, version) => dispatch(updateTermCondition(token, version)),

   blockLogin: () => dispatch(blockLogin()),
   countDownTimerLock: (timer) => dispatch(countDownTimerLock(timer)),
   countFailedLogin: (failed_login) => dispatch(countFailedLogin(failed_login)),
   releaseBlockedLogin: () => dispatch(releaseBlockedLogin()),
   initialBlockedLoginStatus: () => dispatch(initialBlockedLoginStatus())
})

export default connect(mapStateToProps, mapDispatchToProps)(DefaultHeader);