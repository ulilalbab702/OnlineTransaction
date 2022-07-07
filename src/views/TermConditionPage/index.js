import TermConditionPage from './TermConditionPage';
import { connect } from 'react-redux';
import { TERM_CONDITION_REQ } from 'actions/actionTypes';
import { login } from 'actions/user';
import { push } from 'connected-react-router';
import {
    createLoadingSelector,
} from 'utils/selector.helper'
import { termConditionGet } from 'actions/termCondition';

//Set selector loading 
const loadingSelector = createLoadingSelector([TERM_CONDITION_REQ]);
const mapStateToProps = state => ({
    ...state.user,
    isLoading: loadingSelector(state),
    dataTermCondition: state.termCondition.termCondition.data,
    loading: state.termCondition.termCondition.loading,
});

const mapDispatchToProps = dispatch => ({
    login: (data) => dispatch(login(data)),
    push: (url) => dispatch(push(url)),
    fetchTermCondition: (token) => dispatch(termConditionGet(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(TermConditionPage);