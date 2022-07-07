import DetailVoucherPage from './DetailVoucherPage';
import { connect } from 'react-redux';
import { LOGIN_TYPE } from 'actions/actionTypes';
import { login } from 'actions/user';
import { push } from 'connected-react-router';
import {
    createLoadingSelector,
} from 'utils/selector.helper'
import { voucherList, voucherDetail, voucherClaim } from 'actions/voucher';

//Set selector loading 
const loadingSelector = createLoadingSelector([LOGIN_TYPE]);
const mapStateToProps = state => ({
    ...state.user,
    isLoading: loadingSelector(state),
    dataVoucherList: state.voucher.voucher.data,
    dataVoucherDetail: state.voucher.voucher.dataDetail,
    voucherLoading: state.voucher.voucher.loading,
    claimLoading: state.voucher.voucher.claimLoading,
    claimSuccess: state.voucher.voucher.claimSuccess,
});

const mapDispatchToProps = dispatch => ({
    login: (data) => dispatch(login(data)),
    push: (url) => dispatch(push(url)),
    fetchDetailVoucher: (token, id) => dispatch(voucherDetail(token, id)),
    fetchVoucherList: (token, PageSize) => dispatch(voucherList(token, PageSize)),
    fetchVoucherClaim: (token, body) => dispatch(voucherClaim(token, body)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailVoucherPage);