import { push } from "connected-react-router";
import { connect } from "react-redux";
import ListVideoPage from "./ListVideoPage";
import { getAllVideo } from "actions/video";

const mapStateToProps = state => ({
    ...state.user,
    videoData: state.video.video.data,
    videoLoading: state.video.video.loading,
});

const mapDispatchToProps = dispatch => ({
    push: (url) => dispatch(push(url)),
    fetchGetAllVideo: (PageNumber, PageSize) => dispatch(getAllVideo(PageNumber, PageSize)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListVideoPage);