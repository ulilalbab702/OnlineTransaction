import WishtListProduct from './WishtListProduct';
import { connect } from 'react-redux';
import { LOGIN_TYPE } from 'actions/actionTypes';
import { login } from 'actions/user';
import { push } from 'connected-react-router';
import {
    createLoadingSelector,
} from 'utils/selector.helper';
import { listProduct } from 'actions/listProduct';
import { listBrand } from 'actions/brand';
import { listCategory } from 'actions/category';
import { listWishlist, deleteWishlist, deleteBulkWishlist } from 'actions/wishlist';

//Set selector loading 
const loadingSelector = createLoadingSelector([LOGIN_TYPE]);
const mapStateToProps = state => ({
    ...state.user,
    loading: state.listProduct.listProduct.loading,
    wishlistData: state.wishlist.wishlist.dataGet,
    wishlistDel: state.wishlist.wishlist.dataDel,
    wishlistLoading: state.wishlist.wishlist.loading,
});

const mapDispatchToProps = dispatch => ({
    login: (data) => dispatch(login(data)),
    push: (url, state) => dispatch(push(url, state)),
    fetchLisWishlist: (token, Filters) => dispatch(listWishlist(token, Filters)),
    fetchDeleteSigleWishlist: (token, data) => dispatch(deleteWishlist(token, data)),
    fetchDeleteBulkWishlist: (token, data) => dispatch(deleteBulkWishlist(token, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WishtListProduct);