import DetailNewsPage from './DetailNewsPage';
import { connect } from 'react-redux';
import { DETAIL_NEWS_REQ } from 'actions/actionTypes';
import { listDetailNews, listDetailNewsAll } from 'actions/detailNews';
import { push } from 'connected-react-router';
import {
    createLoadingSelector,
} from 'utils/selector.helper'

//Set selector loading 
const loadingSelector = createLoadingSelector([DETAIL_NEWS_REQ]);
const mapStateToProps = state => ({
    ...state.user,
    detailNewsData: state.detailNews.listDetailNews.data,
    newsListData: state.detailNews.listDetailNewsAll.data,
    isLoading: loadingSelector(state),

});

const mapDispatchToProps = dispatch => ({
    push: (url) => dispatch(push(url)),
    fetchDetailNews: (newsId) => dispatch(listDetailNews(newsId)),
    fetchNewsList: (PerPage, Keyword, Title) => dispatch(listDetailNewsAll(PerPage, Keyword, Title)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailNewsPage);