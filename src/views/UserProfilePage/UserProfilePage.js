import React, { useEffect, useState } from 'react'
import {
  Row,
  Col,
  Button,
  Modal as ModalProfile,
  ModalBody
} from 'reactstrap';
import './style/index.scss';
import {
  userIcon, SuccessSignUp
} from "assets/images"
import {
  TransactionList,
  IconLogOut,
  IconTerm,
  Verified,
  IconUTCall,
  IconMail,
  TakePicture,
  IconArrowLeft,
  IconAsk
} from "assets/icons"
import Autocomplete from './components/Autocomplete';
import Skeleton from 'react-loading-skeleton';
import {
  Modal,
  DialogContent,
  Slider
} from '@material-ui/core';
import firebase from "../../firebase/firebase";
import ModalAddAddress from "../../components/ModalAddAddress/ModalAddAddress";
import ModalEditAddress from "../../components/ModalEditAddress/ModalEditAddress";
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../helpers/CropImage';
import ModalSuccessAddress from 'components/ModalSuccessAddress/ModalSuccessAddress';
import ModalAccessDenied from 'components/ModalAccessDenied/ModalAccessDenied';
import { getStorage, setStorage } from 'utils/storage.helper';
import { MENU } from 'constants/menu';


const UserProfilePage = (props) => {
  const [fullName, setFullName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [position, setPosition] = useState('');
  const [gender, setGender] = useState('');
  const [userInfoId, setUserInfoId] = useState('');
  const [change, setChange] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(1);
  const [address, selectAddress] = useState(null);
  const [modalAddress, setModal] = useState(false);
  const [modalEditAddress, setModalEditAddress] = useState(false);
  const [successAddAddress, setSuccessAddAddress] = useState(false);
  const [successEditAddress, setSuccessEditAddress] = useState(false);
  const [dataEditAddress, setDataEditAddress] = useState(null);
  const [dataCity, setDataCity] = useState(null);
  const [dataProvince, setDataProvince] = useState(null);
  const [dataVillages, setDataVillages] = useState(null);
  const [dataPostalCodes, setDataPostalCodes] = useState(null);
  const [postalCode, setPostalCode] = useState("");
  const [keyword, setKeyword] = useState("");
  const [idKeyword, setIdKeyword] = useState("");
  const [districtList, setDistrictList] = useState(null);
  const [postalcodeList, setPostalcodeList] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageAwal, setImageAwal] = useState(null);
  const [imagePathSecond, setImagePathSecond] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [showModalProfile, setShowModalProfile] = useState(false);
  const [visible, setVisible] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(1);
  const [errImgFile, setErrImgFile] = useState(false);
  const [errImgSize, setErrImgSize] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);
  const [changeTitle, setChangeTitle] = useState(false);
  const [changeGender, setChangeGender] = useState(false);
  const [changeFullName, setChangeFullName] = useState(false);
  const [tabData, setTabData] = useState([]);

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
    }
  };

  useEffect(() => {
    setAnalyticClevertap("view", "View_UserProfile_Screen", "View_UserProfile_Screen", null);
    window.scrollTo(0, 0);
  }, []);


  const handleChange = (value) => {
    const val1 = value.replace(/[^0-9]+/g, "");
    const val2 = val1.slice(0, 13);
    setPhoneNumber(val2)
    setChange(true)
  }

  const setLogout = () => {
    setAnalyticClevertap("action", "Action_Logout", "View_UserProfile_Screen", null);
    props.clearStore();
    localStorage.clear();
    setModalLogout(false);
    window.location.replace(MENU.LANDING);
  };

  const _postchangePhoto = async (imageFile) => {
    const { user } = props
    const accessToken = user.tokenResponse.accessToken
    const userId = user.userId
    await props.fetchPostChangeProfile(accessToken, userId, imageFile);
  }

  useEffect(() => {
    if (props.dataProfile.dataProfile != null) {
      setAnalyticClevertap("view", "Action_ChangeImageProfile_Success", "View_UserProfile_Screen", null);
    } else if (props.dataProfile.errProfile != null) {
      setAnalyticClevertap("view", "Action_ChangeImageProfile_Error", "View_UserProfile_Screen", null);
    }
  }, [props.dataProfile])

  const handleChangeFullName = async () => {
    const { user } = props;
    const accessToken = user.tokenResponse.accessToken;
    const userId = user.userId
    let data = {
      userInfoId: userInfoId,
      firstName: firstName,
      lastName: lastName,
    };
    const action = await props.fetchPutContactInformation(data, accessToken);
    if (action?.contactNumber == phoneNumber) {
      setAnalyticClevertap("action", "Action_ChangeFullName_Success", "View_UserProfile_Screen", null);
    } else {
      setAnalyticClevertap("action", "Action_ChangeFullName_Error", "View_UserProfile_Screen", null);
    };
    await props.fetchGetUserProfile(accessToken, userId);
    setChangeFullName(false);
  };

  useEffect(() => {
    const { user } = props
    const accessToken = user.tokenResponse.accessToken
    const userId = user.userId
    async function fetchData() {
      await props.fetchGetUserProfile(accessToken, userId);
      await props.fetchAttributeName("position");
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (props.userInfoData != null) {
      const { userInfoId, gender, position, contactNumber, firstName, lastName } = props.userInfoData
      setFirstName(firstName ? firstName : '')
      setLastName(lastName ? lastName : '')
      setGender(gender ? gender : '')
      setPosition(position ? position : '')
      setPhoneNumber(contactNumber ? contactNumber : '')
      setUserInfoId(userInfoId)
      setIsLoaded(true)
      if (props.userInfoData.imagePath) {
        const chart1 = "data:image/png;base64,";
        setImageAwal(chart1 + props.userInfoData.imagePath)
      } else {
        setImageAwal(userIcon)
      }
    }
  }, [props.userInfoData])

  function capitalizeEachWord(value) {
    let splitStr = value.toLowerCase().split('_');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join('_')
  }

  const setAnalytic = (eventName) => {
    const { user } = props
    const analyticName = capitalizeEachWord(eventName)

    window.clevertapEvent(eventName, user);
    firebase.analytics().setCurrentScreen("Open_User_Profile_Screen", "Open_User_Profile_Screen");
    firebase.analytics().logEvent(analyticName);
  }

  useEffect(() => {
    const { user } = props
    const accessToken = user.tokenResponse.accessToken
    const userId = user.userId
    async function fetchData() {
      const res = await props.fetchGetBillingList(userId, accessToken);
    }
    fetchData()
  }, [address, props.dataPut, props.dataPostBilling])

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
    window.setTimeout(() => { setVisible(false) }, 5000)
  }, [visible])

  useEffect(() => {
    if (props.dataPut?.status == 200) {
      setSuccessEditAddress(true);
      setAnalyticClevertap("action", "Action_EditBillingAddress_Success", "View_UserProfile_Screen", null);
    } else if (props.errPut != null) {
      setAnalyticClevertap("action", "Action_EditBillingAddress_Error", "View_UserProfile_Screen", null);
    }
  }, [props.dataPut])

  useEffect(() => {
    if (props.dataPostBilling?.status == 200) {
      setSuccessAddAddress(true);
      setAnalyticClevertap("action", "Action_AddBillingAddress_Success", "View_UserProfile_Screen", null);
    } else if (props.errPostBilling != null) {
      setAnalyticClevertap("action", "Action_AddBillingAddress_Error", "View_UserProfile_Screen", null);
    }
  }, [props.dataPostBilling])

  const clickEdit = (item) => {
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
    setDataEditAddress(dataEdit);
    setModalEditAddress(true);
    setAnalyticClevertap("click", "Click_ModalEditAddress", "View_UserProfile_Screen", null);
  }

  const actionSelect = async (item) => {
    const { user } = props
    const accessToken = user.tokenResponse.accessToken
    const userId = user.userId
    selectAddress(item.billingId)
    await props.fetchPutBillingList(accessToken, item.billingId, item, true);
    setAnalyticClevertap("click", "Click_SelectBillingAddress", "View_UserProfile_Screen", null);
  }

  const handleEditProfile = async (key, value) => {
    const { user } = props
    const accessToken = user.tokenResponse.accessToken
    if (key == 'jabatan' && value) {
      let data = {
        userInfoId: userInfoId,
        position: position
      }
      const action = await props.fetchPutContactInformation(data, accessToken);
      if (action?.position == position) {
        setAnalyticClevertap("action", "Action_ChangePosition_Success", "View_UserProfile_Screen", null);
      } else {
        setAnalyticClevertap("action", "Action_ChangePosition_Error", "View_UserProfile_Screen", null);
      }
    } else if (key == 'gender' && value) {
      let data = {
        userInfoId: userInfoId,
        gender: gender
      }
      const action = await props.fetchPutContactInformation(data, accessToken);
      if (action?.gender == gender) {
        setAnalyticClevertap("action", "Action_ChangeGender_Success", "View_UserProfile_Screen", null);
      } else {
        setAnalyticClevertap("action", "Action_ChangeGender_Error", "View_UserProfile_Screen", null);
      }
    }
  }

  const _handleChangeKeyword = (event) => {
    setKeyword(event);
    setIdKeyword(null);
    props.fetchResetDistrict();
    setPostalcodeList(null)
  };

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
      const userId = user.userId
      const accessToken = user.tokenResponse.accessToken
      await props.fetchPostBillingAddress(accessToken, userId, data);
    }
  }

  const _handleSubmitEdit = async (data) => {
    if (data) {
      const { user } = props
      const accessToken = user.tokenResponse.accessToken
      await props.fetchPutBillingList(accessToken, data.billingId, data, false);
    }
  }

  const handleDelete = async (data) => {
    if (data) {
      const { user } = props
      const accessToken = user.tokenResponse.accessToken
      await props.fetchDeleteBillingList(accessToken, data.billingId);
      setAnalyticClevertap("click", "Click_DeleteBillingAddress", "View_UserProfile_Screen", null);
    }
  }

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

  const _handleBackgroundChange = (e) => {
    setAnalyticClevertap("click", "Click_ChangeProfileImage", "View_UserProfile_Screen", null);
    let file_size = e.target.files[0].size / 1024 / 1024;
    let file_type = e.target.files[0].type;
    if (file_size > 3) {
      setErrImgSize(true);
    } else if (file_type != "image/jpeg" && file_type != "image/png" && file_type != "image/jpg") {
      setErrImgFile(true);
    }
    else {
      setImagePathSecond(URL.createObjectURL(e.target.files[0]))
      setShowModalProfile(!showModalProfile)
      setImageFile(e.target.files[0])
      setImageName(e.target.files[0].name)
    }
  }

  const _ExitModalChangeProfile = () => {
    setShowModalProfile(!showModalProfile)
    setImagePathSecond(null)
  }

  const showCroppedImage = async () => {
    const imagePathSecond1 = await getCroppedImg(
      imagePathSecond,
      croppedAreaPixels,
    )
    setImagePathSecond(imagePathSecond1)
    setShowModalProfile(!showModalProfile)
    setImagePath(imagePathSecond1)
    setVisible(true)
    setVisible(true)
    props.setimageGlobal(imagePathSecond1);
    urltoFile(imagePathSecond1, imageName)
      .then((file) => {
        _postchangePhoto(file);
      });
  }

  const urltoFile = (url, filename, mimeType) => {
    mimeType = mimeType || (url.match(/^data:([^;]+);/) || '')[1];
    return (fetch(url)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buf) {
        return new File([buf], filename, { type: mimeType });
      })
    );
  }

  const onCropChange = (crop) => {
    setCrop(crop)
  }

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const onZoomChange = (zoom) => {
    setZoom(zoom)
  }

  const _renderModalErrImgFile = () => {
    return (
      <ModalAccessDenied
        isOpen={errImgFile}
        isClose={() => setErrImgFile(false)}
        title={"Huhu sayang sekali.."}
        errorText={"Silahkan upload gambar dengan tipe PNG/JPG."}
      />
    );
  };
  const _renderModalErrImgSize = () => {
    return (
      <ModalAccessDenied
        isOpen={errImgSize}
        isClose={() => setErrImgSize(false)}
        title={"Huhu sayang sekali.."}
        errorText={"File gambar terlalu besar."}
      />
    );
  };

  const _renderProfile = () => {
    if (!isLoaded) {
      return (
        <Col sm="12" md="4" className="containerCardProfile">
          <div className="cardProfile">
            <div className="profileInfo">
              <p className="textProfile">
                <Skeleton width={70} />
              </p>
              <Row>
                <div style={{ width: '111px', height: '111px' }}>
                  <Skeleton height={110} width={110} circle={true} />
                </div>
              </Row>
              <p className="textProfile" style={{ marginBottom: '7px' }}> <Skeleton width={100} /> </p>
              <p className="textEmail"> <Skeleton width={80} /> </p>
              <div className="line1"></div>
            </div>
            <div className="profileMenus">
              <div className="rowMenus">
                <div className="iconProfile" > <Skeleton width={20} /> </div>
                <Col style={{ padding: 0 }}>
                  <div className="textMenus" style={{ paddingTop: 6 }}> <Skeleton width={120} /> </div>
                  <div className="line"></div>
                </Col>
              </div>
              <div className="rowMenus">
                <div className="iconProfile" > <Skeleton width={20} /> </div>
                <Col style={{ padding: 0 }}>
                  <div className="textMenus" style={{ paddingTop: 6 }}> <Skeleton width={120} /> </div>
                  <div className="line"></div>
                </Col>
              </div>
              <div className="rowMenus">
                <div className="iconProfile" style={{ marginLeft: 1 }} > <Skeleton width={20} /> </div>
                <div className="textMenus" style={{ paddingTop: 6 }}> <Skeleton width={120} /> </div>
              </div>
            </div>
          </div>
        </Col>
      )
    }
    if (props.userInfoData != undefined) {
      const { firstName, lastName, email } = props.userInfoData
      return (
        <Col sm="12" md="4" className="containerCardProfile">
          <div className="cardProfile">
            <div className="profileInfo">
              <p className="textProfile">Profil</p>
              <Row className="headerCpass">
                <div className="containerProfile">
                  {
                    customerName != "" ?
                      <Skeleton className="imageProfile" /> :
                      <img src={imageAwal !== null && imagePathSecond === null && imagePath === null ? imageAwal
                        : imageAwal !== null && imagePathSecond === null && imagePath !== null ? imagePath
                          : imagePathSecond} width="100%" alt="Avatar" className="imageProfile" />
                  }
                  <label for="files">
                    <div className="middleProfile">
                      <img src={TakePicture} style={{ opacity: 0.5, width: '2vw' }} />
                      <div className="textProfile1">
                        Maks. file : 1Mb
                        Format : .jpg, .jpeg, .png
                      </div>
                    </div>
                    <div className="tar">
                      <div className="buttonchangecamera">
                        <img src={TakePicture} width="80%" />
                      </div>
                    </div>
                  </label>
                  <input onChange={(event) => _handleBackgroundChange(event)} type="file" accept="image/*" id="files" style={{ display: 'none' }} />
                </div>
              </Row>
              <div style={{ overflow: 'auto' }}>
                <p className="textProfile" style={{ marginBottom: '7px' }}>{firstName + ' ' + lastName}</p>
                <p className="textEmail">{email}</p>
              </div>
              <div className="line1"></div>
            </div>
            <div className="profileMenus">
              <div className="rowMenus">
                <img className="iconProfile" style={{ width: '16px', height: '16px' }} src={TransactionList}></img>
                <Col style={{ padding: 0 }}>
                  <div
                    className="textMenus"
                    onClick={() => {
                      setAnalyticClevertap("click", "Click_ListOrder", "View_UserProfile_Screen", null);
                      props.push(MENU.LIST_ORDER)
                    }}
                  >List Pesanan</div>
                  <div className="line"></div>
                </Col>
              </div>
              <div className="rowMenus">
                <img className="iconProfile" style={{ width: '16px', height: '16px' }} src={IconTerm}></img>
                <Col style={{ padding: 0 }}>
                  <div
                    className="textMenus"
                    onClick={() => {
                      setAnalyticClevertap("click", "Click_TermCondition", "View_UserProfile_Screen", null);
                      props.push(MENU.TERM_CONDITION)
                    }}
                  >{"Syarat & Ketentuan"}</div>
                  <div className="line"></div>
                </Col>
              </div>
              <div className="rowMenus">
                <img className="iconProfile" style={{ width: '16px', height: '16px', marginLeft: 1 }} src={IconLogOut}></img>
                <div
                  className="textMenus"
                  onClick={() => {
                    setAnalyticClevertap("click", "Click_ModalLogout", "View_UserProfile_Screen", null);
                    setModalLogout(true)
                  }}
                >Keluar</div>
              </div>
            </div>
          </div>
        </Col>
      )
    }
  }

  const _renderModalProfile = () => {
    return (
      <ModalProfile isOpen={showModalProfile} style={{ maxWidth: '600px' }}>
        <div className="modal-header-profile">

          <div className="styleHeaderCropProfile" onClick={() => _ExitModalChangeProfile()}>
            <img src={IconArrowLeft} className="iconbackheaderprofile" style={{ cursor: 'pointer', float: 'left' }} />
            <h4 style={{ fontWeight: 'bold', margin: '0', marginLeft: '2vw', color: 'black' }} className="fontversimobileheaderphoto">Ubah Foto</h4>
          </div>
          <div className="terapkancropprofile">
            <Button
              onClick={() => showCroppedImage()}
              variant="contained"
              color="warning"
              className="buttonterapkanprofile">
              Terapkan
            </Button>
          </div>
        </div>
        <ModalBody className="modalcropprofile">
          <div className="crop-container">
            <Cropper
              image={imagePathSecond}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              classes={{ cropAreaClassName: 'Crop_Area Crop_AreaRound', containerClassName: 'Crop_Container', mediaClassName: 'Crop_Image' }}
              disableAutomaticStylesInjection
            />
          </div>
        </ModalBody>
        <div className="controls">
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e, zoom) => onZoomChange(zoom)}
            classes={{ container: 'slider' }}
            style={{ color: '#ffc107' }}
          />
        </div>
      </ModalProfile>
    )
  }


  useEffect(() => {
    const { customerCode } = props.user;
    if (customerCode == "ONETIMESTD") {
      setTabData(tabDataUserOnetime);
    } else {
      setTabData(tabDataUserUT);
    }
  }, [props.user]);
  const tabDataUserOnetime = [
    {
      "title": "Informasi Pribadi",
      "index": 1
    },
    {
      "title": "Alamat Pengiriman",
      "index": 2
    }
  ]
  const tabDataUserUT = [
    {
      "title": "Informasi Pribadi",
      "index": 1
    }
  ];

  const analyticClickTab = (title) => {
    if (title == "Informasi Pribadi") {
      setAnalyticClevertap("click", "Click_TabUserInfo", "View_UserProfile_Screen", null);
    } else if (title == "Alamat Pengiriman") {
      setAnalyticClevertap("click", "Click_TabBillingAddress", "View_UserProfile_Screen", null);
    }
  };

  const _renderTabProfile = () => {
    return (
      <div className='container-tab-profile'>
        <Col sm="12" md="8" className="containerCardInformation">
          <div className="cardInformation">
            <div className="tabProfileRow">
              {tabData.map((tab) => (
                <div
                  style={tabIndex === tab.index ? { borderBottom: '5px solid #ffd500' } : { cursor: 'pointer' }}
                  key={tab.index}
                  className="tabProfile"
                  onClick={() => {
                    analyticClickTab(tab.title)
                    setTabIndex(tab.index)
                  }}
                >
                  <p className="textTabProfile" style={{ fontWeight: 'bold', color: '#050505', cursor: 'pointer' }}>{tab.title}</p>
                </div>
              ))}
            </div>
            <div style={{ width: '100%', backgroundColor: '#f8f9fd', border: '1px solid #f8f9fd' }}></div>
            {tabIndex === 1 ? _renderInformation() :
              tabIndex === 2 ? _renderDeliveryAddress()
                : null}
          </div>
        </Col>
      </div>
    )
  }
  const _renderModal = () => {
    return (
      <Modal
        className='modal-login'
        open={isOpen}
        onClose={() => setOpen(false)}
      >
        <DialogContent className='container-modal-login'>
          <div className='success-modal-body'>
            <img className='imageSuccess'
              src={SuccessSignUp} />
            <div className="teksCongratulation">
              Congratulations!
            </div>
            <p className="teksSuccess" style={{ marginBottom: 'inherit' }}>
              Your account has been registered and waiting for activation!.
            </p>
            <p className="teksSuccess" style={{ marginBottom: 'inherit' }}>
              please contact indahks@hillcon.com to get approval for verification your user.
            </p>
            <div className='btn-lanjut' onClick={() => setOpen(false)}>
              <p className='titleButtonLanjut'>Ok</p>
            </div>

            <p className='mt-0 title-contact'>Butuh informasi tambahan? Kontak kami</p>
            <div className='container-footer-contact'>
              <img className='marginIcon' src={IconUTCall} alt='ut-call-icon' />
              <img src={IconMail} alt='mail-icon'
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.open("mailto:utmobileapp@unitedtractors.com?subject=Question for UT Connect Team");
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Modal>
    )
  }

  useEffect(() => {
    const userInfo = props.userInfoData;
    const USER = getStorage("USER");
    const NEWUSER = {
      ...USER,
      firstName: userInfo?.firstName,
      lastName: userInfo?.lastName
    };
    if (userInfo) {
      setStorage("USER", NEWUSER);
    }
  }, [props.userInfoData]);

  const _renderInformation = () => {
    if (!isLoaded) {
      return (
        <div className="tabInformasi">
          <div className="mb-4">
            <div className="judulInformasi">
              <Skeleton width={100} />
            </div>
            <Row className="rowInformasi">
              <Skeleton width={200} />
            </Row>
          </div>
          <div className="mb-4">
            <div className="judulInformasi">
              <Skeleton width={100} />
            </div>
            <Row className="rowInformasi">
              <Skeleton width={200} />
            </Row>
          </div>
          <div className="mb-4">
            <div className="judulInformasi">
              <Skeleton width={100} />
            </div>
            <Row className="rowInformasi">
              <Skeleton width={200} />
            </Row>
          </div>
          <div className="mb-4">
            <div className="judulInformasi">
              <Skeleton width={100} />
            </div>
            <Row className="rowInformasi">
              <Skeleton width={200} />
            </Row>
          </div>
          <div className="mb-4">
            <div className="judulInformasi">
              <Skeleton width={100} />
            </div>
            <Row className="rowInformasi">
              <Skeleton width={200} />
            </Row>
          </div>
          <div className="mb-4">
            <div className="judulInformasi">
              <Skeleton width={100} />
            </div>
            <Row className="rowInformasi">
              <Skeleton width={200} />
            </Row>
          </div>
          <div className="mb-4">
            <div className="judulInformasi">
              <Skeleton width={100} />
            </div>
            <Row className="rowInformasi">
              <Skeleton width={200} />
            </Row>
          </div>
          <div className="mb-4">
            <div className="judulInformasi">
              <Skeleton width={100} />
            </div>
            <Skeleton width={270} height={30} />
          </div>
        </div>
      )
    }
    if (props.userInfoData != undefined) {
      const { userName, email, contactNumber, idCardNumber, customerCode, customerName, taxPayerNumber } = props.userInfoData
      return (
        <div className="tabInformasi">
          <div className="mb-4">
            <div className="judulInformasi">Nama Lengkap</div>
            <Row style={{ margin: 0 }}>
              {changeFullName ?
                <Row className="formEditFullname">
                  <input
                    type="text"
                    value={firstName}
                    className="inputFullName"
                    placeholder="Nama Pertama"
                    onChange={(e) => setFirstName(e.target.value?.replace(/[^a-z A-Z]+/g, ""))}
                    style={{
                      width: firstName ?
                        ((firstName.length) * 12) > 110 ?
                          ((firstName.length) * 12) : 110 : 110
                    }}
                  />
                  <div style={{ height: "70%", width: "1px", backgroundColor: "#d4d5d5", margin: "auto 10px" }} />
                  <input
                    type="text"
                    value={lastName}
                    className="inputFullName"
                    placeholder="Nama Terakhir"
                    onChange={(e) => setLastName(e.target.value?.replace(/[^a-z A-Z]+/g, ""))}
                    style={{
                      width: lastName ?
                        ((lastName.length) * 12) > 110 ?
                          ((lastName.length) * 12) : 110 : 110
                    }}
                  />
                </Row>
                :
                <span className="textInformasi">{firstName} {lastName}</span>
              }
              <span
                className="btnChange"
                style={{ cursor: 'pointer', marginLeft: 30 }}
                onClick={() => {
                  changeFullName ?
                    handleChangeFullName() : setChangeFullName(true)
                }}
              >{changeFullName ? "Simpan" : "Ubah"}</span>
            </Row>
          </div>
          <div className="mb-4">
            <div className="judulInformasi">Email</div>
            <Row className="rowInformasi">
              <input
                type='email'
                value={email}
                className="textInformasi"
                disabled={true}
                onkeypress="this.style.width = ((this.value.length + 1) * 8) + 'px';"
                style={{ width: '100%' }}
              ></input>
            </Row>
          </div>
          <div className="mb-4">
            <div className="judulInformasi">Nomor Telepon</div>
            <Row className="rowInformasi">
              <span className="textInformasi">{phoneNumber}</span>
            </Row>
          </div>
          <div className="mb-4">
            <div className="judulInformasi">Jabatan</div>
            <Row className="rowInformasi">
              <select
                value={position}
                disabled={!changeTitle} className="textInformasi"
                style={position !== null ? { width: ((position.length + 10) * 6), backgroundColor: '#ffffff' } : { width: (("Management".length + 10) * 5.5), backgroundColor: '#ffffff' }}
                onChange={e => setPosition(e.target.value)}
              >
                <option value={position}>{position}</option>
                {props.attributeName &&
                  props.attributeName.data.filter((item) => item.value != position).map((title) => {
                    return (
                      <option value={title.value}>{title.value}</option>
                    );
                  })}
              </select>
            </Row>
          </div>
          <div className="mb-4">
            <div className="judulInformasi">Gender</div>
            <Row className="rowInformasi">
              <select
                value={gender && gender != "string" ? gender : "Pria"}
                disabled={!changeGender}
                className="textInformasi"
                style={{ width: (("Pria".length + 10) * 5.5), backgroundColor: '#ffffff' }}
                onChange={e => setGender(e.target.value)}
              >
                <option selected={position && position == "Pria"} value="Pria">Pria</option>
                <option selected={position && position == "Wanita"} value="Wanita">Wanita</option>
              </select>
            </Row>
          </div>
          <div className="mb-4">
            <div className="judulInformasi">Nomor Identitas Penduduk (NIK)</div>
            <Row className="rowInformasi">
              <input
                type='text'
                value={idCardNumber !== null ? idCardNumber : "-"}
                disabled
                className="textInformasi"
                style={idCardNumber !== null ? { width: ((idCardNumber.length + 10) * 5.5) } : {}}
              ></input>
            </Row>
          </div>
          <div className="mb-4">
            <div className="judulInformasi">Nomor NPWP</div>
            <Row className="rowInformasi">
              <input
                type='text'
                value={taxPayerNumber !== null ? taxPayerNumber : "-"}
                disabled
                className="textInformasi"
                style={taxPayerNumber ? { width: ((taxPayerNumber.length + 10) * 5.5) } : {}}
              ></input>
            </Row>
          </div>
          <div className="mb-4">
            <div className="judulInformasi">Kode Perusahaan</div>
            <div>
              <p className="textInformasi">{`${customerCode} ${customerCode != "ONETIMESTD" ? "- " + customerName : ""}`}</p>
            </div>
          </div>
        </div>
      )
    }
  }

  const _renderDeliveryAddress = () => {
    return (
      <div className="tabInformasi pr-4">
        {props.billingAddressList &&
          props.billingAddressList.length > 0 &&
          props.billingAddressList.map((item, index) => {
            return (
              <div className={item.isPrimary ? "address-selected" : "other-address"} key={index}>
                <h4 className="addressTitleUP">{item.addressLabel}</h4>
                <p className="addressName">{item.fullName} ({item.contactNumber})</p>
                <p className="addressName">{item.address}</p>
                <div style={{ display: 'flex', marginTop: '1rem' }}>
                  <span className="addressEdit" onClick={() => clickEdit(item)} >Ubah Alamat</span>
                  {item.isPrimary ? null :
                    <span className="addressSelect" onClick={() => actionSelect(item)}>Pilih Alamat</span>}
                  {item.isPrimary ? null :
                    <span className="addressSelect" onClick={() => handleDelete(item)} style={{ backgroundColor: '#D0021B' }}>Hapus Alamat</span>}
                </div>
              </div>
            )
          })}
        <span
          className="add-newaddress"
          onClick={() => {
            setModal(!modalAddress)
            setAnalyticClevertap("click", "Click_AddBillingAddress", "View_UserProfile_Screen", null)
          }}
        >+ Tambah Alamat Baru</span>
      </div>
    );
  };

  const _renderModalLogout = () => {
    return (
      <Modal className='modal-del-wishlist' open={modalLogout} onClose={() => setModalLogout(false)}>
        <DialogContent className='container-modal-del-wishlist'>
          <div className='del-modal-body'>
            <p className='titleUpload'>Kamu Yakin?</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={IconAsk} className='iconModal' />
            </div>
            <p className='titleAvailable'>Kamu akan keluar dari halaman ini</p>
            <div className='header-button-upload'>
              <div className='cardCancel' onClick={() => setModalLogout(false)}>
                <p className='textBuy'>Kembali</p>
              </div>
              <div className='cardSubmit' onClick={() => setLogout()} style={{ cursor: "pointer" }}>
                <p className='textBuy'>Lanjutkan</p>
              </div>
            </div>
            <p className='mt-4 title-contact'>Butuh informasi tambahan? Kontak kami</p>
            <div className='container-footer-contact'>
              <img className='marginIcon' src={IconUTCall} alt='ut-call-icon' />
              <img src={IconMail} alt='mail-icon'
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.open("mailto:utmobileapp@unitedtractors.com?subject=Question for UT Connect Team");
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Modal>
    );
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
    <div style={{ backgroundColor: '#e5e5e5' }}>
      <Row>
        {_renderModal()}
        {_renderProfile()}
        {_renderModalProfile()}
        {_renderTabProfile()}
      </Row>
      {_renderModalLogout()}
      {_renderModalErrImgFile()}
      {_renderModalErrImgSize()}
      {_renderModalSuccessAddAddress()}
      {_renderModalSuccessEditAddress()}
      <ModalAddAddress
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
    </div>
  )
};
export default UserProfilePage;