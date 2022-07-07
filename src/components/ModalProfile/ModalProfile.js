import React, { Component } from 'react';
import './ModalProfile.scss';
import {
    Modal,
    DialogContent,
} from '@material-ui/core';
import { InputBase, Paper } from '@material-ui/core';
import { TermCond, LogoutIcon, SettingIcon } from 'assets/icons';
import { profilePicture } from 'assets/images';
import { Row, Col } from 'reactstrap';

const ModalProfile = ({ isOpen, isClose }) => {

    return (
        <Modal
            className='modal-login'
            open={isOpen}
            onClose={isClose}
        >
            <DialogContent className='container-modal-profile'>
                <div className='profile-modal-body'>
                    <Row style={{ alignItems: 'center' }}>
                        <img className="avaPicture" src={profilePicture} />
                        <Col>
                            <p className="nameProfile">Yohanes Kurniawan</p>
                            <p className="emailProfile">Yohanesk@gmail.com</p>
                        </Col>
                    </Row>
                    <hr className="lineProfile" />
                    <Row style={{ alignItems: 'center' }}>
                        <img className="settingIcon" src={SettingIcon} />
                        <p className="titleProfile">Profile Setting</p>
                    </Row>
                    <hr className="lineProfile" />
                    <Row style={{ alignItems: 'center' }}>
                        <img className="termIcon" src={TermCond} />
                        <p className="titleProfile">Terms and conditions</p>
                    </Row>
                    <hr className="lineProfile" />
                    <Row style={{ alignItems: 'center' }}>
                        <img className="logoutIcon" src={LogoutIcon} />
                        <p className="titleProfile">Log Out</p>
                    </Row>
                </div>
            </DialogContent>
        </Modal>
    )
}

export default ModalProfile;