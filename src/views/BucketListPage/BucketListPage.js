import React, { useState, useEffect } from "react";
import "./BucketListPage.scss";
import { Row, Col } from "reactstrap";
import { TiPlus, TiMinus } from "react-icons/ti";
import { brakeImg } from "assets/images";
import {
  IconDeleteBin,
  IconWarehouse,
  IconTrash,
  IconCautionGreen,
  IconCautionYellow,
  IconInfo,
  IconUTCall,
  IconMail,
} from "assets/icons";
import { Medium } from "assets/images";
import { Checkbox, Paper, InputBase } from "@material-ui/core";
import * as Utils from "../../utils/format.helper";
import ModalConfirm from "./components/ModalConfirm";
import ModalBranchSelect from "./components/ModalSelectBranch";
import Skeleton from "react-loading-skeleton";
import firebase from "../../firebase/firebase";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { Modal, DialogContent } from "@material-ui/core";
import { set } from "lodash";
import ModalAccessDenied from "components/ModalAccessDenied/ModalAccessDenied";
import ModalErrorPurchase from "components/ModalErrorPurchase/ModalErrorPurchase";
import { setStorage, getStorage } from "utils/storage.helper";
import { MENU } from "constants/menu";

class BucketListPage extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      screen: null,
      cartId: null,
      readyStock: true,
      modalConfirm: false,
      modalSelect: false,
      branchList: [],
      branchDescription: null,
      branchAddress: null,
      itemSelect: null,
      purchaseSummary: null,
      deleteAll: false,
      selectAll: false,
      allCartList: null,
      customerCode: null,
      poCustomer: null,
      poCustomerDate: null,
      branchId: null,
      branchCode: null,
      filename: null,
      dataNotNull: true,
      checkStock: false,
      message: false,
      indexDelete: null,
      paramDelete: 0,
      tax: 0,
      openModalErrorChartEmpty: false,
      openModalErrorChartSelect: false,
      openModalErrorChecklist: false,
      openModalErrorChecklistAll: false,
      openModalErrorPurchase: false,
      openModalErrorBranch: false,
    };
  }

  setAnalyticClevertap = (action, event, screen, product) => {
    if (this.props.user) {
      const { userName } = this.props.user;
      if (product !== null) {
        window.clevertapEventProduct(`${product[0] + "_LogedIn"}`, product[1]);
      } else {
        window.clevertapEvent(`${event + "_LogedIn"}`, this.props.user);
      }
      firebase.analytics().setUserId(userName);
      firebase.analytics().setUserProperties(userName, "username:" + userName + `||View: ${screen}`);
      firebase.analytics().setCurrentScreen(screen, screen);
      firebase.analytics().logEvent(`${event + "_LogedIn"}`);
      firebase.analytics().setUserProperties("username", userName);
      firebase.analytics().setUserProperties(action, `${event + "_LogedIn"}`);
    }
  };

  async componentDidMount() {
    const { user } = this.props;
    this.fetchData();
    await this.props.fetchCartByUserId(user.userId, user.tokenResponse.accessToken);
    await this.props.fetchAttributeName('tax')
    const countCart = this.props.dataCart != null ? this.props.dataCart.data.totalCart : 0;
    if (countCart != 0) {
      this.setAnalyticClevertap("view", "View_BucketList_Screen", "View_BucketList_Screen", [
        "View_BucketList_Screen",
        { Product_Count: countCart },
      ]);
    }
    if (this.props.attributeName) {
      const selectedTax = this.props.attributeName.data.filter(item => item.display == true)
      this.setState({ tax: parseFloat(String(selectedTax[0].value)) / 100 })
    }
    window.scrollTo(0, 0);
  }

  fetchData = async () => {
    if (this.props?.history?.location.state != undefined) {
      let cartId = this.props?.history?.location.state;
      this.initApi(true, cartId);
    } else {
      this.initApi(false, null);
    }
  };

  _selectBranch = () => {
    this.setAnalyticClevertap("click", "Click_ModalSelectBranchBucket", "View_BucketList_Screen", null);
    this.setState({ modalSelect: true });
  };

  _setItemBranch = async (item) => {
    this.setAnalyticClevertap("click", "Click_ChooseBranchBucket", "View_BucketList_Screen", [
      "Click_ChooseBranchBucket",
      { Branch_Name: item.description },
    ]);
    this.setState({ branchId: item.id });
    const body = {
      poCustomer: this.state.poCustomer,
      filename: this.state.filename,
      poCustomerDate: this.state.poCustomerDate,
      carts: [],
      branchId: item.id,
    };
    for (let i = 0; this.state.allCartList.length > i; i++) {
      const array = {
        productId: this.state.allCartList[i].productId,
        itemQty: this.state.allCartList[i].itemQty,
        price: this.state.allCartList[i].price,
      };
      body.carts.push(array);
    }
    const { user } = this.props;
    await this.props.fetchPutCartListByCartId(this.state.cartId, body, user.tokenResponse.accessToken);
    await this.fetchData();
    this.setState({ modalSelect: false });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize.bind(this));
  }
  resize = () => {
    this.setState({ screen: window.innerWidth });
  };

  _currency = (number) => {
    const data = Number(number);
    return data.toFixed(0);
  };

  initApi = async (value, cartId) => {
    const { user } = this.props;
    const accessToken = user.tokenResponse.accessToken;
    const userId = user.userId;
    const data = await this.props.fetchGetBranchList(accessToken);
    if (data != null && data !== "400") {
      this.setState({ branchList: data.data });
    }
    if (value) {
      this.setState({ cartId: cartId });
      await this.props.fetchCartListByCartId(cartId, accessToken);
      const { dataCartList } = this.props;
      if (dataCartList != null) {
        if (getStorage("TEMP_CART")) {
          let newArr = dataCartList.data.cartDetail
          for (let i = 0; i < getStorage("TEMP_CART").length; i++) {
            for (let c = 0; c < newArr.length; c++) {
              if (getStorage("TEMP_CART")[i].cartDetailId === newArr[c].cartDetailId) {
                newArr[c].itemQty = getStorage("TEMP_CART")[i].itemQty
              }
            }
          }
          this.addToCart(dataCartList.data, newArr);
          setStorage('TEMP_CART', newArr)
        } else {
          this.addToCart(dataCartList.data, dataCartList.data.cartDetail);
        }
      }
    } else {
      await this.props.fetchCartByUserId(userId, accessToken);
      const { dataCart } = this.props;
      if (dataCart != null) {
        this.setState({ cartId: dataCart.data.cartId });
        await this.props.fetchCartListByCartId(dataCart.data.cartId, accessToken);
        const { dataCartList } = this.props;
        if (dataCartList != null) {
          if (getStorage("TEMP_CART")) {
            let newArr = dataCartList.data.cartDetail
            for (let i = 0; i < getStorage("TEMP_CART").length; i++) {
              for (let c = 0; c < newArr.length; c++) {
                if (getStorage("TEMP_CART")[i].cartDetailId === newArr[c].cartDetailId) {
                  newArr[c].itemQty = getStorage("TEMP_CART")[i].itemQty
                }
              }
            }
            setStorage('TEMP_CART', newArr)
            this.addToCart(dataCartList.data, newArr);
          } else {
            this.addToCart(dataCartList.data, dataCartList.data.cartDetail);
          }
        }
      }
    }
  };

  handlePurchaseSummary = (data) => {
    const newDataSummary = data.filter(item => item.select == true);
    let total = 0;
    for (let i = 0; i < newDataSummary.length; i++) {
      total += newDataSummary[i].price * newDataSummary[i].itemQty;
    }
    let newSummary = {
      subTotalPrice: total,
      ppn: total * this.state.tax,
      totalPrice: total + (total * this.state.tax),
    };
    this.setState({ purchaseSummary: newSummary });
  }

  checkStock = async () => {
    if (this.state.allCartList != null) {
      const { user } = this.props;
      let partNumber = [];
      for (let i = 0; this.state.allCartList.length > i; i++) {
        partNumber.push(this.state.allCartList[i].partNumber);
      };
      const data = {
        customerCode: user.customerCode,
        plantCode: this.props.dataCartList.data.branchCode,
        partNumber,
      };
      await this.props.fetchStock(user.tokenResponse.accessToken, data);
      const { stockList } = this.props;
      if (stockList !== null) {
        const dataCheckBox = [];
        const priceSum = [];
        for (let i = 0; stockList.length > i; i++) {
          if (this.state.allCartList[i]?.itemQty > this._currency(stockList[i]?.stock)) {
            const array = {
              id: i,
              select: false,
              readyStock: false,
              stock: stockList[i].stock,
              productId: this.state.allCartList[i].productId,
              imageThumbnailUrl: this.state.allCartList[i].imageThumbnailUrl,
              percentDiscount: this.state.allCartList[i].percentDiscount,
              basePrice: this.state.allCartList[i].basePrice,
              brandName: this.state.allCartList[i].brandName,
              cartDetailId: this.state.allCartList[i].cartDetailId,
              currency: this.state.allCartList[i].currency,
              display: this.state.allCartList[i].display,
              itemQty: this.state.allCartList[i].itemQty,
              partDescription: this.state.allCartList[i].partDescription,
              partNumber: this.state.allCartList[i].partNumber,
              price: this.state.allCartList[i].price,
              productHierarchy: this.state.allCartList[i].productHierarchy,
              sku: this.state.allCartList[i].sku,
              weight: this.state.allCartList[i].weight,
            };
            dataCheckBox.push(array);
            this.setState({ readyStock: false });
          } else {
            const array = {
              id: i,
              select: true,
              readyStock: true,
              stock: stockList[i].stock,
              productId: this.state.allCartList[i].productId,
              imageThumbnailUrl: this.state.allCartList[i].imageThumbnailUrl,
              percentDiscount: this.state.allCartList[i].percentDiscount,
              basePrice: this.state.allCartList[i].basePrice,
              brandName: this.state.allCartList[i].brandName,
              cartDetailId: this.state.allCartList[i].cartDetailId,
              currency: this.state.allCartList[i].currency,
              display: this.state.allCartList[i].display,
              itemQty: this.state.allCartList[i].itemQty,
              partDescription: this.state.allCartList[i].partDescription,
              partNumber: this.state.allCartList[i].partNumber,
              price: this.state.allCartList[i].price,
              productHierarchy: this.state.allCartList[i].productHierarchy,
              sku: this.state.allCartList[i].sku,
              weight: this.state.allCartList[i].weight,
            };
            dataCheckBox.push(array);
            const loopPrice = {
              price: this.state.allCartList[i].price,
              itemQty: this.state.allCartList[i].itemQty,
            };
            priceSum.push(loopPrice);
          };
        };
        this.setState({ allCartList: dataCheckBox });
        this.handlePurchaseSummary(dataCheckBox);
      }
    }
    this.setState({ checkStock: true });
  };

  addToCart = (cart, cartDetail) => {
    const { user } = this.props;
    this.setState({
      customerCode: user.customerCode,
      poCustomer: cart.poCustomer,
      poCustomerDate: cart.poCustomerDate,
      branchId: cart.branchId,
      branchCode: cart.branchCode,
      filename: cart.fileName,
      branchDescription: cart.branchDescription,
      branchAddress: cart.branchAddress,
    });
    const dataCheckBox = [];
    for (let i = 0; cartDetail.length > i; i++) {
      const array = {
        id: i,
        select: true,
        readyStock: null,
        stock: null,
        productId: cartDetail[i].productId,
        imageThumbnailUrl: cartDetail[i].imageThumbnailUrl,
        percentDiscount: cartDetail[i].percentDiscount,
        basePrice: cartDetail[i].basePrice,
        brandName: cartDetail[i].brandName,
        cartDetailId: cartDetail[i].cartDetailId,
        currency: cartDetail[i].currency,
        display: cartDetail[i].display,
        itemQty: cartDetail[i].itemQty,
        partDescription: cartDetail[i].partDescription,
        partNumber: cartDetail[i].partNumber,
        price: cartDetail[i].price,
        productHierarchy: cartDetail[i].productHierarchy,
        sku: cartDetail[i].sku,
        weight: cartDetail[i].weight,
      };
      dataCheckBox.push(array);
    }
    this.setState({ allCartList: dataCheckBox, fixCartList: dataCheckBox });
    if (this.props.dataCartList != {} && cart.branchCode != null) {
      this.checkStock();
    } else {
      const newDataCheckbox = dataCheckBox.filter(item => item.select == true);
      let total = 0;
      for (let j = 0; j < newDataCheckbox.length; j++) {
        total += newDataCheckbox[j].price * newDataCheckbox[j].itemQty;
      };
      let newSum = {
        subTotalPrice: total,
        ppn: total * this.state.tax,
        totalPrice: total + (total * this.state.tax),
      };
      this.setState({ purchaseSummary: newSum });
    }
  };

  _checklist = (event, index, partDescription) => {
    if (event.target.checked) {
      this.setAnalyticClevertap("click", "Click_SelectBucketItem", "View_BucketList_Screen", [
        "Click_SelectBucketItem",
        { Product_Name: partDescription },
      ]);
    } else {
      this.setAnalyticClevertap("click", "Click_UnselectBucketItem", "View_BucketList_Screen", [
        "Click_UnselectBucketItem",
        { Product_Name: partDescription },
      ]);
    }
    const { customerCode } = this.props.user;
    let newArr = this.state.allCartList.map((item, i) => {
      if (index === i) {
        if (customerCode == "ONETIMESTD") {
          if (this.state.allCartList[i].readyStock == false && event.target.checked == true) {
            this.setState({ openModalErrorChecklist: true });
          }
        }
        this.handlePurchaseSummary(this.state.allCartList)
        return {
          ...item,
          ["select"]:
            customerCode == "ONETIMESTD"
              ? this.state.allCartList[i].readyStock == false
                ? false
                : event.target.checked
              : event.target.checked,
        };
      } else {
        return item;
      }
    });
    let newCart = [];
    for (let i = 0; newArr.length > i; i++) {
      if (newArr[i].select) {
        newCart.push(newArr[i]);
      }
    }
    this.setState({ allCartList: newArr });
    this.handlePurchaseSummary(newArr);
    this.setState({ selectAll: event.target.checked ? false : false });
  };

  _checklistAll = (event) => {
    if (event.target.checked) {
      this.setAnalyticClevertap("click", "Click_SelectAllBucketItem", "View_BucketList_Screen", null);
    } else {
      this.setAnalyticClevertap("click", "Click_UnselectAllBucketItem", "View_BucketList_Screen", null);
    }
    const { customerCode } = this.props.user;
    const selectAll = event.target.checked;
    const dataCheckBox = [];
    const isNotReadyAll = this.state.allCartList.filter(item => item.readyStock == false);
    if (customerCode == "ONETIMESTD" && isNotReadyAll.length > 0) {
      this.setState({ openModalErrorChecklistAll: true });
      this.setState({ selectAll: false });
    } else {
      this.setState({ selectAll: event.target.checked });
    }
    for (let i = 0; this.state.allCartList.length > i; i++) {
      const array = {
        id: i,
        select:
          customerCode == "ONETIMESTD"
            ? this.state.allCartList[i].readyStock == false
              ? false
              : selectAll
            : selectAll,
        readyStock: this.state.allCartList[i].readyStock,
        stock: this.state.allCartList[i].stock,
        productId: this.state.allCartList[i].productId,
        imageThumbnailUrl: this.state.allCartList[i].imageThumbnailUrl,
        percentDiscount: this.state.allCartList[i].percentDiscount,
        basePrice: this.state.allCartList[i].basePrice,
        brandName: this.state.allCartList[i].brandName,
        cartDetailId: this.state.allCartList[i].cartDetailId,
        currency: this.state.allCartList[i].currency,
        display: this.state.allCartList[i].display,
        itemQty: this.state.allCartList[i].itemQty,
        partDescription: this.state.allCartList[i].partDescription,
        partNumber: this.state.allCartList[i].partNumber,
        price: this.state.allCartList[i].price,
        productHierarchy: this.state.allCartList[i].productHierarchy,
        sku: this.state.allCartList[i].sku,
        weight: this.state.allCartList[i].weight,
      };
      dataCheckBox.push(array);
    }
    this.setState({ allCartList: dataCheckBox });
    this.handlePurchaseSummary(dataCheckBox);
  };

  _deleteChecklist = async () => {
    const { user } = this.props;
    let myArray = this.state.allCartList;
    var newArray = myArray.filter((item) => item.select != true);
    const dataCheckBox = [];
    for (let i = 0; newArray.length > i; i++) {
      const array = {
        id: i,
        select: newArray[i].checked,
        readyStock: newArray[i].readyStock,
        stock: newArray[i].stock,
        productId: newArray[i].productId,
        imageThumbnailUrl: newArray[i].imageThumbnailUrl,
        percentDiscount: newArray[i].percentDiscount,
        basePrice: newArray[i].basePrice,
        brandName: newArray[i].brandName,
        cartDetailId: newArray[i].cartDetailId,
        currency: newArray[i].currency,
        display: newArray[i].display,
        itemQty: newArray[i].itemQty,
        partDescription: newArray[i].partDescription,
        partNumber: newArray[i].partNumber,
        price: newArray[i].price,
        productHierarchy: newArray[i].productHierarchy,
        sku: newArray[i].sku,
        weight: newArray[i].weight,
      };
      dataCheckBox.push(array);
    }
    this.setState({ allCartList: dataCheckBox });
    let newCart = [];
    for (let i = 0; dataCheckBox.length > i; i++) {
      if (dataCheckBox[i].select) {
        newCart.push(dataCheckBox[i]);
      }
    }
    const body = {};
    await this.props.deleteCart(this.state.cartId, body, user.tokenResponse.accessToken);
    this.setState({ selectAll: false, dataNotNull: false, deleteAll: true });
    this.props.push(MENU.HOME);
    localStorage.removeItem("TEMP_CART");
    this.setState({ message: false, indexDelete: null, paramDelete: 0 });
  };

  _deleteOneCart = async (index) => {
    const { user } = this.props;
    let cartDetailId = null;
    let partDescription = null;
    let myArray = this.state.allCartList;
    let deleteCart = myArray.filter((item) => item.id == index);
    deleteCart.map((item) => {
      cartDetailId = item.cartDetailId;
      partDescription = item.partDescription;
    });
    var newArray = myArray.filter((item) => item.id != index);
    const dataCheckBox = [];
    for (let i = 0; newArray.length > i; i++) {
      const array = {
        id: i,
        select: newArray[i].select,
        readyStock: newArray[i].readyStock,
        stock: newArray[i].stock,
        productId: newArray[i].productId,
        imageThumbnailUrl: newArray[i].imageThumbnailUrl,
        percentDiscount: newArray[i].percentDiscount,
        basePrice: newArray[i].basePrice,
        brandName: newArray[i].brandName,
        cartDetailId: newArray[i].cartDetailId,
        currency: newArray[i].currency,
        display: newArray[i].display,
        itemQty: newArray[i].itemQty,
        partDescription: newArray[i].partDescription,
        partNumber: newArray[i].partNumber,
        price: newArray[i].price,
        productHierarchy: newArray[i].productHierarchy,
        sku: newArray[i].sku,
        weight: newArray[i].weight,
      };
      dataCheckBox.push(array);
      if (getStorage("TEMP_CART")) {
        let newTempCart = getStorage("TEMP_CART").filter((item) => item.cartDetailId !== deleteCart[0].cartDetailId);
        setStorage('TEMP_CART', newTempCart)
      }
      if (newArray[i].itemQty > newArray[i].stock) {
        this.setState({ readyStock: false });
      }
    }
    this.setState({ allCartList: dataCheckBox });
    this.handlePurchaseSummary(dataCheckBox);
    await this.props.deleteCartDetail(cartDetailId, user.tokenResponse.accessToken);
    this.setAnalyticClevertap("action", "Action_DeleteBucketItem_Success", "View_BucketList_Screen", [
      "Action_DeleteBucketItem_Success",
      { Product_Name: partDescription },
    ]);
    if (this.state.allCartList.length === 0) {
      localStorage.removeItem("TEMP_CART");
      this.props.push(MENU.HOME);
    }
    this.setState({ message: false, indexDelete: null, paramDelete: 0 });
  };

  updateQty = (value, qty, stock, index, partDescription) => {
    const { user } = this.props;
    if (value == "tambah") {
      this.setAnalyticClevertap("click", "Click_PlusQuantityBucketItem", "View_BucketList_Screen", [
        "Click_PlusQuantityBucketItem",
        { Product_Name: `${partDescription}_(${qty})` },
      ]);
      let newArr = this.state.allCartList.map((item, i) => {
        if (user.customerCode == "ONETIMESTD") {
          if (index === i && qty + 1 <= stock) {
            this.setState({ readyStock: true });
            return {
              ...item,
              ["itemQty"]: item.itemQty + 1,
              ["select"]: true,
            };
          } else if (index === i && qty + 1 > stock) {
            this.setState({ readyStock: false });
            return {
              ...item,
              ["itemQty"]: item.itemQty + 1,
              ["readyStock"]: false,
              ["select"]: false,
            };
          } else {
            return item;
          }
        } else {
          if (index === i && qty + 1 <= stock) {
            this.setState({ readyStock: true });
            return {
              ...item,
              ["itemQty"]: item.itemQty + 1,
            };
          } else if (index === i && qty + 1 > stock) {
            this.setState({ readyStock: false });
            return {
              ...item,
              ["itemQty"]: item.itemQty + 1,
              ["readyStock"]: false,
            };
          } else {
            return item;
          }
        }
      });
      this.setState({ allCartList: newArr });
      setStorage('TEMP_CART', newArr)
      this.handlePurchaseSummary(newArr);
    } else if (value == "kurang") {
      this.setAnalyticClevertap("click", "Click_MinQuantityBucketItem", "View_BucketList_Screen", [
        "Click_MinQuantityBucketItem",
        { Product_Name: `${partDescription}_(${qty})` },
      ]);
      let newArr = this.state.allCartList.map((item, i) => {
        if (index === i && qty - 1 == stock) {
          this.setState({ readyStock: true });
          return {
            ...item,
            ["itemQty"]: item.itemQty - 1,
            ["readyStock"]: stock != 0 ? true : false,
          };
        } else if (index === i && qty - 1 < stock) {
          if (item.itemQty > 0) {
            this.setState({ readyStock: true });
          };
          return {
            ...item,
            ["itemQty"]: item.itemQty != 0 ? item.itemQty - 1 : 0,
            ["readyStock"]: qty - 1 <= stock && stock != 0 ? true : false,
          };
        } else if (index === i && qty - 1 > stock) {
          this.setState({ readyStock: false });
          return {
            ...item,
            ["itemQty"]: item.itemQty - 1,
          };
        } else {
          return item;
        }
      });
      this.setState({ allCartList: newArr });
      setStorage('TEMP_CART', newArr)
      this.handlePurchaseSummary(newArr);
    }
  };

  _handleCheckout = () => {
    this.setAnalyticClevertap("click", "Click_CheckoutBucket", "View_BucketList_Screen", null);
    if (this.state.branchCode == null) {
      this.setState({ openModalErrorBranch: true });
    } else if (this.state.allCartList.filter((item) => item.select === true).length < 1) {
      this.setState({ openModalErrorChartSelect: true });
    } else if (this.state.branchId !== null && this.state.branchId !== undefined && this.state.branchId !== "") {
      this.setState({ modalConfirm: true });
    } else {
      return null;
    }
  };

  checkoutCart = async (cart) => {
    const body = {
      poCustomer: this.state.poCustomer,
      filename: this.state.filename,
      poCustomerDate: this.state.poCustomerDate,
      carts: [],
      branchId: this.state.branchId,
    };
    for (let i = 0; this.state.allCartList.length > i; i++) {
      if (this.state.allCartList[i].select) {
        const array = {
          productId: this.state.allCartList[i].productId,
          itemQty: this.state.allCartList[i].itemQty,
          price: this.state.allCartList[i].price,
        };
        body.carts.push(array);
      }
    }
    const { user } = this.props;
    const accessToken = user.tokenResponse.accessToken;
    if (body.carts.length == 0) {
      this.setState({ modalConfirm: false, openModalErrorChartSelect: true });
    } else if (!this.state.dataNotNull) {
      this.setState({ modalConfirm: false, openModalErrorChartEmpty: true });
    } else {
      await this.props.fetchPutCartListByCartId(cart, body, accessToken);
      const { dataPut } = this.props;
      if (dataPut != null) {
        this.setState({ modalConfirm: false });
        this.props.push(MENU.BILLING, cart);
        this.setAnalyticClevertap("action", "Action_CheckoutBucket_Success", "View_BucketList_Screen", null);
        localStorage.removeItem("TEMP_CART");
      } else {
        this.setAnalyticClevertap("action", "Action_CheckoutBucket_Error", "View_BucketList_Screen", null);
      }
    }
  };

  _renderModalErrorPurchase = () => {
    return (
      <ModalErrorPurchase
        isOpen={this.state.openModalErrorPurchase}
        onSubmit={() => this.props.push(MENU.HOME)}
        errorText={"Kamu tidak dapat mengakses laman ini"}
        title={"Huhu sayang sekali..."}
      />
    );
  };

  _renderModalDelete = () => {
    return (
      <Modal
        className='modal-confirm-del'
        open={this.state.message}
        onClose={() => this.setState({ message: false, indexDelete: null, paramDelete: 0 })}
      >
        <DialogContent style={{ overflow: "hidden" }} className='container-modal-shippment'>
          <div className='confirm-modal-body'>
            <p className='titleConfirm'>Kamu yakin?</p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img src={IconCautionYellow} className='iconModal' />
            </div>
            <h5 className='titleAvailable'>Kamu akan menghapus barang ini</h5>
            <div className='header-button-upload'>
              <div
                className='cardCancel'
                style={{ cursor: "pointer" }}
                onClick={() => this.setState({ message: false, indexDelete: null, paramDelete: 0 })}
              >
                <p className='textSave'>Kembali</p>
              </div>
              {this.state.paramDelete == 1 ? (
                <div
                  className='cardSave'
                  style={{ cursor: "pointer" }}
                  onClick={() => this._deleteOneCart(this.state.indexDelete)}
                >
                  <p className='textSave'>Lanjutkan</p>
                </div>
              ) : (
                <div className='cardSave' style={{ cursor: "pointer" }} onClick={() => this._deleteChecklist()}>
                  <p className='textSave'>Lanjutkan</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Modal>
    );
  };

  _renderHeader = () => {
    if (this.props.dataCartList != null) {
      return (
        <Row className='headerBucketList'>
          <Col>
            <h3 className='styleBLBold'>Daftar Produk</h3>
          </Col>
        </Row>
      );
    } else {
      return (
        <Row className='headerBucketList'>
          <Col>
            <h3 className='skTitleBL'>
              <Skeleton />
            </h3>
          </Col>
        </Row>
      );
    }
  };

  _renderSkeleton = () => {
    return (
      <Row className='bucketList'>
        <Col xl='12' lg='12' md='12' className='productList'>
          <Row>
            <div style={{ paddingLeft: "3px" }}>
              <Skeleton />
            </div>
            <div className='imageProduct'>
              <Skeleton width={100} height={100} />
            </div>
            <Col className='pl-0 productDescription'>
              <p className='mb-1 skProductBL'>
                <Skeleton />
              </p>
              <p className='skTitleProductBL'>
                <Skeleton height={25} />
              </p>
              <p className='mb-1 skProductBL'>
                <Skeleton />
              </p>
              <p className='mb-1 skProductBL'>
                <Skeleton />
              </p>
            </Col>
            <Col style={{ display: "flex", justifyContent: "flex-end", padding: 0 }}>
              <div className='skCardLabel'>
                <Skeleton />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };
  _renderListProduct = () => {
    const { user } = this.props;
    if (
      this.state.allCartList != null &&
      this.state.allCartList != undefined &&
      !this.state.openModalErrorPurchase &&
      !this.props.loading
    ) {
      return (
        <Row className='bucketList'>
          {!this.state.deleteAll ? (
            <Col>
              <Row style={{ alignItems: "flex-start" }}>
                <Checkbox
                  style={{ color: "#5ACC4D", padding: 0, marginLeft: -2 }}
                  checked={this.state.selectAll}
                  onChange={(event) => this._checklistAll(event)}
                />
                <Row className='rowSelectDelete'>
                  <p className='textSelectAll'>Pilih Semua</p>
                  {this.state.selectAll ? (
                    <div onClick={() => this.setState({ message: true })} className='rowDeleteBin'>
                      <img src={IconDeleteBin} width={20} height={20} style={{ cursor: "pointer" }} />
                      <p className='textDeleteBin'>Hapus</p>
                    </div>
                  ) : null}
                </Row>
              </Row>
            </Col>
          ) : null}
          {this.state.allCartList.map((item, index) => {
            return (
              <Col key={index} xl='12' lg='12' md='12' className='productList'>
                <Row>
                  <div style={{ paddingLeft: "3px" }}>
                    <Checkbox
                      style={{
                        color: "#5ACC4D",
                        paddingTop: 0,
                        marginTop: -2,
                      }}
                      checked={item.select && item.itemQty > 0}
                      onChange={(event) => this._checklist(event, index, item.partDescription)}
                      value={"checked"}
                    />
                  </div>
                  <div className='imageProduct'>
                    <img
                      className='imageBL'
                      src={
                        item.imageThumbnailUrl && item.imageThumbnailUrl != "string" ? item.imageThumbnailUrl : brakeImg
                      }
                    />
                    <span className='partNumber'>{item.partNumber}</span>
                  </div>
                  <Col className='pl-0 productDescription'>
                    <div className='default-content-column'>
                      <p className='title-kategory-order'>{item.brandName}</p>
                    </div>
                    <p className='titleProductBL'>{item.partDescription}</p>
                    {item.price !== item.basePrice
                      && item.basePrice !== 0
                      && item.percentDiscount !== 0
                      && item.percentDiscount !== null
                      && item.percentDiscount !== "-Infinity" ? (
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <p
                          className='mb-1 title-kategory-order'
                          style={{ fontSize: 12, textDecoration: "line-through" }}
                        >
                          Rp {Utils.formatCurrency(item.basePrice)}
                        </p>
                        <p className='mb-1 titlePriceDiscountBL' style={{ fontSize: 14, color: "rgb(20, 143, 15)" }}>
                          {item.percentDiscount}
                        </p>
                      </div>
                    ) : null}
                    <p className='mb-1 titlePriceDiscountBL'>Rp {Utils.formatCurrency(item.price)}</p>
                    <Row className='cardMinPlusBL'>
                      {item.itemQty == 1 ? (
                        <div className='btnMin'>
                          <TiMinus style={{ cursor: "default", color: "#949494" }} />
                        </div>
                      ) : (
                        <div
                          className='btnMin'
                          onClick={() =>
                            this.updateQty("kurang", item.itemQty, item.stock, index, item.partDescription)
                          }
                        >
                          <TiMinus style={{ cursor: "pointer" }} />
                        </div>
                      )}
                      <div className='totalOrder'>
                        <h4 className='mb-0 teksTotalOrder'>{item.itemQty}</h4>
                      </div>
                      {user.customerCode != "ONETIMESTD" || item.itemQty < item.stock ? (
                        <div
                          className='btnPlus'
                          onClick={() => this.updateQty("tambah", item.itemQty, item.stock, index, item.partDescription)}
                        >
                          <TiPlus style={{ cursor: "pointer" }} />
                        </div>
                      ) : (
                        <div className='btnMin'>
                          <TiPlus style={{ cursor: "default", color: "#949494" }} />
                        </div>
                      )}
                      <div className='lineVertical'></div>
                      <div className='btnPlus'>
                        <img
                          src={IconTrash}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            this.setAnalyticClevertap(
                              "click",
                              "Click_ModalDeleteBucketItem",
                              "View_BucketList_Screen",
                              ["Click_ModalDeleteBucketItem", { Product_Name: item.partDescription }]
                            );
                            this.setState({ message: true, paramDelete: 1, indexDelete: index });
                          }}
                        ></img>
                      </div>
                    </Row>
                  </Col>
                  <Col className='cardLabel' style={this.state.checkStock ? {} : { display: "none" }}>
                    <h5
                      className='titleLabel'
                      style={
                        item.readyStock && item.itemQty > 0
                          ? { backgroundColor: "#CDF7CC", color: "#148F0F" }
                          : { backgroundColor: "#F2F2F2", color: "#404040" }
                      }
                    >
                      {item.readyStock && item.itemQty > 0 ? "Tersedia" : "Tidak Tersedia"}
                    </h5>
                  </Col>
                </Row>
              </Col>
            );
          })}
        </Row>
      );
    }
    return this._renderSkeleton();
  };
  _renderSkeletonPromotion = () => {
    return (
      <div className='cardPromotion'>
        <Col className='p-0'>
          <Col className='kontenCardPromotion'>
            <Col lg='12' md='12' className='pl-0 skTitleBL'>
              <Skeleton height={20} />
            </Col>
            <Col className='p-0 '>
              <Row className='subTotal'>
                <Skeleton width={100} height={15} />
                <Skeleton width={100} height={15} />
              </Row>
              <Row className='subTotal'>
                <Skeleton width={100} height={15} />
                <Skeleton width={100} height={15} />
              </Row>
              <hr
                style={{
                  borderTop: "1px dashed #707070",
                  opacity: "0.5",
                  marginTop: "1rem",
                  width: "100%",
                  marginBottom: "1rem",
                }}
              ></hr>
              <Row className='subTotal'>
                <Skeleton width={100} height={15} />
                <Skeleton width={100} height={15} />
              </Row>
            </Col>
          </Col>
          <Col lg='12' className='bgCheckoutBL'>
            <div className='btnCheckoutBL'>
              <Skeleton width={150} height={15} />
            </div>
          </Col>
        </Col>
      </div>
    );
  };

  _renderPromotion = () => {
    if (
      this.state.purchaseSummary &&
      this.state.purchaseSummary !== null &&
      !this.state.openModalErrorPurchase &&
      !this.props.loading
    ) {
      return (
        <div className='cardPromotion'>
          <Col className='p-0'>
            <Col className='kontenCardPromotion'>
              <Col lg='12' md='12' className='pl-0 teksSummary'>
                Ringkasan Pembelian
              </Col>
              <Col className='p-0 '>
                <Row className='subTotalBL'>
                  <div className='teksSubTotalBL'>Sub Total</div>
                  <div className='hargaSubTotalBL'>
                    Rp {!this.state.deleteAll ? Utils.formatCurrency(this.state.purchaseSummary.subTotalPrice) : 0}
                  </div>
                </Row>
                <Row className='subTotalBL'>
                  <div className='teksSubTotalBL'>PPN</div>
                  <div className='hargaSubTotalBL'>
                    Rp {!this.state.deleteAll ? Utils.formatCurrency(this.state.purchaseSummary.ppn.toFixed(0)) : 0}
                  </div>
                </Row>
                <hr
                  style={{
                    borderTop: "1px dashed #707070",
                    opacity: "0.5",
                    marginTop: "1rem",
                    width: "100%",
                    marginBottom: "0",
                  }}
                ></hr>
                <Row className='subTotalBL'>
                  <div className='teksSubTotalBL'>Total Pembayaran</div>
                  <div className='hargaSubTotalBL1'>
                    Rp {!this.state.deleteAll ? Utils.formatCurrency(this.state.purchaseSummary.totalPrice) : 0}
                  </div>
                </Row>
              </Col>
            </Col>
            <Col lg='12' className='bgCheckoutBL'>
              <button
                className='btnCheckoutBL'
                onClick={() => this._handleCheckout()}
                disabled={this.state.allCartList == null}
              >
                <p className='titleCheckout'>Lanjutkan Pembelian</p>
              </button>
            </Col>
          </Col>
        </div>
      );
    }
    return this._renderSkeletonPromotion();
  };

  _renderBreadcrumb = () => {
    const breadcrums = [
      {
        url: MENU.HOME,
        name: "Part Online Transaction",
      },
    ];
    return <Breadcrumb linkBreadcrumb={breadcrums} typography={"Keranjang"} />;
  };

  _renderBranchSupply = () => {
    if (this.props.loading) {
      return (
        <div>
          <h3 className='skTitleBL'>
            <Skeleton />
          </h3>
          <div className='cardBranch'>
            <div>
              <Skeleton height={50} width={50} circle={true} />
            </div>

            <h5 className='skTitleSelect'>
              <Skeleton height={50} />
            </h5>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <div className='btnSelectBranch'>
                <p className='titleCheckout'>
                  <Skeleton />
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <h3 className='styleBLBold'>Cabang UT</h3>
        <div className={this.state.branchCode !== null ? "card-item-titleBL" : "cardBranch"}>
          <div>
            <img src={IconWarehouse} alt='warehouse-icon' width='40' height='40' />
          </div>
          {this.state.branchCode !== null ? (
            <div style={{ flex: 1 }}>
              <h5 className='titleSelect' style={{ textAlign: "left" }}>
                {this.state.branchDescription.toUpperCase().replace("UT BRANCH ", "")}
              </h5>
              <p style={{ textAlign: "left", marginLeft: 20, fontSize: 12, color: "#707070" }}>
                {this.state.branchAddress}
              </p>
            </div>
          ) : (
            <h5 className='titleSelect' style={{ textAlign: "left" }}>
              Point Cabang UT
            </h5>
          )}

          <div style={{ display: "flex", justifyContent: "center" }}>
            {this.state.branchCode !== null ? (
              <p
                className='titleCheckout'
                style={{ cursor: "pointer", color: "#007bff", margin: "auto", marginRight: 20 }}
                onClick={() => this._selectBranch()}
              >
                Ubah
              </p>
            ) : (
              <div style={{ cursor: "pointer" }} className='btnSelectBranch' onClick={() => this._selectBranch()}>
                <p className='titleCheckout'>Pilih Cabang</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  _renderNotif = () => {
    if (!this.props.loading) {
      if (this.state.allCartList != null) {
        var show = true;
        for (let i = 0; this.state.allCartList.length > i; i++) {
          if (this.state.allCartList[i].itemQty > this.state.allCartList[i].stock) {
            show = false;
          }
        }
        if (show) {
          this.setState({ readyStock: true });
        } else {
          this.setState({ readyStock: false });
        }
        return (
          <div>
            {show ? (
              <div style={{ backgroundColor: "#5acc4d26" }} className='cardNotif'>
                <div>
                  <img className='iconCoution' src={IconCautionGreen} />
                </div>
                <h6 className='titleNotif'>
                  Semua item Anda tersedia, silahkan ke langkah selanjutnya dengan cara klik tombol Lanjutkan Pembelian.
                </h6>
              </div>
            ) : (
              <div className='cardNotif'>
                <div>
                  <img className='iconCoution' src={IconCautionYellow} />
                </div>
                <h6 className='titleNotif'>
                  Ada barang yang tidak tersedia, apakah Anda yakin untuk melanjutkan pembelian?
                </h6>
              </div>
            )}
          </div>
        );
      }
    }
  };
  _renderModalErrorChartSelect = () => {
    return (
      <ModalAccessDenied
        isOpen={this.state.openModalErrorChartSelect}
        isClose={() => this.setState({ openModalErrorChartSelect: false })}
        errorText={"Kamu belum memilih barang kamu"}
        title={"Huhu sayang sekali..."}
      />
    );
  };
  _renderModalErrorChecklist = () => {
    return (
      <ModalAccessDenied
        isOpen={this.state.openModalErrorChecklist}
        isClose={() => this.setState({ openModalErrorChecklist: false })}
        errorText={"Barang yang kamu pilih tidak tersedia"}
        title={"Huhu sayang sekali..."}
      />
    );
  };
  _renderModalErrorChecklistAll = () => {
    return (
      <ModalAccessDenied
        isOpen={this.state.openModalErrorChecklistAll}
        isClose={() => this.setState({ openModalErrorChecklistAll: false })}
        errorText={"Ada barang yang tidak tersedia"}
        title={"Huhu sayang sekali..."}
      />
    );
  };
  _renderModalErrorChartEmpty = () => {
    return (
      <ModalAccessDenied
        isOpen={this.state.openModalErrorChartEmpty}
        isClose={() => this.setState({ openModalErrorChartEmpty: false })}
        errorText={"Keranjang kamu kosong"}
        title={"Huhu sayang sekali..."}
      />
    );
  };
  render() {
    return (
      <>
        <div className='paddingBreadCrumps'>{this._renderBreadcrumb()}</div>
        <Row className='container-content'>
          {this._renderModalErrorPurchase()}
          {this._renderModalErrorChartEmpty()}
          {this._renderModalErrorChartSelect()}
          {this._renderModalErrorChecklist()}
          {this._renderModalErrorChecklistAll()}
          {this._renderModalDelete()}
          <ModalConfirm
            isOpen={this.state.modalConfirm}
            isClose={() => this.setState({ modalConfirm: false })}
            available={this.state.readyStock}
            message={this.state.message}
            cancel={() => this.setState({ modalConfirm: false })}
            continueOrder={() => this.checkoutCart(this.state.cartId)}
            props={this.props}
          />
          <ModalBranchSelect
            isOpen={this.state.modalSelect}
            isClose={() => this.setState({ modalSelect: false })}
            item={this.state.branchList}
            save={(item) => this._setItemBranch(item)}
          />
          <ModalAccessDenied
            isOpen={this.state.openModalErrorBranch}
            isClose={() => this.setState({ openModalErrorBranch: false })}
            errorText={"Silahkan pilih cabang UT untuk melanjutkan proses"}
            title={"Huhu sayang sekali..."}
          />
          <Col md='7' className='containerBucket'>
            {this._renderBranchSupply()}
            {this._renderHeader()}
            {this._renderListProduct()}
          </Col>
          <Col md='5' className='containerPromo'>
            {this._renderPromotion()}
            {this.state.checkStock && this._renderNotif()}
          </Col>
        </Row>
      </>
    );
  }
}
export default BucketListPage;
