import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { history } from 'config/router.config';
import { errorReducer } from './error';
import loadingReducer from './loading';
import { userReducer } from './user';
import displayReducer from './display';
import { detailNewsReducer } from './detailNews';
import { detailProductReducer } from './detailProduct';
import { listNewsReducer } from './listNews';
import { billingAddressReducer } from './billingAddress';
import { listBrandReducer } from './brand';
import { cartReducer } from './cart';
import { listProductReducer } from './listProduct';
import { userProfileReducer } from './userProfile';
import { promotionReducer } from './promotion';
import { termConditionReducer } from './termCondition';
import { categoryReducer } from './category';
import { transactionReducer } from './transaction';
import { blockedLoginReducer } from './blockedLogin';
import { listPaymentReducer } from './payment';
import { wishlistReducer } from './wishlist';
import { voucherReducer } from './voucher'
import { reviewProductReducer } from './reviewProduct';
import { forwarderReducer } from './forwarder';
import { videoReducer } from './video';


const appReducer = combineReducers({
    router: connectRouter(history),
    error: errorReducer,
    loading: loadingReducer,
    user: userReducer,
    displayMode: displayReducer,
    listNews: listNewsReducer,
    detailNews: detailNewsReducer,
    billingAddress: billingAddressReducer,
    detailProduct: detailProductReducer,
    listBrand: listBrandReducer,
    cart: cartReducer,
    listProduct: listProductReducer,
    userProfile: userProfileReducer,
    promotions: promotionReducer,
    termCondition: termConditionReducer,
    category: categoryReducer,
    transaction: transactionReducer,
    blockedLogin: blockedLoginReducer,
    listPayments: listPaymentReducer,
    wishlist: wishlistReducer,
    voucher: voucherReducer,
    reviewProduct: reviewProductReducer,
    forwarder: forwarderReducer,
    video: videoReducer,
});

export default appReducer;
