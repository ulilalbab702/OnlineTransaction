import BillingAddress from './BillingAddress';
import { connect } from 'react-redux';
import { INFO_BILLING_ADDRESS, LOGIN_TYPE } from 'actions/actionTypes';
import { login } from 'actions/user';
import { push } from 'connected-react-router';
import {
    createLoadingSelector,
} from 'utils/selector.helper'
import { listBillingAddressPost, getInfoBillingAddress, contactInformationPut, listBillingAddressGet } from 'actions/billingAddress';
import { getPurchaseSummary, getAttributeName } from 'actions/cart';
import { checkCustomer } from 'actions/category';

//Set selector loading 
const loadingSelector = createLoadingSelector([INFO_BILLING_ADDRESS]);
const mapStateToProps = state => ({
    ...state.user.user,
    isLoading: loadingSelector(state),
    infoBilling: state.billingAddress.infoBilling.data,
    purchaseSummary: state.cart.purchaseSummary.data,
    attributeName: state.cart.attributeName.attributeName,
    billingAddressList: state.billingAddress.billingAddress.data,
    error: state.billingAddress.billingAddress.err,
    dataPost: state.billingAddress.billingAddress.dataPost,
    dataPut: state.billingAddress.billingAddress.dataPutContactInfo,
    loading: state.billingAddress.billingAddress.loading,
    dataCustomer: state.category.customerCode,
});

const mapDispatchToProps = dispatch => ({
    login: (data) => dispatch(login(data)),
    push: (url, state) => dispatch(push(url, state)),
    infoBillingAddress: (userId, token) => dispatch(getInfoBillingAddress(userId, token)),
    fetchGetBillingList: (userId, token) => dispatch(listBillingAddressGet(userId, token)),
    fetchPostBillingList: (data, token) => dispatch(listBillingAddressPost(data, token)),
    fetchPutContactInformation: (data, token) => dispatch(contactInformationPut(data, token)),
    fetchPurchaseSummary: (cartId, token) => dispatch(getPurchaseSummary(cartId, token)),
    fetchAttributeName: (name) => dispatch(getAttributeName(name)),
    checkCustomer: (token) => dispatch(checkCustomer(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BillingAddress);