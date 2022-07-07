import UserProfilePage from './UserProfilePage';
import { connect } from 'react-redux';
import { LOGIN_TYPE } from 'actions/actionTypes';
import { login } from 'actions/user';
import { push } from 'connected-react-router';
import {
    createLoadingSelector,
} from 'utils/selector.helper'
import { contactInformationPut, listBillingAddressGet, listBillingAddressPut, billingAddressPost, getSearchDistrict, getSearchPostalCode, resetDistrict, resetPostalcode, billingAddressDelete } from 'actions/billingAddress';
import { listUserProfileGet, setimageGlobal, ChangeProfilFunc } from 'actions/userProfile';
import { clearStore } from 'actions/category';
import { getAttributeName } from 'actions/cart';

//Set selector loading 
const loadingSelector = createLoadingSelector([LOGIN_TYPE]);
const mapStateToProps = state => ({
    ...state.user,
    path: state.router.location.pathname,
    isLoading: loadingSelector(state),
    billingAddressList: state.billingAddress.billingAddress.data,
    billingAddressListError: state.billingAddress.billingAddress.err,
    successPutContactInfo: state.billingAddress.billingAddress.successPutContactInfo,
    userInfoData: state.userProfile.userProfile.data,
    districtList: state.billingAddress.district.districtList,
    dataProvince: state.billingAddress.district.dataProvince,
    dataCity: state.billingAddress.district.dataCity,
    dataVillages: state.billingAddress.district.dataVillages,
    dataPostalCodes: state.billingAddress.district.dataPostalCodes,
    postalcodeList: state.billingAddress.district.postalcodeList,
    dataPut: state.billingAddress.billingAddress.dataPut,
    errPut: state.billingAddress.billingAddress.errPut,
    errPostBilling: state.billingAddress.billingAddress.errPostBilling,
    dataPostBilling: state.billingAddress.billingAddress.dataPostBilling,
    attributeName: state.cart.attributeName.attributeName,
    dataProfile: state.userProfile.userProfile,
});

const mapDispatchToProps = dispatch => ({
    login: (data) => dispatch(login(data)),
    push: (url) => dispatch(push(url)),
    fetchGetBillingList: (userId, token) => dispatch(listBillingAddressGet(userId, token)),
    fetchPostBillingAddress: (token, userId, data) => dispatch(billingAddressPost(token, userId, data)),
    fetchPutBillingList: (token, billingId, data, changeStatus) => dispatch(listBillingAddressPut(token, billingId, data, changeStatus)),
    fetchDeleteBillingList: (token, billingId) => dispatch(billingAddressDelete(token, billingId)),
    fetchGetUserProfile: (token, userId) => dispatch(listUserProfileGet(token, userId)),
    fetchPutContactInformation: (data, token) => dispatch(contactInformationPut(data, token)),
    clearStore: () => dispatch(clearStore()),
    fetchSearchDistrict: (city) => dispatch(getSearchDistrict(city)),
    fetchSearchPostalCode: (postalcode) => dispatch(getSearchPostalCode(postalcode)),
    fetchResetDistrict: () => dispatch(resetDistrict()),
    fetchResetPostalcode: () => dispatch(resetPostalcode()),
    fetchPostChangeProfile: (token, userId, file) => dispatch(ChangeProfilFunc(token, userId, file)),
    setimageGlobal: () => dispatch(setimageGlobal()),
    fetchAttributeName: (name) => dispatch(getAttributeName(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfilePage);