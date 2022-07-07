import {connect} from 'react-redux';
import Container from './Container';
import {setPageDisplayModeAction} from '../../actions/display';
import {push} from 'connected-react-router';
import { setClick } from 'actions/brand';
import { getUser } from 'actions/user';
import {  clearStore } from 'actions/category';
const mapStateToProps = state => ({
    path: state.router.location.pathname,
    displayMode:state.displayMode,
    brandData: state.listBrand.listBrand.data,
    clickEvent: state.listBrand.listBrand.click,
    user:state.user,
})

const mapDispatchToProps = (dispatch) => ({
    setDisplayMode:(mode) => dispatch(setPageDisplayModeAction(mode)),
    push: (path) => dispatch(push(path)),
    clickChat: (event) => dispatch(setClick(event)),
    getUser: () => dispatch(getUser()),
    clearStore: () => dispatch(clearStore()),
})

export default connect(mapStateToProps,mapDispatchToProps)(Container);