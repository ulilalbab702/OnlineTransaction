import React, { useEffect, useState } from "react";
import "./ChangeAddress.scss";
import { Row, Col } from "reactstrap";
import firebase from "../../firebase/firebase";
import ModalAddress from "../../components/ModalAddAddress/ModalAddAddress";
import ModalEditAddress from "../../components/ModalEditAddress/ModalEditAddress";
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import ModalSuccessAddress from "components/ModalSuccessAddress/ModalSuccessAddress";
import { MENU } from "constants/menu";


const ChangeAddress = (props) => {
  const [modalAddress, setModal] = useState(false);
  const [modalEditAddress, setModalEditAddress] = useState(false);
  const [successAddAddress, setSuccessAddAddress] = useState(false);
  const [successEditAddress, setSuccessEditAddress] = useState(false);
  const [address, selectAddress] = useState(null);
  const [districtList, setDistrictList] = useState(null);
  const [postalcodeList, setPostalcodeList] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [idKeyword, setIdKeyword] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [dataEditAddress, setDataEditAddress] = useState(null);
  const [dataCity, setDataCity] = useState(null);
  const [dataProvince, setDataProvince] = useState(null);
  const [dataVillages, setDataVillages] = useState(null);
  const [dataPostalCodes, setDataPostalCodes] = useState(null);

  const setAnalyticClevertap = (action, event, screen, product) => {
    if (props.user.user) {
      const { userName } = props.user.user;
      if (product !== null) {
        window.clevertapEventProduct(`${product[0] + "_LogedIn"}`, product[1]);
      } else {
        window.clevertapEvent(`${event + "_LogedIn"}`, props.user.user);
      }
      firebase.analytics().setUserId(userName);
      firebase.analytics().setUserProperties(userName, "username:" + userName + `||View: ${screen}`);
      firebase.analytics().setCurrentScreen(screen, screen);
      firebase.analytics().logEvent(`${event + "_LogedIn"}`);
      firebase.analytics().setUserProperties("username", userName);
      firebase.analytics().setUserProperties(action, `${event + "_LogedIn"}`);
    }
  };

  useEffect(() => {
    setAnalyticClevertap("view", "View_ChangeAddress_Screen", "View_ChangeAddress_Screen", null);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const { user } = props
    const accessToken = user.user.tokenResponse.accessToken
    const userId = user.user.userId
    async function fetchData() {
      const response = await props.fetchGetBillingList(userId, accessToken);
    }
    fetchData();
  }, [address, props.dataPut, props.dataPostBilling]);

  useEffect(() => {
    if (keyword.length >= 3) {
      async function fetchSearch() {
        await props.fetchSearchDistrict(keyword);
      }
      fetchSearch();
    } else {
      setDistrictList(null)
      props.fetchResetDistrict();
    }
  }, [keyword, idKeyword]);

  useEffect(() => {
    if (postalCode.length == 5) {
      async function fetchPostalCode() {
        await props.fetchSearchPostalCode(postalCode);
      }
      fetchPostalCode();
    } else {
      setPostalcodeList(null)
      props.fetchResetPostalcode();
    }
  }, [postalCode]);

  useEffect(() => {
    if (props.districtList) {
      setDistrictList(props.districtList)
    } else {
      setDistrictList(props.districtList)
    }
    if (props.postalcodeList) {
      setPostalcodeList(props.postalcodeList)
    } else {
      setPostalcodeList(props.postalcodeList)
    }
    setDataCity(props.dataCity)
    setDataProvince(props.dataProvince)
    setDataVillages(props.dataVillages)
    setDataPostalCodes(props.dataPostalCodes)
  }, [props.districtList, props.postalcodeList, props.dataCity, props.dataProvince, props.dataPostalCodes]);

  useEffect(() => {
    var err = String(props.billingAddressListError)
    if (err.includes('401')) {
    }
  })

  useEffect(() => {
    if (props.dataPostBilling?.status) {
      if (props.dataPostBilling?.status == 200) {
        setSuccessAddAddress(true);
        setAnalyticClevertap("action", "Action_AddBillingAddress_Success", "View_ChangeAddress_Screen", null);
      } else if (props.errPostBilling != null) {
        setAnalyticClevertap("action", "Action_AddBillingAddress_Error", "View_ChangeAddress_Screen", null);
      }
    }
  }, [props.dataPostBilling, props.errPostBilling])

  useEffect(() => {
    if (props.dataPut?.status == 200) {
        setSuccessEditAddress(true);
        setAnalyticClevertap("action", "Action_EditBillingAddress_Success", "View_UserProfile_Screen", null);
    } else if (props.errPut != null) {
        setAnalyticClevertap("action", "Action_EditBillingAddress_Error", "View_UserProfile_Screen", null);
    }
}, [props.dataPut])

  const _resetData = () => {
    setPostalCode("")
    setKeyword("")
    setDistrictList(null)
    setPostalcodeList(null)
    setModal(false)
    setModalEditAddress(false)
    props.fetchResetPostalcode();
    props.fetchResetDistrict();
    setDataEditAddress(null)
  }

  const _resetAll = () => {
    setPostalCode("")
    setKeyword("")
    setDistrictList(null)
    setPostalcodeList(null)
    props.fetchResetPostalcode();
    props.fetchResetDistrict();
    setDataEditAddress(null)
  }


  const _handleChangeProvince = (value) => {

  }

  const _handleChangeCity = (value) => {
    setKeyword(value);
    setIdKeyword(null);
    props.fetchResetDistrict();
    setPostalcodeList(null)
  };

  const _handleChangePostalCode = (event) => {
    setPostalCode(event);
    props.fetchResetPostalcode();
  }

  const _handleSubmit = async (data) => {
    if (data) {
      const { user } = props
      const accessToken = user.user.tokenResponse.accessToken
      const userId = user.user.userId
      await props.fetchPostBillingAddress(accessToken, userId, data);
    }
  }

  const _handleSubmitEdit = async (data) => {
    if (data) {
      const { user } = props
      const accessToken = user.user.tokenResponse.accessToken
      await props.fetchPutBillingList(accessToken, data.billingId, data, false);
    }
  }

  const handleDelete = async (data) => {
    if (data) {
      const { user } = props
      const accessToken = user.user.tokenResponse.accessToken
      await props.fetchDeleteBillingList(accessToken, data.billingId);        
      setAnalyticClevertap("click", "Click_DeleteBillingAddress", "View_UserProfile_Screen", null);
    }
  }

  const actionSelect = async (item) => {
    const { user } = props
    const accessToken = user.user.tokenResponse.accessToken
    selectAddress(item.billingId)
    await props.fetchPutBillingList(accessToken, item.billingId, item, true);        
    setAnalyticClevertap("click", "Click_SelectBillingAddress", "View_UserProfile_Screen", null);
  }

  const clickEdit = (item) => {
    setAnalyticClevertap("click", "Click_ModalEditAddress", "View_ChangeAddress_Screen", null);
    props.fetchResetDistrict();
    const dataEdit = {
      billingId: item.billingId,
      fullName: item.fullName,
      contactNumber: item.contactNumber,
      addressLabel: item.addressLabel,
      city: item.city,
      province: item.province,
      districts: item.districts,
      address: item.address,
      postalCode: item.postalCode,
      isPrimary: item.isPrimary,
      village: item.village,
    }
    async function fetchSearch() {
      await props.fetchSearchDistrict(item.city);
    }
    fetchSearch();
    setDataEditAddress(dataEdit)
    setModalEditAddress(true)
  }

  const clickConfirmAddress = () => {
    setAnalyticClevertap("click", "Click_ConfirmAddress", "View_ChangeAddress_Screen", null);
    const { state } = props.location
    props.push(MENU.BILLING, state)
  }

  const _renderBreadcrumb = () => {
    const breadcrums = [
      {
        'url': MENU.HOME,
        'name': 'Part Online Transaction'
      }
    ];
    return (
      <Breadcrumb
        linkBreadcrumb={breadcrums}
        typography={"Alamat"}
      />
    )
  };

  const _renderModalSuccessAddAddress = () => {
    return (
      <ModalSuccessAddress
        isOpen={successAddAddress}
        isClose={() => setSuccessAddAddress(false)}
        title="Hore Selamat..."
        description="Alamat berhasil ditambahkan"
      />
    );
  };

  const _renderModalSuccessEditAddress = () => {
    return (
      <ModalSuccessAddress
        isOpen={successEditAddress}
        isClose={() => setSuccessEditAddress(false)}
        title="Hore Selamat..."
        description="Alamat berhasil diubah"
      />
    );
  };

  return (
    <div>
      {_renderModalSuccessAddAddress()}
      {_renderModalSuccessEditAddress()}
      <Col className='bgCA'>
        {_renderBreadcrumb()}
        <p className='addressTitleCA'>Alamat Tersimpan</p>
        <hr className='lineAddress' />
        {props.billingAddressList &&
          props.billingAddressList.length > 0 &&
          props.billingAddressList.map((item) => {
            return (
              <div key={item.billingId}>
                {item.isPrimary ? (
                  <div className='addressBoxBillingSelected'>
                    <p className='address1'>{item.addressLabel}</p>
                    <p className='address2'>{item.fullName} ({item.contactNumber})</p>
                    <p className='address3'>{item.address}</p>
                    <Row className='m-0 rowActionAddress'>
                      <p className='address4' onClick={() => clickEdit(item)}>Ubah Alamat</p>
                    </Row>
                  </div>
                ) : (
                  <div className='addressBoxBilling'>
                    <p className='address1'>{item.addressLabel}</p>
                    <p className='address2'>{item.fullName} ({item.contactNumber})</p>
                    <p className='address3'>{item.address}</p>
                    <Row className='m-0 rowActionAddress'>
                      <p className='address4' onClick={() => clickEdit(item)} >Ubah Alamat</p>
                      <p onClick={() => actionSelect(item)} className='address5'>Pilih Alamat</p>
                      <p className='address5' onClick={() => handleDelete(item)} style={{ backgroundColor: '#D0021B' }}>Hapus Alamat</p>
                    </Row>
                  </div>
                )}
              </div>
            );
          })}
        {props.billingAddressList &&
          props.billingAddressList.length > 0 &&
          props.billingAddressList.filter(item => item.isPrimary).length > 0 ?
          (
            <p className='confirmAddress' onClick={() => clickConfirmAddress()}>Konfirmasi Alamat</p>
          ) : (
            <p className='confirmAddress' style={{ backgroundColor: "#d8d8d8", cursor: "default" }}>Konfirmasi Alamat</p>
          )
        }
        <hr className='lineAddress' />
        <p
          className='addAddress'
          onClick={() => {
            setAnalyticClevertap("click", "Click_AddBillingAddress", "View_ChangeAddress_Screen", null);
            setModal(!modalAddress);
          }}
        >
          + Tambah Alamat Baru
        </p>
        <ModalAddress
          isOpen={modalAddress}
          isClose={() => _resetData()}
          name={keyword}
          dataDistrict={districtList}
          dataPostalCode={postalcodeList}
          dataCity={dataCity}
          dataProvince={dataProvince}
          dataVillages={dataVillages}
          dataPostalCodes={dataPostalCodes}
          resetAll={() => _resetAll()}
          handleChangeProvince={(value) => _handleChangeProvince(value)}
          handleChangeCity={(event) => _handleChangeCity(event)}
          handleChangePostalCode={(event) => _handleChangePostalCode(event)}
          handleSubmit={(data) => _handleSubmit(data)}
        />
        <ModalEditAddress
          isOpen={modalEditAddress}
          isClose={() => _resetData()}
          dataEditAddress={dataEditAddress}
          dataDistrict={districtList}
          dataPostalCode={postalcodeList}
          dataCity={dataCity}
          dataProvince={dataProvince}
          dataVillages={dataVillages}
          dataPostalCodes={dataPostalCodes}
          resetAll={() => _resetAll()}
          handleChangeProvince={(value) => _handleChangeProvince(value)}
          handleChangeCity={(event) => _handleChangeCity(event)}
          handleChangePostalCode={(event) => _handleChangePostalCode(event)}
          handleSubmit={(data) => _handleSubmitEdit(data)}
        />
      </Col>
    </div>
  );
};
export default ChangeAddress;
