import ChangeAddress from './ChangeAddress';
import { connect } from 'react-redux';
import { BILLING_ADDRESS_REQ } from 'actions/actionTypes';
import { login } from 'actions/user';
import { push } from 'connected-react-router';
import {
    createLoadingSelector,
} from 'utils/selector.helper'
import { listBillingAddressGet, listBillingAddressPut, billingAddressPost, getSearchDistrict, getSearchPostalCode, resetDistrict, resetPostalcode, billingAddressDelete } from 'actions/billingAddress';

//Set selector loading 
const loadingSelector = createLoadingSelector([BILLING_ADDRESS_REQ]);
const mapStateToProps = state => ({
    isLoading: loadingSelector(state),
    billingAddressList: state.billingAddress.billingAddress.data,
    billingAddressListError: state.billingAddress.billingAddress.err,
    user: state.user,
    districtList: state.billingAddress.district.districtList,
    dataProvince: state.billingAddress.district.dataProvince,
    dataCity: state.billingAddress.district.dataCity,
    dataVillages: state.billingAddress.district.dataVillages,
    dataPostalCodes: state.billingAddress.district.dataPostalCodes,
    postalcodeList: state.billingAddress.district.postalcodeList,
    dataPut: state.billingAddress.billingAddress.dataPut,
    errPut: state.billingAddress.billingAddress.errPut,
    errPostBilling: state.billingAddress.billingAddress.errPostBilling,
    dataPostBilling: state.billingAddress.billingAddress.dataPostBilling
});

const mapDispatchToProps = dispatch => ({
    login: (data) => dispatch(login(data)),
    push: (url, state) => dispatch(push(url, state)),
    fetchGetBillingList: (userId, token) => dispatch(listBillingAddressGet(userId, token)),
    fetchPutBillingList: (token, billingId, data, changeStatus) => dispatch(listBillingAddressPut(token, billingId, data, changeStatus)),
    fetchDeleteBillingList: (token, billingId) => dispatch(billingAddressDelete(token, billingId)),
    fetchPostBillingAddress: (token, userId, data) => dispatch(billingAddressPost(token, userId, data)),
    fetchSearchDistrict: (city) => dispatch(getSearchDistrict(city)),
    fetchSearchPostalCode: (postalcode) => dispatch(getSearchPostalCode(postalcode)),
    fetchResetDistrict: () => dispatch(resetDistrict()),
    fetchResetPostalcode: () => dispatch(resetPostalcode()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeAddress);