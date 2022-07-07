import React, { useState, useEffect } from 'react';
import './ModalAddAddress.scss';
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

const ModalAddAddress = ({ isOpen, isClose, dataDistrict, dataPostalCode, dataCity, dataProvince, dataVillages, dataPostalCodes, handleChangeProvince, handleChangeCity, handleChangePostalCode, handleSubmit, resetAll }) => {

    const dataLabel = ["Rumah", "Kantor", "Gudang"];
    const [addressLabel, setAddressLabel] = useState(dataLabel[0]);
    const [errAddressLabel, setErrAddressLabel] = useState(null);
    const [fullName, setFullName] = useState(null);
    const [ErrFullName, setErrFullName] = useState(false);
    const [contactNumber, setContactNumber] = useState(null);
    const [errContactNumber, setErrContactNumber] = useState(false);
    const [city, setCity] = useState(null);
    const [villages, setVillages] = useState(null);
    const [errVillages, setErrVillages] = useState(false);
    const [provinceName, setProvinceName] = useState(null);
    const [districtName, setDistrictName] = useState(null);
    const [errDistrictName, setErrDistrictName] = useState(false);
    const [postalCode, setPostalCode] = useState(null);
    const [errPostalCode, setErrPostalCode] = useState(false);
    const [optionPostalCode, setOptionPostalCode] = useState(null);
    const [address, setAddress] = useState(null);
    const [errAddress, setErrAddress] = useState(false);
    const [openSuggestion, setOpenSuggestion] = useState(false);

    useEffect(() => {
        if (dataDistrict == null) {
            setOptionPostalCode(null)
            setCity(null)
            setDistrictName(null)
            setProvinceName(null)
        }
        if (dataPostalCodes) {
            setOptionPostalCode(dataPostalCodes)
        }
        if (dataPostalCode && dataPostalCode.length > 0) {
            setCity(dataPostalCode[0].cityName)
            setProvinceName(dataPostalCode[0].provinceName)
            setDistrictName(dataPostalCode[0].districtName)
        }
    }, [dataDistrict, dataPostalCode, dataPostalCodes])

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
        setPostalCode(null)
    }

    const resetForm = () => {
        resetAll();
        setPostalCode(null);
    }

    const _renderListDistrict = () => {
        if (dataDistrict) {
            {
                dataDistrict.map((item, i) => {
                    return (
                        <div>
                            <p>{item.cityName}</p>
                        </div>
                    )
                })
            }
        }
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
        const value = e.target.value
        if (e.target.name == 'alamat') {
            if (value == "" || value == null) {
                setErrAddressLabel(true)
            } else {
                setErrAddressLabel(false)
            } setAddressLabel(value)
        } else if (e.target.name == 'penerima') {
            if (value == "" || value == null) {
                setErrFullName(true)
            } else {
                setErrFullName(false)
            }
            setFullName(value)
        } else if (e.target.name == 'telepon') {
            if (value == "" || value == null) {
                setErrContactNumber(true)
            } else {
                setErrContactNumber(false)
            }
            const val1 = value.replace(/[^0-9]+/g, "");
            const val2 = val1.slice(0, 13);
            setContactNumber(val2)
        } else if (e.target.name == 'kecamatan') {
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
        } else if (e.target.name == 'alamatLengkap') {
            if (value == "" || value == null) {
                setErrAddress(true)
            } else {
                setErrAddress(false)
            }
            setAddress(value.slice(0, 30));
        }
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
                fullName: fullName,
                contactNumber: contactNumber,
                addressLabel: addressLabel,
                city: city,
                address: address,
                postalCode: postalCode,
                province: provinceName,
                districts: districtName,
                village: villages
            }
            handleSubmit(data)
            isClose()
            resetState()
        }
    }

    const handleSuggestion = (value) => {
        handleChangeCity(value)
        setDistrictName(value)
        setOpenSuggestion(false)
    }

    const renderListAlamat = () => {
        return (
            <div className='container-shippment-kurir shippment-margin' onClick={() => setOpenSuggestion(false)}>
                <Col className='marginLabel'>
                    <p className="labelAddress">Label Alamat</p>
                    <Input type="select" className="inputAddress" name="alamat" id="alamat" placeholder="--Label Alamat--" value={addressLabel} onChange={(e) => handleChange(e)}>
                        {dataLabel.map((label) => (
                            <option value={label}>{label}</option>
                        ))}
                    </Input>
                    {errAddressLabel ? <p className="error-message">Label alamat wajib diisi</p> : null}
                </Col>
                <Row className='marginLabel styleDivide'>
                    <Col className='styleBig'>
                        <p className="labelAddress">Nama Penerima</p>
                        <Input className="inputAddress" name="penerima" id="penerima" placeholder="--Nama Penerima--" onChange={(e) => handleChange(e)} />
                        {ErrFullName ? <p className="error-message">Nama penerima wajib diisi</p> : null}
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
                        <Input type='select' className="inputAddress" name="kelurahan" id="kelurahan" placeholder="Kelurahan" value={villages}
                            onChange={(event) => handleChange(event)}>
                            <option>--Kelurahan--</option>
                            {dataVillages ?
                                dataVillages.map((item) => {
                                    return (
                                        <option>{item}</option>
                                    )
                                }) : null}
                        </Input>
                        {errVillages ? <p className="error-message">Kelurahan wajib diisi</p> : null}
                    </Col>
                    <Col>
                        <p className="labelAddress">Kode Pos</p>
                        {optionPostalCode && !postalCode ?
                            <Input type="select" className="inputAddress" name="kodepos" id="kodepos" placeholder="--Kode Pos--"
                                onChange={(event) => { handleChangePostalCode(event.target.value); handleChange(event) }}>
                                <option>--Kode Pos--</option>
                                {
                                    optionPostalCode.map((item) => {
                                        return (
                                            <option> {item}</option>
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
                            <Input type='select' className="inputAddress" name="kotakabupaten" id="kotakabupaten" placeholder="--Kota/Kabupaten--" value={city} onChange={(event) => setCity(event.target.value)}>
                                <option>--Kota/Kabupaten--</option>
                                {dataCity ?
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
                    <p className='titleNewAddress'>Alamat Baru</p>
                    {_renderListDistrict()}
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

export default ModalAddAddress;