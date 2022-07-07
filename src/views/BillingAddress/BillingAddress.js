import React, { useEffect, useState, Component } from 'react';
import "./BillingAddress.scss";
import {
	Row,
	Col,
	Button,
	Form,
	FormGroup,
	Label,
	Input,
} from 'reactstrap';
import {
	IconDelivery,
	IconCautionYellow,
	IconUTCall,
	IconMail
} from "assets/icons";
import {
	Checkbox,
	Modal,
	DialogContent,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Skeleton from 'react-loading-skeleton';
import moment from "moment";
import firebase from "../../firebase/firebase";
import { formatCurrency } from 'utils/format.helper';
import { setStorage, getStorage } from "utils/storage.helper";
import { USER_STORAGE } from "constants/storage";
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import GoogleMaps from './Components/GoogleMaps';
import { brakeImg } from 'assets/images';
import ModalAccessDenied from "components/ModalAccessDenied/ModalAccessDenied";
import ModalErrorPurchase from "components/ModalErrorPurchase/ModalErrorPurchase"
import SimpleCrypto from "simple-crypto-js"
import { MENU } from 'constants/menu';


const BillingAddress = (props) => {
	const secretKey = "info-bill-key";
	const simpleCrypto = new SimpleCrypto(secretKey)
	const [infoBill, setBill] = useState({
		userId: null,
		userInfoId: null,
		contactNumber: null,
		email: null,
		surname: null,
		description: null,
		religion: null,
		citizenOfCountry: null,
		dateOfBirth: null,
		gender: null,
		idCardNumber: null,
		taxPayerNumber: null,
		marriage: null,
		position: null,
	})
	const [update, setUpdate] = useState(false);
	const [nik, setNik] = useState('');
	const [showDetail, setShowDetail] = useState(false);
	const [open, setOpen] = useState(false);
	const [screenWidth, setScreen] = useState(null);
	const [cartId, setCartId] = useState(null)
	const [modalError, setModalError] = useState(false)
	const [openModalErrorPurchase, setOpenModalErrorPurchase] = useState(false)
	const [dataAddress, setDataAddress] = useState(null)
	const [openModalSelectAddress, setOpenModalSelectAddress] = useState(false)
	const [openModalKTP, setOpenModalKTP] = useState(false)
	const [invalidKTP, setInvalidKTP] = useState(false)
	const [invalidNPWP, setInvalidNPWP] = useState(false)
	const [errorForm, setErrorForm] = useState(false)
	const [invalidContactNumber, setInvalidContactNumber] = useState(null)
	const [invalidPosition, setInvalidPosition] = useState(false)
	const [dataAttributeName, setDataAttributeName] = useState(null)
	const [tax, setTax] = useState(0)

	useEffect(() => {
		setAnalyticClevertap("view", "View_ContactInformation_Screen", "View_ContactInformation_Screen", null);
		window.scrollTo(0, 0);
	}, []);

	const setAnalyticClevertap = (action, event, screen, product) => {
		if (props.user) {
			const user = getStorage(USER_STORAGE);
			const { userName } = user;
			if (product !== null) {
				window.clevertapEventProduct(`${product[0] + "_LogedIn"}`, product[1]);
			} else {
				window.clevertapEvent(`${event + "_LogedIn"}`, user);
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
		if (infoBill.idCardNumber && infoBill.idCardNumber?.length < 0 || infoBill.idCardNumber?.length != 16) {
			setInvalidKTP(true)
		} else (
			setInvalidKTP(false)
		)
		if (infoBill?.taxPayerNumber && infoBill?.taxPayerNumber?.length != 15) {
			setInvalidNPWP(true)
		} else (
			setInvalidNPWP(false)
		)
		if (infoBill.contactNumber && infoBill.contactNumber.length < 0 || infoBill.contactNumber == null || infoBill.contactNumber == "") {
			setInvalidContactNumber(true)
		} else (
			setInvalidContactNumber(false)
		)
		if (infoBill.position && infoBill.position.length == 0 || infoBill.position == null || infoBill.position == "") {
			setInvalidPosition(true)
		} else (
			setInvalidPosition(false)
		)
		if (!infoBill?.contactNumber || !infoBill?.email || !infoBill?.position) {
			setErrorForm(true)
		} else {
			setErrorForm(false)
		}
	}, [infoBill.idCardNumber, infoBill?.contactNumber, infoBill?.email, infoBill?.position, infoBill?.taxPayerNumber]);

	const resize = () => {
		setScreen(window.innerWidth);
	};

	function capitalizeEachWord(value) {
		let splitStr = value.toLowerCase().split(" ");
		for (let i = 0; i < splitStr.length; i++) {
			splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
		}
		return splitStr.join(" ")
	}

	const handleInputChange = event => {
		setUpdate(true)
		const { name, value } = event.target;
		setBill(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	const handleClickPosition = () => {
		setAnalyticClevertap("click", "Click_SelectPosition", "View_ContactInformation_Screen", null);
	}

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const requestInfoBilling = async () => {
		const { userId } = props;
		const { tokenResponse: { accessToken } } = props;
		await props.infoBillingAddress(userId, accessToken)
	}

	const requestPurchaseSummary = async () => {
		const { tokenResponse: { accessToken } } = props;
		const { state } = props.location
		await props.fetchPurchaseSummary(state, accessToken)
	}

	const requestAttributeName = async () => {
		const name = 'position';
		await props.fetchAttributeName(name)
	}

	const requestAttributeTax = async () => {
		const name = 'tax';
		await props.fetchAttributeName(name)
	}
	useEffect(() => {
		requestInfoBilling();
		requestPurchaseSummary();
		requestAttributeName();
		requestAttributeTax();
	}, [props.history.location.pathname])


	useEffect(() => {
		if (props.attributeName) {
			if (props.attributeName.data.length > 0 && props.attributeName.data[0].name === "POSITION") {
				setDataAttributeName(props.attributeName)
			} else {
				const selectedTax = props.attributeName.data.filter(item => item.display == true)
				setTax(parseFloat(String(selectedTax[0].value)) / 100)
			}
		}
	}, [props.attributeName]);

	useEffect(() => {
		const { user } = props.user;
		if (user?.customerCode != "ONETIMESTD") {
			checkCustomerCode(user?.tokenResponse.accessToken);
		}
	}, [props.user]);

	const checkCustomerCode = async (token) => {
		await props.checkCustomer(token);
	};

	useEffect(() => {
		if (update) {
			setStorage('INFO_BILL', simpleCrypto.encrypt(infoBill))
		}
	}, [infoBill]);

	useEffect(() => {
		if (getStorage("INFO_BILL")) {
			setUpdate(true)
			setBill(simpleCrypto.decrypt(getStorage("INFO_BILL")))
		} else if (props.infoBilling !== undefined) {
			setBill(props.infoBilling)
		}
		if (props.purchaseSummary && props.purchaseSummary.totalPrice == 0) {
			setOpenModalErrorPurchase(true)
		}
		if (props.billingAddressList) {
			for (let i = 0; props.billingAddressList.length > i; i++) {
				if (props.billingAddressList[i].isPrimary) {
					setDataAddress(props.billingAddressList[i])
				}
			}
		}
	}, [props.infoBilling, props.purchaseSummary, props.billingAddressList])

	useEffect(() => {
		const { userId } = props;
		const { tokenResponse: { accessToken } } = props;
		async function fetchData() {
			const response = await props.fetchGetBillingList(userId, accessToken);
		}
		fetchData();
	}, []);

	const saveBilling = async () => {
		const { tokenResponse: { accessToken } } = props;
		const { user } = props.user
		let data = {
			userId: user.userId,
			surname: infoBill?.surname,
			description: props.description,
			religion: infoBill?.religion,
			citizenOfCountry: infoBill?.citizenOfCountry,
			dob: infoBill?.dateOfBirth,
			gender: infoBill?.gender,
			idCardNumber: infoBill?.idCardNumber,
			taxPayerNumber: infoBill?.taxPayerNumber,
			marriage: infoBill?.marriage,
			contactNumber: infoBill?.contactNumber,
			position: infoBill?.position ? infoBill?.position : 'Owner'
		}
		const response = await props.fetchPostBillingList(data, accessToken);
		if (response != null && response != '400') {
			setAnalyticClevertap("action", "Action_ConfirmContactInformation_Success", "View_ContactInformation_Screen", null);
			props.push(MENU.DELIVERY_METHODE, props.location.state);
			localStorage.removeItem("INFO_BILL");
		} else {
			setAnalyticClevertap("action", "Action_ConfirmContactInformation_Error", "View_ContactInformation_Screen", null);
			setModalError(true)
		}
	};

	const putInformation = async () => {
		const { tokenResponse: { accessToken } } = props;
		const { user } = props.user
		let data = {
			userInfoId: infoBill?.userInfoId,
			surname: infoBill?.surname,
			description: user.description,
			religion: infoBill?.religion,
			citizenOfCountry: infoBill?.citizenOfCountry,
			dob: infoBill?.dateOfBirth,
			gender: infoBill?.gender,
			idCardNumber: infoBill?.idCardNumber,
			taxPayerNumber: infoBill?.taxPayerNumber,
			marriage: infoBill?.marriage,
			status: true,
			contactNumber: infoBill?.contactNumber,
			position: infoBill?.position ? infoBill?.position : 'Owner'
		}
		const response = await props.fetchPutContactInformation(data, accessToken);
		if (response != null && response != '400') {
			setAnalyticClevertap("action", "Action_ConfirmContactInformation_Success", "View_ContactInformation_Screen", null);
			props.push(MENU.DELIVERY_METHODE, props.location.state);
			localStorage.removeItem("INFO_BILL");
		} else {
			setAnalyticClevertap("action", "Action_ConfirmContactInformation_Error", "View_ContactInformation_Screen", null);
			setModalError(true)
		}
	};

	const checkKTP = () => {
		if (!infoBill.idCardNumber || !infoBill.taxPayerNumber) {
			setOpenModalKTP(true)
		} else {
			continueOrder()
		}
	}

	const continueOrder = () => {
		const { dataCustomer } = props;
		if (dataAddress) {
			if (infoBill.userInfoId.includes('00000000') || infoBill.userInfoId == null && update) {
				saveBilling()
			}
			else if (update) {
				putInformation()
			} else {
				setAnalyticClevertap("action", "Action_ConfirmContactInformation_Success", "View_ContactInformation_Screen", null);
				props.push(MENU.DELIVERY_METHODE, props.location.state);
			}
		} else if (dataCustomer) {
			if (infoBill.userInfoId.includes('00000000') || infoBill.userInfoId == null && update) {
				saveBilling()
			}
			else if (update) {
				putInformation()
			} else {
				setAnalyticClevertap("action", "Action_ConfirmContactInformation_Success", "View_ContactInformation_Screen", null);
				props.push(MENU.DELIVERY_METHODE, props.location.state);
			}
		} else {
			setOpenModalSelectAddress(true)
		}
	}

	const clickToChangeAddress = () => {
		const { state } = props.location
		props.push(MENU.CHANGE_ADDRESS, state);
	}

	const _renderSkeleton = () => {
		return (
			<div>
				<Col className="contactInformation">
					<h3 className="styleCIBold">
						<Skeleton width={250} height={30} />
					</h3>
					<Col className="formAddress">
						<Form>
							<FormGroup className="mb-3">
								<Skeleton width={600} height={40} />
							</FormGroup>
							<FormGroup className="mb-1">
								<Skeleton width={600} height={40} />
							</FormGroup>
							<FormGroup className="mb-3">
								<Skeleton width={600} height={40} />
							</FormGroup>
							<hr style={{ marginTop: '2.5rem', width: '100%' }}></hr>
							<h3 className="styleBABold">
								<Skeleton width={250} height={30} />
							</h3>
							<FormGroup className="mb-3">
								<Skeleton width={600} height={40} />
							</FormGroup>
							<FormGroup className="mb-3">
								<Skeleton width={600} height={40} />
							</FormGroup>
							<Row>
								<Col md={9}>
									<Skeleton width={320} height={30} />
								</Col>
								<Col md={3}>
									<FormGroup className="mb-3">
										<Skeleton width={110} height={30} />
									</FormGroup>
								</Col>
							</Row>
							<FormGroup className="mb-3">
								<Skeleton width={600} height={40} />
							</FormGroup>
							<Col className="mb-2 p-0" sm="12">
								<Skeleton width={600} height={40} />
							</Col>
							<hr style={{ marginTop: '1.5rem', width: '100%' }}></hr>
							<Col lg="12" className="pr-0">
								<Skeleton width={485} height={30} />
							</Col>
						</Form>
					</Col>
				</Col>
			</div>
		)
	}

	const _renderSkeletonPS = () => {
		return (
			<div className="containerPurchaseSummary" >
				<div className="cardPurchaseSummary">
					<Col className="kontenPurchaseSummary">
						<Col className="pl-0 teksCardPurchaseSummary">
							<Skeleton width={150} height={30} />
						</Col>
						<Col className="p-0 mb-4 boxTotalPS">
							<Row className="subTotalPS">
								<div className="teksSubTotalPS">
									<Skeleton width={100} height={20} />
								</div>
								<div className="hargaSubTotalPS">
									<Skeleton width={100} height={20} />
								</div>
							</Row>
							<Row className="subTotal">
								<div className="teksSubTotalPS">
									<Skeleton width={100} height={20} />
								</div>
								<div className="hargaSubTotalPS">
									<Skeleton width={100} height={20} />
								</div>
							</Row>
							<hr style={{ borderTop: '1px dashed #707070', opacity: '0.5', marginTop: '1rem', width: '100%', marginBottom: '0' }}></hr>
							<Row className="subTotal">
								<div className="teksSubTotalPS">
									<Skeleton width={100} height={20} />
								</div>
								<div className="hargaSubTotal1PS">
									<Skeleton width={100} height={20} />
								</div>
							</Row>
						</Col>
					</Col>
				</div>
			</div>
		)
	}

	const _renderPurchaseSummary = () => {
		if (!props.purchaseSummary || openModalErrorPurchase) {
			return (
				<div>
					{_renderSkeletonPS()}
				</div>
			)
		}
		else {
			return (
				<div className="containerPurchaseSummary" >
					<div className="cardPurchaseSummary">
						<Col className="kontenPurchaseSummary">
							<Col className="pl-0 teksCardPurchaseSummary">
								Ringkasan Pembayaran
							</Col>
							<Col className="p-0 mb-4 boxTotalPS">
								<Row className="subTotalPS">
									<div className="teksSubTotalPS">
										Sub Total
									</div>
									<div className="hargaSubTotalPS">
										Rp {formatCurrency(props.purchaseSummary.subTotalPrice)}
									</div>
								</Row>
								<Row className="subTotal">
									<div className="teksSubTotalPS">
										PPN
									</div>
									<div className="hargaSubTotalPS">
										Rp {formatCurrency(props.purchaseSummary.subTotalPrice * tax)}
									</div>
								</Row>
								<hr style={{ borderTop: '1px dashed #707070', opacity: '0.5', marginTop: '1rem', width: '100%', marginBottom: '0' }}></hr>
								<Row className="subTotal">
									<div className="teksSubTotalPS">
										Total Pembayaran
									</div>
									<div className="hargaSubTotal1PS">
										Rp {formatCurrency(props.purchaseSummary.totalPrice)}
									</div>
								</Row>
							</Col>
						</Col>
					</div>
				</div>
			)
		}
	}

	const _renderDeliveryAddress = () => {
		if (dataAddress) {
			return (
				<div className="boxDeliveryAddress">
					<p className="labelDeliveryAddress">{dataAddress.addressLabel}</p>
					<p className="nameDeliveryAddress" style={{ marginBottom: 6 }}>{capitalizeEachWord(dataAddress.fullName)} ({dataAddress.contactNumber})</p>
					<p className="nameDeliveryAddress">
						{capitalizeEachWord(dataAddress.city)}, {" "}
						{capitalizeEachWord(dataAddress.districts)}, {" "}
						{capitalizeEachWord(dataAddress.village)}, {" "}
						{capitalizeEachWord(dataAddress.province)},
					</p>
					<p className="detailDeliveryAddress">{capitalizeEachWord(dataAddress.address)}</p>
					<p className="actionDeliveryAddress" onClick={() => clickToChangeAddress()}>Ubah</p>
				</div>
			)
		} else {
			return (
				<div className="rowSelectAddress">
					<div className="divIconDelivery">
						<img src={IconDelivery} className="iconDelivery" />
					</div>
					<div className="divTextDelivery">
						<p className="textDelivery">Alamat Pengiriman</p>
					</div>
					<div className="divBtnSelectAddress">
						<p className="textBtnSelectAddress" onClick={() => clickToChangeAddress()}>Pilih Alamat</p>
					</div>

				</div>
			)
		}
	};

	const _renderDeliveryAddressCustomerUT = () => {
		const { dataCustomer } = props;
		if (dataCustomer) {
			return (
				<div className="boxDeliveryAddress">
					<p className="labelDeliveryAddress">{dataCustomer.customerName}</p>
					<p className="detailDeliveryAddress">{capitalizeEachWord(dataCustomer.address)}</p>
				</div>
			);
		}
	};

	const _renderInformation = () => {
		const { user } = props.user;
		let dataPosition = [infoBill?.position]
		if (dataAttributeName && dataAttributeName !== null) {
			for (let i = 0; i < dataAttributeName.data.length; i++) {
				if (dataAttributeName.data[i].value !== dataPosition[0]) {
					dataPosition.push(dataAttributeName.data[i].value)
				}
			}
		}
		if (!props.infoBilling || openModalErrorPurchase) {
			return (
				<div>
					{_renderSkeleton()}
				</div>
			)
		}
		else {
			return (
				<>
					<Col className="contactInformation">
						<h3 className="styleCIBold">
							Kontak Informasi
						</h3>
						<Col className="formAddress">
							<Form>
								<FormGroup className="mb-3">
									<Label for="phoneNumber">Nomor Telepon <span style={{ color: 'red' }}>*</span></Label>
									<Input className="styleIsiForm"
										onKeyPress={(event) => {
											if (!/[0-9]/.test(event.key)) {
												event.preventDefault();
											}
										}}
										maxLength="13"
										type="tel"
										id="phoneNumber"
										value={infoBill?.contactNumber != "string" ? infoBill?.contactNumber : ''}
										onChange={handleInputChange}
										placeholder="Masukkan nomor telepon"
										name="contactNumber"
									/>
									{invalidContactNumber == true ? <p className="mt-1 error-message">Masukkan nomor telepon dengan benar</p> : null}
								</FormGroup>
								<FormGroup className="mb-1">
									<Label for="email">Email <span style={{ color: 'red' }}>*</span></Label>
									<Input className="styleIsiForm" type="email" id="contactEmail" maxLength="100"
										value={infoBill?.email != "string" ? infoBill?.email : ''}
										onChange={handleInputChange}
										placeholder="Masukkan email"
										name="email"
										style={{ backgroundColor: '#ededed' }}
										disabled
									/>
								</FormGroup>
								<FormGroup className="mb-3">
									<Label for="selectRole">Jabatan <span style={{ color: 'red' }}>*</span></Label>
									<Input className="styleIsiForm" type="select" id="selectRole"
										value={infoBill?.position}
										onChange={handleInputChange}
										onClick={handleClickPosition}
										placeholder="Pilih Jabatan"
										name="position">
										{dataPosition.map((item) => {
											if (item !== undefined) {
												return (<option>{item}</option>)
											}
										})}
									</Input>
									{invalidPosition ? <p className="mt-1 error-message">Jabatan tidak boleh kosong</p> : null}
								</FormGroup>

								<FormGroup className="mb-3">
									<Label for="labelAlamat">Nomor Kartu Tanda Penduduk <span style={{ color: 'red' }}>*</span></Label>
									<Input className="styleIsiForm" type="text" id="nik" maxLength="16"
										style={invalidKTP ? { borderColor: 'red' } : null}
										value={infoBill?.idCardNumber != "string" ? infoBill?.idCardNumber : ''}
										onChange={handleInputChange}
										placeholder="Masukkan Nomor Kartu Tanda Penduduk"
										name="idCardNumber"
										onKeyPress={(event) => {
											if (!/[0-9]/.test(event.key)) {
												event.preventDefault();
											}
										}}
									/>
									{invalidKTP ? <p className="mt-1 error-message">Masukkan 16 digit nomor KTP dengan benar</p> : null}
								</FormGroup>
								<FormGroup className="mb-3">
									<Label for="fullName">Nomor NPWP</Label>
									<Input className="styleIsiForm"
										onKeyPress={(event) => {
											if (!/[0-9]/.test(event.key)) {
												event.preventDefault();
											}
										}}
										type="text"
										id="fullName"
										maxLength="15"
										value={infoBill?.taxPayerNumber != "string" ? infoBill?.taxPayerNumber : ''}
										onChange={handleInputChange}
										placeholder="Masukkan Nomor NPWP"
										name="taxPayerNumber"
									/>
									{invalidNPWP ? <p className="mt-1 error-message">Masukkan 15 digit nomor NPWP dengan benar</p> : null}
								</FormGroup>
							</Form>
							<hr style={{ margin: '1.5rem 0', width: '100%' }}></hr>
						</Col>
						<h3 className="styleCIBold">
							Alamat Pengiriman
						</h3>
						{props.user?.user.customerCode == "ONETIMESTD" ?
							_renderDeliveryAddress() : _renderDeliveryAddressCustomerUT()
						}
						<Col className="formAddress">
							<hr style={{ marginTop: '1.5rem', width: '100%' }}></hr>
							{
								props.loading || invalidKTP || invalidNPWP || errorForm ||
									(user.customerCode == "ONETIMESTD" && !dataAddress ? true : false) ||
									(user.customerCode != "ONETIMESTD" && !props.dataCustomer ? true : false) ?
									<div className='btnContinue' style={{ backgroundColor: '#b9b9b9' }}>
										<p className='titleBtn' style={{ color: '#000000' }}>Lanjut pemesanan </p>
									</div> :
									<div className='btnContinue' onClick={checkKTP} style={{ backgroundColor: '#ffd500' }}>
										<p className='titleBtn' style={{ color: '#000000' }}>Lanjut pemesanan </p>
									</div>
							}
						</Col>
					</Col>
				</>
			)
		}
	}

	const _renderBreadCrumps = () => {
		const breadcrums = [
			{
				'url': MENU.HOME,
				'name': 'Part Online Transaction'
			},
			{
				'url': MENU.BUCKET_LIST,
				'name': 'Keranjang'
			}
		];
		return (
			<Breadcrumb
				linkBreadcrumb={breadcrums}
				typography={"Informasi Kontak"}
			/>
		)
	};

	const _renderModalKTP = () => {
		return (
			<Modal className='modal-confirm-ktp'
				open={openModalKTP}
				onClose={() => setOpenModalKTP(false)}>
				<DialogContent style={{ overflow: 'hidden' }} className='container-modal-shippment'>
					<div className='confirm-modal-body'>
						<p className='titleConfirm'>{'Masukan NPWP'}</p>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<img src={IconCautionYellow} className='iconModal' />
						</div>
						<h5 className='titleAvailable'>
							Harap mengisi nomor NPWP anda untuk melanjutkan transaksi jika terdapat kebutuhan untuk melakukan restitusi pajak (PPn)
						</h5>
						<div className='header-button-upload'>
							<div className='btn' style={{ backgroundColor: '#d8d8d8' }}
								onClick={() => setOpenModalKTP(false)}>
								<p>Kembali</p>
							</div>
							<div className='btn' style={{ backgroundColor: '#ffd500' }}
								onClick={() => { setOpenModalKTP(false); continueOrder(); }}>
								<p>Nanti</p>
							</div>
						</div>
						<div className="con-more-info-ktp">
							<span>Butuh informasi tambahan? Kontak kami</span>
							<div className="con-more-info-image">
								<img className='marginIcon' src={IconUTCall} alt="ut-call" />
								<img style={{ cursor: 'pointer' }} src={IconMail} alt="mail-icon" onClick={() => { window.open('mailto:utmobileapp@unitedtractors.com?subject=Question for UT Connect Team') }} />
							</div>
						</div>
					</div>
				</DialogContent>
			</Modal>
		)
	}

	const _renderModalErrorPurchase = () => {
		return (
			<ModalErrorPurchase
				isOpen={openModalErrorPurchase}
				onSubmit={() => props.push(MENU.HOME)}
				errorText={"Kamu tidak dapat mengakses laman ini"}
				title={"Huhu sayang sekali..."}
			/>
		);
	};

	const _renderModalError = () => {
		return (
			<ModalAccessDenied
				isOpen={modalError}
				isClose={() => setModalError(false)}
				errorText={"Terjadi kegagalan silahkan coba kembali."}
				title={"Huhu sayang sekali..."}
			/>
		);
	};

	const _renderModalSelectAddress = () => {
		return (
			<ModalAccessDenied
				isOpen={openModalSelectAddress}
				isClose={() => setOpenModalSelectAddress(false)}
				errorText={"Silahkan pilih alamat untuk melanjutkan proses"}
				title={"Huhu sayang sekali..."}
			/>
		);
	};

	return (
		<div>
			<div className="paddingBreadCrumps">
				{_renderBreadCrumps()}
			</div>
			<div className="paddingContactInformation">
				{_renderModalKTP()}
				{_renderModalErrorPurchase()}
				{_renderModalError()}
				{_renderModalSelectAddress()}
				{_renderInformation()}
				{_renderPurchaseSummary()}
			</div>
		</div>
	)

}

export default BillingAddress;