import {connect} from 'react-redux';
import ApplicationBar from './ApplicationBar'

const mapStateToProps = state => ({
   userData:state.user,
   displayMode:state.displayMode,
   
});

export default connect(mapStateToProps,null)(ApplicationBar);