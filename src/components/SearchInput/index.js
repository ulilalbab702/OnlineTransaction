import SearchInput from './SearchInput';
import { connect } from "react-redux";
import { push } from "connected-react-router";

const mapStateToProps = (state) => ({
    ...state.user,
    path: state.router.location.pathname,
});

const mapDispatchToProps = (dispatch) => ({
    push: (url, item) => dispatch(push(url, item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchInput);