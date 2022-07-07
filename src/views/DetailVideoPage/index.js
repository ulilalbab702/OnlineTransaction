import { push } from "connected-react-router";
import { connect } from "react-redux";
import DetailVideoPage from "./DetailVideoPage";
import { getDetailVideo } from "actions/video";

const mapStateToProps = state => ({
    ...state.user,
    detailVideoData: state.video.video.dataDetail,
});

const mapDispatchToProps = dispatch => ({
    push: (url) => dispatch(push(url)),
    fetchGetVideoDetail: (videoId) => dispatch(getDetailVideo(videoId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailVideoPage);