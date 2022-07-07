import DetailPromotionPage from './DetailPromotionPage';
import { connect } from 'react-redux';
import { LOGIN_TYPE } from 'actions/actionTypes';
import { login } from 'actions/user';
import { push } from 'connected-react-router';
import {
    createLoadingSelector,
} from 'utils/selector.helper'
import { promotionList, promotionDetail } from 'actions/promotions'

//Set selector loading 
const loadingSelector = createLoadingSelector([LOGIN_TYPE]);
const mapStateToProps = state => ({
    ...state.user,
    isLoading: loadingSelector(state),
    dataDetail: state.promotions.promotion.dataDetail,
    dataPromotion: state.promotions.promotion.data
});

const mapDispatchToProps = dispatch => ({
    login: (data) => dispatch(login(data)),
    push: (url) => dispatch(push(url)),
    fetchPromotionList: (BusinessTypeId, GroupId, Page, Sorting, PageSize) => dispatch(promotionList(BusinessTypeId, GroupId, Page, Sorting, PageSize)),
    fetchDetailPromotion: (id) => dispatch(promotionDetail(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailPromotionPage);