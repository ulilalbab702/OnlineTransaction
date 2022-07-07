import React, { useState } from 'react';
import { InputBase, Paper } from '@material-ui/core';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './CardInputPromo.scss';
import {
    Row,
    Col,
    Collapse,
    CardBody,
    Card,
    Button,
} from 'reactstrap';
import {
    TiPlus, TiMinus
} from 'react-icons/ti';
import {
    DropIcon,
    DropIconRotate
} from "assets/icons";
import { batteryKomatsu } from "assets/images";
import { IconZoom } from 'assets/icons'

const CardInputPromo = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [icon, setIcon] = useState(DropIconRotate);
    const [title, setTitle] = useState("Show Order Detail");
    const [count, setCount] = useState(0);

    function toggle(e) {
        setIsOpen(!isOpen);
        if (count == 0) {
            setCount(1)
            setTitle("Hide Order Detail");
            setIcon(DropIcon);
        }
        else {
            setCount(0)
            setTitle("Show Order Detail");
            setIcon(DropIconRotate)
        }
    }

    return (
        <div className="containerOrderDetail" >
            <div className="cardOrderDetail">
                <Col className="kontenOrderDetail">
                    <Row className="headerCardOrderDetail" onClick={toggle}>
                        <Col className="p-0 teksCardOrderDetail">
                            {title}
                        </Col>
                        <Col lg='6' md='7' xs="6" className="p-0">
                            <hr className="lineHeader"></hr>
                        </Col>
                        <Col lg='1' md='1' xs="1" className="p-0">
                            <img className='dropIconOrderDetail' src={icon} />
                        </Col>
                    </Row>
                    <Collapse isOpen={isOpen}>
                        <Row >
                            <Col lg='5' sm='4' xs='5' className="pr-0">
                                <div className='cardImageOrderDetail'>
                                    <img className='imageList'
                                        src={batteryKomatsu} />
                                </div>
                            </Col>
                            <Col lg='7' sm='8' xs='7' className="pl-0 cardListOrderDetail">
                                <p className='mb-1 titleKategoriProductOD'>Komatsu</p>
                                <p className='mb-1 titleProductOD'>Battery Komatsu K150A Normal..</p>
                                <p className='mb-1 titlePriceOD'>12.000.000</p>
                                <p className='mb-1 titlePriceDiscountOD'>10.000.000</p>
                                <Row className='cardMinPlusOD'>
                                    <div className='btnMin'>
                                        <TiMinus />
                                    </div>
                                    <div className='totalOrder'>
                                        <h4 className="mb-0 teksTotalOrder">2</h4>
                                    </div>
                                    <div className='btnPlus' >
                                        <TiPlus />
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                        <hr style={{ marginTop: '1.5rem', width: '100%', marginBottom: '1rem' }}></hr>
                        <Col lg='12' md='12' className="pl-0 teksCardOrderDetail">
                            Purchase Summary
                                </Col>
                        <Col className="p-0 mb-4">
                            <Row className="subTotal">
                                <div className="teksSubTotal">
                                    Sub Total
                                </div>
                                <div className="hargaSubTotal">
                                    400.000
                                </div>
                            </Row>
                            <Row className="subTotal">
                                <div className="teksSubTotal">
                                    PPN
                                </div>
                                <div className="hargaSubTotal">
                                    10.000
                                </div>
                            </Row>
                            <hr style={{ borderTop: '1px dashed #707070', opacity: '0.5', marginTop: '1rem', width: '100%', marginBottom: '0' }}></hr>
                            <Row className="subTotal">
                                <div className="teksSubTotal">
                                    Total Pembayaran
                                </div>
                                <div className="hargaSubTotal1">
                                    410.000
                                </div>
                            </Row>
                        </Col>
                    </Collapse>
                    <hr className="lineCheckout" style={{ height: '1px', backgroundColor: '#e6e6e6', opacity: '0.4' }}></hr>
                    <Col lg="12">
                        <div className='btnCheckout'>
                            <p className='titleCheckout'>Check Out</p>
                        </div>
                    </Col>
                </Col>
            </div>
        </div>
    );
}
export default CardInputPromo;