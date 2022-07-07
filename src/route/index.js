import React from 'react';
import { MENU } from 'constants/menu';
import {
  HomePage,
  Landing,
  TransferPage,
  PromotionPage,
  DetailPromotionPage,
  BillingAddress,
  ListOrderPage,
  BucketListPage,
  DetailProduct,
  DeliverMethodPage,
  DetailNewsPage,
  ListProduct,
  ChangeAddress,
  ListNewsPage,
  UserProfilePage,
  TermConditionPage,
  DetailListOrder,
  WishtListProduct,
  DetailVoucherPage,
  ListVideoPage,
  DetailVideoPage,
} from 'views';
import { Route, Switch, Redirect } from 'react-router';
import AuthGuard from 'components/AuthGuard';
import PageNotFound from 'views/PageNotFound/PageNotFound'


const routes = (
  <Switch>
    <Route exact path={MENU.LANDING} component={AuthGuard(HomePage)} />
    <Route exact path={MENU.HOME} component={AuthGuard(Landing)} />
    <Route exact path={MENU.TRANSFER} component={AuthGuard(TransferPage)} />
    <Route exact path={MENU.PROMOTION} component={AuthGuard(PromotionPage)} />
    <Route exact path={`${MENU.DETAILPROMOTION}/:promotionId/:imageUrl`} component={AuthGuard(DetailPromotionPage)} />
    <Route exact path={`${MENU.DETAILVOUCHER}/:voucherId/:imageUrl`} component={AuthGuard(DetailVoucherPage)} />
    <Route exact path={MENU.LIST_ORDER} component={AuthGuard(ListOrderPage)} />
    <Route exact path={`${MENU.DETAIL_LIST_ORDER}/:transactionId`} component={AuthGuard(DetailListOrder)} />
    <Route exact path={MENU.BILLING} component={AuthGuard(BillingAddress)} />
    <Route exact path={MENU.DELIVERY_METHODE} component={AuthGuard(DeliverMethodPage)} />
    <Route exact path={`${MENU.DETAIL_PROMOTION_LIST}/:newsId`} component={AuthGuard(DetailNewsPage)} />
    <Route exact path={`${MENU.DETAIL_PRODUCT}:productId`} component={AuthGuard(DetailProduct)} />
    <Route exact path={MENU.BUCKET_LIST} component={AuthGuard(BucketListPage)} />
    <Route exact path={MENU.LIST_PRODUCT} component={AuthGuard(ListProduct)} />
    <Route exact path={MENU.CHANGE_ADDRESS} component={AuthGuard(ChangeAddress)} />
    <Route exact path={MENU.LIST_NEWS} component={AuthGuard(ListNewsPage)} />
    <Route exact path={MENU.USER_PROFILE} component={AuthGuard(UserProfilePage)} />
    <Route exact path={MENU.TERM_CONDITION} component={AuthGuard(TermConditionPage)} />
    <Route exact path={MENU.WISHTLIST_PRODUCT} component={AuthGuard(WishtListProduct)} />
    <Route exact path={MENU.LIST_VIDEO} component={AuthGuard(ListVideoPage)} />
    <Route exact path={`${MENU.DETAIL_VIDEO}/:videoId`} component={AuthGuard(DetailVideoPage)} />
    <Redirect to="/Landing" />
  </Switch>
);

export default routes;
