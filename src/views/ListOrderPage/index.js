import ListOrderPage from './ListOrderPage';
import { connect } from 'react-redux';
import { LOGIN_TYPE, TRANSACTION_ORDER } from 'actions/actionTypes';
import { login } from 'actions/user';
import { push } from 'connected-react-router';
import {
    createLoadingSelector,
} from 'utils/selector.helper'
import { getTransactionOrder, getListCancelAction, patchCancelReasonAction, patchOrderReceivedAction } from 'actions/transaction';

//Set selector loading 
const loadingSelector = createLoadingSelector([LOGIN_TYPE, TRANSACTION_ORDER]);
const mapStateToProps = state => ({
    ...state.user,
    isLoading: loadingSelector(state),
    orderTransaction: state.transaction.transactionOrder,
    dataListCancel: state.transaction.cancelOrder.dataListCancel,
    dataPatchCancelReason: state.transaction.cancelOrder.dataPatchCancelReason,
    dataPatchOrderReceived: state.transaction.orderReceived.dataPatchOrderReceived,
    errorListCancel: state.transaction.cancelOrder.errorListCancel,
    errorPatchCancelReason: state.transaction.cancelOrder.errorPatchCancelReason,
    errorPatchOrderReceived: state.transaction.orderReceived.errorPatchOrderReceived,
});

const mapDispatchToProps = dispatch => ({
    login: (data) => dispatch(login(data)),
    push: (url, data) => dispatch(push(url, data)),
    fetchTransactionOrder: (data, token) => dispatch(getTransactionOrder(data, token)),
    fetchListCancel: (token) => dispatch(getListCancelAction(token)),
    fetchPatchCancelReason: (token, data) => dispatch(patchCancelReasonAction(token, data)),
    fetchPatchOrderReceived: (token, data) => dispatch(patchOrderReceivedAction(token, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ListOrderPage);