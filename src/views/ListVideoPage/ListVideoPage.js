import React, { useEffect, useState } from "react";
import "./ListVideoPage.style.scss";
import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import { PlayBtn } from "assets/icons";
import { MENU } from "constants/menu";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import firebase from "../../firebase/firebase";

const ListVideoPage = (props) => {
  const [videoData, setVideoData] = useState(null);
  const [page, setPage] = useState(1);

  const setAnalyticClevertap = (action, event, screen, product) => {
    if (props.user) {
      const { userName } = props.user;
      if (product !== null) {
        window.clevertapEventProduct(`${product[0] + "_LogedIn"}`, product[1]);
      } else {
        window.clevertapEvent(`${event + "_LogedIn"}`, props.user);
      }
      firebase.analytics().setUserId(userName);
      firebase.analytics().setUserProperties(userName, "username:" + userName + `||View: ${screen}`);
      firebase.analytics().setCurrentScreen(screen, screen);
      firebase.analytics().logEvent(`${event + "_LogedIn"}`);
      firebase.analytics().setUserProperties("username", userName);
      firebase.analytics().setUserProperties(action, `${event + "_LogedIn"}`);
    } else {
      if (product !== null) {
        window.clevertapEventProduct(`${product[0] + "_NotLogedIn"}`, product[1]);
      } else {
        window.clevertapEvent(`${event + "_NotLogedIn"}`, null);
      }
      firebase.analytics().setCurrentScreen(screen, screen);
      firebase.analytics().logEvent(`${event + "_NotLogedIn"}`);
      firebase.analytics().setUserProperties(action, `${event + "_NotLogedIn"}`);
    }
  };

  useEffect(() => {
    setAnalyticClevertap("view", "View_ListVideo_Screen", "View_ListVideo_Screen", null);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    props.fetchGetAllVideo(page, 6);
  }, [page]);

  useEffect(() => {
    if (props.videoData !== null) {
      setVideoData(props.videoData);
    }
  }, [props.videoData]);

  const _skeletonVideo = () => {
    return (
      <div className="list-video">
        <Skeleton height={200} width={300} />
        <Skeleton height={200} width={300} />
        <Skeleton height={200} width={300} />
      </div>
    );
  };

  const _renderListVideo = () => {
    return (
      <>
        <div className="list-video">
          {videoData && videoData?.data.map((video, index) => (
            <div
              key={index}
              className="card-video"
              onClick={() => {
                setAnalyticClevertap("click", "Click_VideoDetail", "View_ListVideo_Screen", ["Click_VideoDetail", { "Video_Name": video.title }]);
                props.push(`${MENU.DETAIL_VIDEO}/${video.id}`)
              }}
            >
              <div className="con-image">
                <img src={video.imageThumbnailUrl} />
                <img src={PlayBtn} className="play-btn" />
              </div>
              <p className="title-video">{video.title}</p>
              <p className="info-video">{moment(video.createdDate).format("DD MMMM YYYY")}</p>
            </div>
          ))}
        </div>
        {videoData && _renderPagination()}
      </>
    );
  };

  const handlePage = (number) => {
    if (page !== number) {
      setAnalyticClevertap("click", "Click_PaginationVideo_Number", "View_ListVideo_Screen", ["Click_PaginationVideo_Number", { "Page_Number": number }]);
      setPage(number)
    }
  };
  const _renderPagination = () => {
    const arr = []
    for (let i = 1; i <= videoData.totalPageCount; i++) {
      const newArr = { num: i };
      arr.push(newArr);
    };
    return (
      <div className="con-pagination">
        {
          videoData.hasPreviousPage &&
          <span
            className="paging"
            onClick={() => {
              setAnalyticClevertap("click", "Click_PaginationVideo_Previous", "View_ListVideo_Screen", ["Click_PaginationVideo_Previous", { "Page_Number": page - 1 }]);
              setPage(page - 1)
            }}
          >{"<"}</span>
        }
        {arr && arr.map((item) => (
          <span
            onClick={() => handlePage(item.num)}
            className={item.num == page ? "paging active" : "paging"}
          >{item.num}</span>
        ))}
        {
          videoData.hasNextPage &&
          <span
            className="paging"
            onClick={() => {
              setAnalyticClevertap("click", "Click_PaginationVideo_Next", "View_ListVideo_Screen", ["Click_PaginationVideo_Next", { "Page_Number": page + 1 }]);
              setPage(page + 1)
            }}
          >{">"}</span>
        }
      </div>
    );
  };

  const _renderBreadcrumb = () => {
    const breadcrums = [
      {
        'url': '/Landing',
        'name': 'Landing'
      }
    ];
    return (
      <Breadcrumb
        linkBreadcrumb={breadcrums}
        typography="List video"
      />
    );
  };

  return (
    <div className="container-listvideo">
      {_renderBreadcrumb()}
      {props.videoLoading ? _skeletonVideo() : _renderListVideo()}
    </div>
  );
};

export default ListVideoPage;