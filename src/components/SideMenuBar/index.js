import {connect} from 'react-redux';
import {push} from 'connected-react-router';
import SideMenuBar from './SideMenuBar';

const mapStateToProps = (state) => ({
    path:state.router.location.pathname,
    displayMode:state.displayMode,
})

const mapDispatchToProps = (dispatch) => ({
    push:(path) => dispatch(push(path))
})

export default connect(mapStateToProps,mapDispatchToProps)(SideMenuBar);