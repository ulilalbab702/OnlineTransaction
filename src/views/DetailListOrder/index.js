import DetailListOrder from './DetailListOrder';
import { connect } from 'react-redux';
import { LOGIN_TYPE, TRANSACTION_DETAIL } from 'actions/actionTypes';
import { login } from 'actions/user';
import { push } from 'connected-react-router';
import {
    createLoadingSelector,
} from 'utils/selector.helper'
import { transactionDetails, getTimeline, downloadFakturPajak, downloadInvoice } from 'actions/transaction';
import { reviewProductPost } from 'actions/reviewProduct';
import { timelineForwarderGet } from 'actions/forwarder';

//Set selector loading 
const loadingSelector = createLoadingSelector([TRANSACTION_DETAIL]);
const mapStateToProps = state => ({
    ...state.user,
    isLoading: loadingSelector(state),
    detailTransaction: state.transaction.transactionDetail,
    timelineData: state.transaction.timeline,
    timelineForwarderData: state.forwarder.forwarder.dataTimeline,
    review: state.reviewProduct.reviewProduct,
    fakturPajakInvoice: state.transaction.fakturPajakInvoice,
});

const mapDispatchToProps = dispatch => ({
    login: (data) => dispatch(login(data)),
    push: (url) => dispatch(push(url)),
    fetchDetailTransaction: (data, token) => dispatch(transactionDetails(data, token)),
    fetchGetTimeline: (token, params) => dispatch(getTimeline(token, params)),
    fetchGetTimelineForwarder: (token, ExternalNumber) => dispatch(timelineForwarderGet(token, ExternalNumber)),
    fetchPostReviewProduct: (data, token) => dispatch(reviewProductPost(data, token)),
    fetchGetFakturPajak: (token, orderNo) => dispatch(downloadFakturPajak(token, orderNo)),
    fetchGetInvoice: (token, orderNo) => dispatch(downloadInvoice(token, orderNo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailListOrder);