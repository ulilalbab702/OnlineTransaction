import {connect} from 'react-redux';
import Cards from './Cards'

const mapStateToProps = state => ({
   userData:state.user,
   displayMode:state.displayMode,
   
});

export default connect(mapStateToProps,null)(Cards);