import React, { useEffect, useState } from "react";
import "./DetailVideoPage.style.scss";
import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import { IconShareWhite, PlayBtn } from "assets/icons";
import { isMobile } from "react-device-detect";
import Viewer from 'react-viewer';
import { FaEnvelope, FaFacebookF, FaLink, FaShareAlt, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { EmailShareButton, FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import moment from "moment";
import firebase from "../../firebase/firebase";
import ReactPlayer from "react-player";
import { MENU } from "constants/menu";


const DetailVideoPage = (props) => {
  const [viewImage, setViewImage] = useState(false);
  const [imageAttribute, setImageAttribute] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const videoId = props.match.params.videoId;
  const newsUrl = window.location.href;
  const cleanUrl = newsUrl;

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
    props.fetchGetVideoDetail(videoId);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (props.detailVideoData !== null) {
      setVideoData(props.detailVideoData);
      setAnalyticClevertap("view", "View_DetailVideo_Screen", "View_DetailVideo_Screen", ["View_DetailVideo_Screen", { "Video_Name": props.detailVideoData.title }]);
    }
  }, [props.detailVideoData]);

  const _handleShowImage = () => {
    setAnalyticClevertap("click", "Click_ShareVideo", "View_DetailVideo_Screen", ["Click_ShareVideo", { "Video_Name": props.detailVideoData.title }]);
    setViewImage(true);
    setImageAttribute(false);
  };
  const _handleCloseImage = () => {
    setViewImage(false);
  };
  const copyToClipboard = (text) => {
    let textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }
  const onCopyImageButtonClick = () => {
    copyToClipboard(cleanUrl);
    setImageAttribute(true);
  }
  const share = () => {
    if (navigator.share) {
      navigator
        .share({
          url: cleanUrl,
        })
        .then(() => {

        })
        .catch(error => {

        });
    }
  }
  const createImageViewToolbar = (toolbars) => {
    if (isMobile) {
      return toolbars.concat([
        {
          key: "copy",
          render: <FaLink />,
          onClick: () => { onCopyImageButtonClick() }
        },
        {
          key: "share",
          render: <FaShareAlt />,
          onClick: () => { share() }
        }

      ]);
    } else if (!isMobile) {
      return toolbars.concat([
        {
          key: "facebook",
          render: <FacebookShareButton url={cleanUrl}>
            <FaFacebookF />
          </FacebookShareButton>,
        },
        {
          key: "twitter",
          render: <TwitterShareButton url={cleanUrl}>
            <FaTwitter />
          </TwitterShareButton>,
        },
        {
          key: "wa",
          render: <WhatsappShareButton url={cleanUrl}>
            <FaWhatsapp />
          </WhatsappShareButton>,
        },
        {
          key: "email",
          render: <EmailShareButton url={cleanUrl}>
            <FaEnvelope />
          </EmailShareButton>,
        },
        {
          key: "copy",
          render: <FaLink />,
          onClick: () => onCopyImageButtonClick()
        },
      ]);
    }
  }

  const _renderBreadcrumb = () => {
    const breadcrums = [
      {
        'url': MENU.LANDING,
        'name': 'Landing'
      },
      {
        'url': '/Landing/ListVideo',
        'name': 'List Video'
      }
    ];
    return (
      <Breadcrumb
        linkBreadcrumb={breadcrums}
        typography="Detail Video"
      />
    );
  };

  const _renderDetailVideo = () => {
    if (videoData !== null) {
      return (
        <div className="container-detailVideo">
          <Viewer
            visible={viewImage}
            onClose={() => _handleCloseImage()}
            onMaskClick={() => _handleCloseImage()}
            images={[{ src: videoData.imageThumbnailUrl, alt: 'Copied to clipboard: ' + cleanUrl }]}
            noNavbar={true}
            attribute={imageAttribute}
            zoomSpeed={0.1}
            noImgDetails={true}
            rotatable={false}
            scalable={false}
            changeable={false}
            showTotal={false}
            customToolbar={toolbars => createImageViewToolbar(toolbars)}
          />
          {_renderBreadcrumb()}
          <div
            onClick={() =>
              setAnalyticClevertap("click", "Click_ImageVideo", "View_DetailVideo_Screen", ["Click_ImageVideo", { "Video_Name": props.detailVideoData.title }])
            }
          >
            <ReactPlayer
              url={videoData.videoUrl}
              width={"100%"}
              height={"45vw"}
              style={{ borderRadius: 8, marginTop: "2rem" }}
              playing={true}
              light={videoData.imageThumbnailUrl}
              controls={true}
              playIcon={(<img className="play-btn" src={PlayBtn} />)}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row", marginTop: '1rem' }}>
            <div className="left">
              <p className="title-video">{videoData.title}</p>
              <p className="viewer">{moment(videoData.createdDate).format("DD MMMM YYYY")}</p>
              <p className="title-desc">Deskripsi</p>
              <p className="desc">{videoData.description}</p>
            </div>
            <div className="right" onClick={() => _handleShowImage()}>
              <p className="share">Bagikan</p>
              <span className="icon-share">
                <img src={IconShareWhite} />
              </span>
            </div>
          </div>
        </div>
      );
    };
  };

  return (
    <>
      {_renderDetailVideo()}
    </>
  );
};

export default DetailVideoPage;