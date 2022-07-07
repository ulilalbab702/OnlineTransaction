import React, { useEffect, useRef, useState } from 'react';
import {
  Row,
  Col,
  Button,
} from 'reactstrap';
import './style/index.scss';
import {
  artikel,
  imageNotFound
} from "assets/images";
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import firebase from '../../firebase/firebase';
import parse from 'html-react-parser';
import { MENU } from 'constants/menu';

const ListNewsPage = (props) => {
  const [value, setValue] = useState("");
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
    setAnalyticClevertap("view", "View_ListNews_Screen", "View_ListNews_Screen", null);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await props.fetchListNews('', 6, page)
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchReq() {
      props.fetchListNewsReq()
    }
    fetchReq()
  }, [])

  const _renderShowMore = () => {
    if (props.dataNewsAll.hasNextPage) {
      return (
        <div onClick={() => {
          setPage(page + 1);
          setAnalyticClevertap("click", "Click_SeeMoreNews", "View_ListNews_Screen", null);
          props.fetchListNews('', 6, page + 1);
        }}
          className='cardMore' style={{ height: '50px', cursor: 'pointer' }}>
          <p className='titleButtonMore'>Lihat Berita Lainnya</p>
        </div>
      )
    }
  }

  const _renderBreadcrumb = () => {
    const breadcrums = [
      {
        'url': '/Landing',
        'name': 'Landing'
      },
    ];
    return (
      <div style={{ marginBottom: '1rem', marginRight: 'auto' }}>
        <Breadcrumb
          linkBreadcrumb={breadcrums}
          typography={"List berita"}
        />
      </div>
    )
  };

  const _renderNotFound = () => {
    return (
      <div className='containerNewsNotFound'>
        <img src={imageNotFound} className='imgNewsNotFound'></img>
        <p className='titleNewsNotFound'>Tidak bisa menemukan berita</p>
      </div>
    )
  };

  return (
    <div className="paddingContentListNews" style={{ paddingTop: 110 }}>
      {_renderBreadcrumb()}
      {props.listNewsData.data.length > 0 ?
        (<div className="gridNews">
          {props.listNewsData.data.map((item) => {
            return (
              <div
                key={item.newsId}
                className='cardListNews'
                onClick={() => {
                  setAnalyticClevertap("click", "Click_NewsDetail", "View_ListNews_Screen", ["Click_NewsDetail", { "News_Name": item.title }]);
                  props.push(`${MENU.DETAIL_PROMOTION_LIST}/${item.newsId}`)
                }}
              >
                <img className='imageNews' src={item.imageNewsUrl} />
                <Row className='contentNews' style={{ flexGrow: '0' }}>
                  <div className="contentDescription">
                    <p className='titleNews'>{item.title}</p>
                    <p className='newsDescription'>{parse(!item.description ? '-' : item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description)}</p>
                  </div>
                </Row>
              </div>
            )
          })
          }
        </div>)
        :
        _renderNotFound()
      }
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {_renderShowMore()}
      </div>
    </div>
  )
}

export default ListNewsPage;