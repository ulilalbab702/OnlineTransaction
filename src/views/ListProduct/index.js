import ListProduct from './ListProduct';
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

//Set selector loading 
const loadingSelector = createLoadingSelector([LOGIN_TYPE]);
const mapStateToProps = state => ({
    ...state.user,
    loading: state.listProduct.listProduct.loading,
    listProductData: state.listProduct.listProduct.data,
    listProductMeta: state.listProduct.listProduct.meta,
    brandData: state.listBrand.listBrand.data,
    categoryData: state.listBrand.listCategory.data,
});

const mapDispatchToProps = dispatch => ({
    login: (data) => dispatch(login(data)),
    push: (url, state) => dispatch(push(url, state)),
    fetchListProduct: (token, params, pageSize) => dispatch(listProduct(token, params, pageSize)),
    fetchListBrand: () => dispatch(listBrand()),
    fetchListCategory: () => dispatch(listCategory()),

});

export default connect(mapStateToProps, mapDispatchToProps)(ListProduct);