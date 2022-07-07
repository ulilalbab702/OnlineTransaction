import React from 'react';
import BillingAddress from './views/BillingAddress';
import ChangeAddress from './views/ChangeAddress';
import DeliverMethodPage from './views/DeliverMethodPage';
import DetailProduct from './views/DetailProduct';
import DetailPromotionPage from './views/DetailPromotionPage';
import LandingPage from './views/LandingPage';
import ListOrderPage from './views/ListOrderPage';
import ListProduct from './views/ListProduct';
import PromotionPage from './views/PromotionPage';
import TransferPage from './views/TransferPage';
import TermConditionPage from './views/TermConditionPage';

const routes = [
      { path: '/Home/', name: 'Home', exact: true, component: LandingPage },
      {
            path: '/ChangeAddress',
            name: 'Change Address', component: ChangeAddress
      },
      {
            path: '/Home/ListOrder/DeliveryMethode',
            name: 'Deliver Method Page', component: DeliverMethodPage
      },
      {
            path: '/DetailProduct',
            name: 'Detail Product', component: DetailProduct
      },
      {
            path: '/detailPromotionPage',
            name: 'Detail Promotion Page', component: DetailPromotionPage
      },
      {
            path: '/Home/ListOrder',
            name: 'List Order Page', component: ListOrderPage
      },
      {
            path: '/Home/ListProduct',
            name: 'List Product', component: ListProduct
      },
      {
            path: '/Promotion',
            name: 'Promotion Page', component: PromotionPage
      },
      {
            path: '/Transfer',
            name: 'Transfer Page', component: TransferPage
      },
      {
            path: '/Home/TermCondition',
            name: 'Term Condition Page', component: TermConditionPage
      },
      { path: '', name: '', component: null },
];

export default routes;
