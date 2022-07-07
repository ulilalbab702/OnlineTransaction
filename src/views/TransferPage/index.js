import TransferPage from './TransferPage';
import { connect } from 'react-redux';
import { LOGIN_TYPE } from 'actions/actionTypes';
import { login } from 'actions/user';
import { push } from 'connected-react-router';
import {
    createLoadingSelector,
} from 'utils/selector.helper'

//Set selector loading 
const loadingSelector = createLoadingSelector([LOGIN_TYPE]);
const mapStateToProps = state => ({
    ...state.user,
    isLoading: loadingSelector(state),
});

const mapDispatchToProps = dispatch => ({
    login: (data) => dispatch(login(data)),
    push: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferPage);