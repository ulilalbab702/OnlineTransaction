import ListNewsPage from './ListNewsPage';
import { connect } from 'react-redux';
import { LIST_NEWS_REQ } from 'actions/actionTypes';
import { listNews, listNewsReq } from 'actions/listNews'
import { push } from 'connected-react-router';
import {
    createLoadingSelector,
} from 'utils/selector.helper'

//Set selector loading 
const loadingSelector = createLoadingSelector([LIST_NEWS_REQ]);
const mapStateToProps = state => ({
    ...state.user,
    listNewsData: state.listNews.listNews.data,
    dataNewsAll: state.listNews.listNews,
    isLoading: loadingSelector(state)
});

const mapDispatchToProps = dispatch => ({
    push: (url, item) => dispatch(push(url, item)),
    fetchListNews: (attributValue, PageSize, PageNumber) => dispatch(listNews(attributValue, PageSize, PageNumber)),
    fetchListNewsReq: () => dispatch(listNewsReq())
});

export default connect(mapStateToProps, mapDispatchToProps)(ListNewsPage);