import React, { useState, useEffect } from 'react';
import './ModalEditAddress.scss';
import {
    Modal,
    DialogContent,
} from '@material-ui/core';
import { InputBase, Paper } from '@material-ui/core';
import {
    Row,
    Col,
    Input,
} from 'reactstrap';

const ModalEditAddress = ({ isOpen, isClose, dataEditAddress, dataDistrict, dataPostalCode, dataCity, dataProvince, dataVillages, dataPostalCodes, handleChangeProvince, handleChangeCity, handleChangePostalCode, handleSubmit, resetAll }) => {

    const dataLabel = ["Rumah", "Kantor", "Gudang"];
    const [billingId, setBillingId] = useState(null);
    const [addressLabel, setAddressLabel] = useState(null);
    const [errAddressLabel, setErrAddressLabel] = useState(false);
    const [fullName, setFullName] = useState(null);
    const [errFullName, setErrFullName] = useState(false);
    const [contactNumber, setContactNumber] = useState(null);
    const [errContactNumber, setErrContactNumber] = useState(false);
    const [districtName, setDistrictName] = useState(null);
    const [errDistrictName, setErrDistrictName] = useState(false);
    const [villages, setVillages] = useState(null);
    const [errVillages, setErrVillages] = useState(false);
    const [postalCode, setPostalCode] = useState(null);
    const [errPostalCode, setErrPostalCode] = useState(false);
    const [provinceName, setProvinceName] = useState(null);
    const [city, setCity] = useState(null);
    const [address, setAddress] = useState(null);
    const [errAddress, setErrAddress] = useState(false);
    const [isPrimary, setIsPrimary] = useState(null);
    const [optionPostalCode, setOptionPostalCode] = useState(null);
    const [openSuggestion, setOpenSuggestion] = useState(false);

    useEffect(() => {
        if (dataPostalCode && dataPostalCode.length > 0) {
            setCity(dataPostalCode[0].cityName)
            setProvinceName(dataPostalCode[0].provinceName)
            setDistrictName(dataPostalCode[0].districtName)
        } else if (dataPostalCode && dataPostalCode.length == 0) {
            resetState()
        }
        if (dataPostalCodes) {
            setOptionPostalCode(dataPostalCodes)
        }
    }, [dataPostalCode, dataPostalCodes])

    useEffect(() => {
        if (dataEditAddress) {
            handleChangeCity(dataEditAddress.districts)
            setOptionPostalCode(null)
            setBillingId(dataEditAddress.billingId)
            setAddressLabel(dataEditAddress.addressLabel)
            setFullName(dataEditAddress.fullName)
            setContactNumber(dataEditAddress.contactNumber)
            setCity(dataEditAddress.city)
            setProvinceName(dataEditAddress.province)
            setDistrictName(dataEditAddress.districts)
            setPostalCode(dataEditAddress.postalCode)
            setAddress(dataEditAddress.address.slice(0, 70))
            setIsPrimary(dataEditAddress.isPrimary)
            setVillages(dataEditAddress.village)
        }
    }, [dataEditAddress]);

    useEffect(() => {
        if (dataDistrict) {
            for (let i = 0; dataDistrict.length > i; i++) {
                if (dataDistrict[i].villages.includes(villages)) {
                    setOptionPostalCode(dataDistrict[i].postalCodes)
                }
            }
        }
    }, [villages])

    const resetState = () => {
        setCity(null)
        setDistrictName(null)
        setProvinceName(null)
        resetForm()
    }

    const resetForm = () => {
        resetAll();
        setPostalCode(null);
    }

    const handleChangeDistrict = (e) => {
        const selectedDistrict = e.target.value

        for (let i = 0; dataDistrict.length > i; i++) {
            if (dataDistrict[i].districtName == selectedDistrict) {
                setProvinceName(dataDistrict[i].provinceName)
                setCity(dataDistrict[i].cityName)
                setOptionPostalCode(dataDistrict[i].postalCodes)
            }
        }
    }

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        if (name == 'alamat') {
            if (value == "" || value == null) {
                setErrAddressLabel(true)
            } else {
                setErrAddressLabel(false)
            }
            setAddressLabel(value)
        } else if (name == 'penerima') {
            if (value == "" || value == null) {
                setErrFullName(true)
            } else {
                setErrFullName(false)
            }
            setFullName(value)
        } else if (name == 'telepon') {
            if (value == "" || value == null) {
                setErrContactNumber(true)
            } else {
                setErrContactNumber(false)
            }
            const val1 = value.replace(/[^0-9]+/g, "");
            const val2 = val1.slice(0, 13);
            setContactNumber(val2)
        } else if (name == 'kecamatan') {
            if (value == "" || value == null) {
                setErrDistrictName(true)
            } else {
                setErrDistrictName(false)
            }
            setDistrictName(value)
        } else if (e.target.name == 'kelurahan') {
            if (value == "" || value == null) {
                setErrVillages(true)
            } else {
                setErrVillages(false)
            }
            setVillages(value)
        } else if (e.target.name == 'kodepos') {
            if (value == "" || value == null) {
                setErrPostalCode(true)
            } else {
                setErrPostalCode(false)
            }
            setPostalCode(value)
        } else if (name == 'alamatLengkap') {
            if (value == "" || value == null) {
                setErrAddress(true)
            } else {
                setErrAddress(false)
            }
            setAddress(value.slice(0, 30))
        }
    }

    const _handleChangeProvince = (value) => {
        handleChangeProvince(value)
        setProvinceName(value)
        setCity(null)
        setDistrictName(null)
    }

    const submitAddress = () => {
        if (
            !fullName ||
            !contactNumber ||
            !addressLabel ||
            !city ||
            !address ||
            !postalCode ||
            !provinceName ||
            !districtName ||
            !villages
        ) {
            if (!fullName) {
                setErrFullName(true);
            }
            if (!contactNumber) {
                setErrContactNumber(true);
            }
            if (!addressLabel) {
                setErrAddressLabel(true);
            }
            if (!address) {
                setErrAddress(true);
            }
            if (!districtName) {
                setErrDistrictName(true);
            }
            if (!villages) {
                setErrVillages(true);
            }
            if (!postalCode) {
                setErrPostalCode(true);
            }
        }
        if (
            billingId &&
            fullName &&
            contactNumber &&
            addressLabel &&
            city &&
            address &&
            postalCode &&
            provinceName &&
            districtName &&
            villages
        ) {
            const data = {
                billingId: billingId,
                fullName: fullName,
                contactNumber: contactNumber,
                addressLabel: addressLabel,
                city: city,
                address: address,
                postalCode: postalCode,
                province: provinceName,
                districts: districtName,
                isPrimary: isPrimary,
                village: villages
            }
            handleSubmit(data)
            resetState();
            isClose()
        }
    }

    const handleSuggestion = (value) => {
        handleChangeCity(value)
        setDistrictName(value)
        setOpenSuggestion(false)
    }

    const renderListAlamat = () => {
        return (
            <div className='container-shippment-kurir shippment-margin'>
                <Col className='marginLabel'>
                    <p className="labelAddress">Label Alamat</p>
                    <Input type="select" className="inputAddress" name="alamat" id="alamat" placeholder="--Alamat--" value={addressLabel} onChange={(e) => handleChange(e)}>
                        {dataLabel.map((label) => (
                            <option value={label}>{label}</option>
                        ))}
                    </Input>
                    {errAddressLabel ? <p className="error-message">Label alamat wajib diisi</p> : null}
                </Col>
                <Row className='marginLabel styleDivide'>
                    <Col className='styleBig'>
                        <p className="labelAddress">Nama Penerima</p>
                        <Input className="inputAddress" name="penerima" id="penerima" placeholder="--Nama Penerima--" value={fullName} onChange={(e) => handleChange(e)} />
                        {errFullName ? <p className="error-message">Nama penerima wajib diisi</p> : null}
                    </Col>
                    <Col className='pl-0 styleSmall'>
                        <p className="labelAddress">No Telepon</p>
                        <Input className="inputAddress" name="telepon" id="telepon" placeholder="--No Telepon--" value={contactNumber} onChange={(e) => handleChange(e)} />
                        {errContactNumber ? <p className="error-message">Nomor telepon wajib diisi</p> : null}
                    </Col>
                </Row>
                <Row className='marginLabel styleDivide'>
                    <Col className='pr-0'>
                        <p className="labelAddress">Kecamatan</p>
                        <Input className="inputAddress" name="kecamatan" id="kecamatan" placeholder="--Kecamatan--" value={districtName}
                            onChange={(event) => { handleChangeCity(event.target.value); setOpenSuggestion(true); setPostalCode(null); handleChangePostalCode(""); handleChange(event) }} />
                        {dataDistrict && openSuggestion ? (
                            <div className="cardSuggestion">
                                {dataDistrict && dataDistrict.map((suggestion, i) => {
                                    return (
                                        <p key={i} className="textSuggestion" onClick={() => handleSuggestion(suggestion.districtName)}>{suggestion.districtName}</p>
                                    )
                                })}
                            </div>
                        ) : null}
                        {errDistrictName ? <p className="error-message">Kecamatan wajib diisi</p> : null}
                    </Col>
                    <Col className='pr-0'>
                        <p className="labelAddress">Kelurahan</p>
                        {dataVillages ? (
                            <Input type='select' className="inputAddress" name="kelurahan" id="kelurahan" placeholder="Kelurahan" value={villages}
                                onChange={(event) => handleChange(event)}>
                                {dataVillages.map((item) => {
                                    return (
                                        <option value={item}>{item}</option>
                                    )
                                })}
                            </Input>
                        ) : <Input type="text" className="inputAddress" name="kelurahan" id="kelurahan" placeholder="Kelurahan" value={villages} />}
                        {errVillages ? <p className="error-message">Kelurahan wajib diisi</p> : null}
                    </Col>
                    <Col>
                        <p className="labelAddress">Kode Pos</p>
                        {optionPostalCode !== null ?
                            <Input type="select" className="inputAddress" name="kodepos" id="kodepos" placeholder="--Kode Pos--" value={postalCode}
                                onChange={(event) => { handleChangePostalCode(event.target.value); setPostalCode(event.target.value) }}>
                                <option value={postalCode}>{postalCode}</option>
                                {
                                    optionPostalCode.map((item) => {
                                        return (
                                            <option value={item}>{item}</option>
                                        )
                                    })
                                }
                            </Input> :
                            <Input type="search" className="inputAddress" name="kodepos" id="kodepos" placeholder="--Kode Pos--" value={postalCode}
                                onChange={(event) => { handleChangePostalCode(event.target.value); setPostalCode(event.target.value) }}
                            />
                        }
                        {errPostalCode ? <p className="error-message">Kode pos wajib diisi</p> : null}
                    </Col>
                </Row>
                <Row className='marginLabel styleDivide'>
                    <Col className='pr-0 styleSmall'>
                        <p className="labelAddress">Provinsi</p>
                        {provinceName ? (
                            <Input className="inputAddress" name="provinsi" id="provinsi" placeholder="--Provinsi--" value={provinceName} />
                        ) : (
                            <Input type='select' className="inputAddress" name="provinsi" id="provinsi" placeholder="--Provinsi--" value={provinceName ? provinceName : null}
                                onChange={(event) => { handleChangeProvince(event.target.value); setProvinceName(event.target.value) }}>
                                <option>--Provinsi--</option>
                                {dataProvince ?
                                    dataProvince.map((item) => {
                                        return (
                                            <option>{item}</option>
                                        )
                                    }) : null}
                            </Input>
                        )}
                    </Col>
                    <Col className='styleBig'>
                        <p className="labelAddress">Kota/Kabupaten</p>
                        {city ? (
                            <Input className="inputAddress" name="kotakabupaten" id="kotakabupaten" placeholder="--Kota/Kabupaten--" value={city} />
                        ) : (
                            <Input type='select' className="inputAddress" name="kotakabupaten" id="kotakabupaten" placeholder="--Kota/Kabupaten--" value={city}
                                onChange={(event) => setCity(event.target.value)}>
                                <option>--Kota/Kabupaten--</option>
                                {dataCity !== null ?
                                    dataCity.map((item) => {
                                        return (
                                            <option>{item}</option>
                                        )
                                    }) : null}
                            </Input>
                        )}
                    </Col>
                </Row>
                <p className="labelAddress">Alamat Detail</p>
                <Input type='textarea' className="inputAlamat" name="alamatLengkap" id="alamatLengkap" placeholder="--Alamat Detail--" value={address} onChange={(e) => handleChange(e)} />
                {errAddress ? <p className="error-message">Alamat detail wajib diisi</p> : null}
            </div>
        )
    }


    return (
        <Modal
            className='modal-shippment'
            open={isOpen}
            onClose={isClose}
        >
            <DialogContent className='container-modal-shippment'>
                <div className='modal-address-body'>
                    <p className='titleNewAddress'>Ubah Alamat</p>
                    {renderListAlamat()}
                    <div className='header-button-address'>
                        <div onClick={() => { isClose(); resetState() }} className='cardCancel'>
                            <p className='textSave' >Kembali</p>
                        </div>
                        <div onClick={() => submitAddress()} className='cardSave'>
                            <p className='textSave' >Kirim</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Modal>
    )

}

export default ModalEditAddress;