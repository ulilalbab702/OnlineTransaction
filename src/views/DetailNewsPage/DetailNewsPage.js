import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "reactstrap";
import "./DetailNewsPage.scss";
import { ImagePromo } from "assets/images";
import { IconShareWhite } from "assets/icons";
import moment from "moment";
import Viewer from 'react-viewer';
import { isMobile } from "react-device-detect";
import { FaEnvelope, FaFacebookF, FaLink, FaShareAlt, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { EmailShareButton, FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import firebase from "../../firebase/firebase";
import parse from "html-react-parser";
import { MENU } from "constants/menu";

const DetailNewsPage = (props) => {
  const [value, setValue] = useState("");
  const [keyword, setKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [index, setIndex] = useState(0);
  const [newsId, setId] = useState(props.match.params.newsId);
  const [imageUrl, setImageUrl] = useState("");
  const [viewImage, setViewImage] = useState(false);
  const [imageAttribute, setImageAttribute] = useState(false);
  const [page, setPage] = useState(1);
  const [newsList, setDataRelated] = useState([]);
  const [dataNews, setDataNews] = useState({
    title: "Aplikasi UT Connect telah hadir di IOS",
    date: "20 Januari 2021",
    like: 129,
    image: ImagePromo,
    description: `United Tractors, Jakarta: Pada tahun 2020, United Tractors (UT) kembali berinovasi dengan meluncurkan aplikasi bertajuk: “UT Connect”. UT Connect adalah sebuah aplikasi perawatan alat berat yang dapat diakses melalui smartphone sehingga dapat memudahkan pelanggan untuk berkomunikasi langsung dengan perusahaan, mulai dari monitor alat berat yang mereka miliki hingga kebutuhan pelanggan akan informasi terkini yang berkaitan dengan pelayanan serta layanan United Tractos. 
            Fitur- Fitur UT Connect Berangkat dari inisiatif meningkatkan kepuasaan pelanggan, United Tractors melalui aplikasi perawatan alat berat, UT Connect, menyediakan fitur yang memudahkan pelanggan untuk mendapatkan feedback atas pelayanannya, yakni Ticketing System. 
            Tidak hanya itu, fitur ini pun dapat digunakan oleh pelanggan untuk melakukan pemesanan mekanik. UT Connect juga menawarkan fitur lainnya seperti Working History dan keamanan login menggunakan PIN. 
            Aplikasi perawatan alat berat, UT Connect dapat diunduh melalui PlayStore untuk Android dan Apple Store untuk iOS. Namun, sebelum mengakses aplikasi UT Connect, pelanggan harus melakukan registrasi terlebih dahulu dengan dua pilihan cara yang sangat mudah. Cara Registrasi UT Connect Registrasi bisa dilakukan dengan cara mengisi kertas formulir pendaftaran dengan membubuhkan tandatangan tinta basah untuk diserahkan kepada team UT After Sales Consultant (ASC) atau kantor cabang UT terdekat. Setelah itu, kami akan membantu membuatkan akun Anda. Apabila Anda telah memiliki satu akun dan berminat menambah akun lain, Anda dapat langsung melakukan pendaftaran secara mandiri melalui aplikasi UT Connect dengan memilih tombol “Register” yang tertera pada aplikasi. Untuk langkah seterusnya, Anda dapat melengkapi data diri seperti Nama, Nomor Handphone dan Customer Code pada e-form terlampir. UT Connect diluncurkan untuk mempermudah penggunanya dalam melakukan pemantauan alat berat miliknya agar dapat memperoleh informasi dan membantu operasi bisnis pelanggan. Segera daftarkan diri Anda untuk merasakan pelayanan terbaik yang ditawarkan oleh United Tractors. Download UT Connect disini. `,
  });
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
    setAnalyticClevertap("view", "View_ListNews_Screen", "View_ListNews_Screen", null);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchData() {
      await props.fetchDetailNews(newsId);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (props.detailNewsData) {
      setImageUrl(props.detailNewsData.imageNewsUrl)
    }
  }, [props.detailNewsData])

  useEffect(() => {
    async function fetchData() {
      await props.fetchNewsList(page, keyword, title);
    }
    fetchData();
  }, []);

  const _handleShowImage = () => {
    setAnalyticClevertap("view", "Click_ShareNewsDetail", "View_NewsDetail_Screen", ["Click_ShareNewsDetail", { "News_Name": props.detailNewsData.title }]);
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

  const _handleChangeNews = (item) => {
    setAnalyticClevertap("click", "Click_NewsDetail", "View_NewsDetail_Screen", ["Click_NewsDetail", { "News_Name": item.title }]);
    setImageUrl(item.imageThumbnailUrl);
    setId(item.newsId);
    props.fetchDetailNews(item.newsId);
  }

  const _renderOtherNews = () => {
    return (
      <div className="default-margin">
        <div className='gridListDetailPromo'>
          <p className='title-news-relate'>Berita Terkait</p>
          {props.newsListData.data && props.newsListData.data.map((item) => {
            return (
              <div
                className='cardListPromotion'
                style={{ cursor: 'pointer' }}
                onClick={() => _handleChangeNews(item)}
              >
                <Col>
                  <img className='imageListPromotion' src={item.imageThumbnailUrl} />
                  <p className='titleProduct'>{item.title}</p>
                  <p className='seeDetail' >Lihat detail</p>
                </Col>
              </div>
            )
          })}
        </div>
        <p
          className='seeOther'
          onClick={() => {
            setAnalyticClevertap("click", "Click_SeeMoreNews", "View_NewsDetail_Screen", null);
            props.push(MENU.LIST_NEWS);
          }}
        >
          Berita lainnya →
        </p>
      </div>
    );
  };

  const _renderBreadcrumb = () => {
    const breadcrums = [
      {
        'url': '/Landing',
        'name': 'Landing'
      },
      {
        'url': '/Landing/ListNews',
        'name': 'List berita'
      }
    ];
    return (
      <div style={{ marginBottom: '0.5rem' }}>
        <Breadcrumb
          linkBreadcrumb={breadcrums}
          typography={"Detail berita"}
        />
      </div>
    )
  };

  return (
    <div className='defaultMargin ' style={{ paddingTop: 100, display: 'flex', flexDirection: 'column' }}>
      {_renderBreadcrumb()}
      <Viewer
        visible={viewImage}
        onClose={() => _handleCloseImage()}
        onMaskClick={() => _handleCloseImage()}
        images={[{ src: imageUrl, alt: 'Copied to clipboard: ' + cleanUrl }]}
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
      <p className='title-promotion-list'>{props.detailNewsData.title}</p>
      <p className='title-promotion-date'>
        {moment
          .utc(props.detailNewsData.createdDate)
          .local()
          .format("DD MMMM YYYY")}
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
          marginRight: "auto",
          cursor: "pointer"
        }}
        onClick={() => _handleShowImage()}
      >
        <span className="icon-share">
          <img src={IconShareWhite} />
        </span>
        <p className='title-icon' style={{ fontSize: "1vw", letterSpacing: 1 }}>Bagikan</p>
      </div>
      <div className='container-flex'>
        <div>
          <img src={imageUrl} className='image-promotion-list' />
          <div className="title-promotion-description">{parse(props.detailNewsData.description ? props.detailNewsData.description : "")}</div>
        </div>
        {_renderOtherNews()}
      </div>
    </div>
  );
};

export default DetailNewsPage;
