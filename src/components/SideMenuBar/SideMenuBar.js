import React from 'react';
import './SideMenuBar.scss';
import {
    ListItemText,
    ListItemIcon,
    ListItem,
    List,
    Drawer,
    Collapse,
    Modal,
    DialogContent
} from '@material-ui/core';
import { DcaLogo, } from 'assets/images';
import { Assignment, Setting, LogOut } from 'assets/icons';
import { MENU } from 'constants/menu'
import { USER_STORAGE, JOB_STORAGE, PROBLEMLOG_STORAGE } from 'constants/storage'


class SideMenuBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogoutModalShow: false,
            jobMenuExpanded: false,
            backlogMenuExpanded: false,
        }
    }
    //Handle Click Menu
    _handleClick = (menu, subMenu) => {
        if (menu === MENU.JOBS) {
            if (subMenu !== '')
                this.props.push(subMenu);
        } else if (menu === MENU.BACKLOG) {
            if (subMenu !== '')
                this.props.push(subMenu);
        } else {
            this.props.push(menu);
        }
    }

    //Handle Collapse Menu
    _toggleMenu = key => {

        if (key === MENU.JOBS) {
            const { jobMenuExpanded } = this.state
            this.setState({
                jobMenuExpanded: !jobMenuExpanded,
                backlogMenuExpanded: false,

            })
        } else if (key === MENU.BACKLOG) {
            const { backlogMenuExpanded } = this.state
            this.setState({
                backlogMenuExpanded: !backlogMenuExpanded,
                jobMenuExpanded: false,
            })
        }
        return;
    }
    _handleLogout = () => {
        localStorage.removeItem(USER_STORAGE)
        localStorage.removeItem(JOB_STORAGE)
        localStorage.removeItem(PROBLEMLOG_STORAGE)
        this.props.push(MENU.LOGIN)
        this.setState({
            isLogoutModalShow: false
        })
        // Reload page 
        window.location = document.URL
    }

    _renderLogOutModal = () => {
        return (
            <Modal
                className='modal-container'
                open={this.state.isLogoutModalShow}
                onClose={() => this.setState({ isLogoutModalShow: false })}
            >
                <DialogContent className='modal-content'>
                    <div className='logout-modal'>
                        {/* Translate Text */}
                        <p className='title'>Anda yakin ingin keluar ?</p>
                        <div className='btn-container'>
                            <div className='btn-yes' onClick={() => this._handleLogout}>Ya</div>
                            <div className='btn-no' onClick={() => this.setState({ isLogoutModalShow: false })}>Tidak</div>
                        </div>
                    </div>
                </DialogContent>
            </Modal>
        )
    }
    render() {
        let drawer = null;
        if (this.props.path !== MENU.LOGIN &&
            this.props.path !== `${MENU.LOGIN}/`
        )
            drawer = (
                <>
                    <Drawer
                        className='menu'
                        classes={{ paper: "drawer-paper", docked: "docked" }}
                        anchor='left'
                        variant={this.props.displayMode === 'web' ? 'permanent' : 'temporary'}
                        open={this.props.open}
                        onClose={this.props.onClose}
                    >
                        <img src={DcaLogo} alt='logo' className='dca-logo' />
                        <List>
                            {/* Side Menu For Dashboard */}
                            <ListItem
                                button
                                key='dashboard'
                                className={this.props.path === MENU.DASHBOARD ? 'menu-item-selected' : 'menu-item'}
                                onClick={() => this._handleClick(MENU.DASHBOARD, '')}
                            >
                                <ListItemIcon
                                    classes={{ root: 'icon-root' }}
                                >
                                    <img
                                        src={Assignment}
                                        alt='assignment icon'
                                        className='item-icon'
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary='Dashboard'
                                    classes={{ primary: 'item-text', root: 'item-text' }}
                                />
                            </ListItem>
                            {/* Side Menu For Jobs */}
                            <ListItem
                                button
                                key='job'
                                className={this.props.path.includes(MENU.JOBS) ? 'menu-item-selected' : 'menu-item'}
                                onClick={() => this._toggleMenu(MENU.JOBS)}
                            >
                                <ListItemIcon
                                    classes={{ root: 'icon-root' }}
                                >
                                    <img
                                        src={Assignment}
                                        alt='assignment icon'
                                        className='item-icon'
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary='Jobs Execution'
                                    classes={{ primary: 'item-text', root: 'item-text' }}
                                />
                            </ListItem>
                            <Collapse
                                in={this.state.jobMenuExpanded}
                                timeout='auto'
                                unmountOnExit
                            >
                                {/* Side Menu Jobs Summary */}
                                <List disablePadding>
                                    <ListItem
                                        button
                                        key='jobs-summary'
                                        className={this.props.path === MENU.JOBS_SUMMARY ? 'sub-menu-selected' : 'sub-menu'}
                                        onClick={() => this._handleClick(MENU.JOBS, MENU.JOBS_SUMMARY)}
                                    >
                                        <ListItemIcon
                                            classes={{ root: 'icon-root' }}
                                        >
                                            <img
                                                src={Assignment}
                                                alt='assignment-icon'
                                                className='item-icon'
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary='Jobs'
                                            classes={{ primary: 'item-text', root: 'item-text' }}
                                        />
                                    </ListItem>
                                </List>
                                {/* Side Menu Jobs Report */}
                                <List disablePadding>
                                    <ListItem
                                        button
                                        key='jobs-report'
                                        className={this.props.path === MENU.JOBS_REPORT ? 'sub-menu-selected' : 'sub-menu'}
                                        onClick={() => this._handleClick(MENU.JOBS, MENU.JOBS_REPORT)}
                                    >
                                        <ListItemIcon
                                            classes={{ root: 'icon-root' }}
                                        >
                                            <img
                                                src={Assignment}
                                                alt='assignment-icon'
                                                className='item-icon'
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary='Report'
                                            classes={{ primary: 'item-text', root: 'item-text' }}
                                        />
                                    </ListItem>
                                </List>
                            </Collapse>
                            {/*Side Menu For Backlog*/}
                            <ListItem
                                button
                                key='backlog'
                                className={this.props.path.includes(MENU.BACKLOG) ? 'menu-item-selected' : 'menu-item'}
                                onClick={() => this._toggleMenu(MENU.BACKLOG)}
                            >
                                <ListItemIcon
                                    classes={{ root: 'icon-root' }}
                                >
                                    <img
                                        src={Assignment}
                                        alt='assignment-icon'
                                        className='item-icon'
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary='Backlog'
                                    classes={{ primary: 'item-text', root: 'item-text' }}
                                />
                            </ListItem>
                            <Collapse
                                in={this.state.backlogMenuExpanded}
                                timeout='auto'
                                unmountOnExit
                            >
                                <List
                                    disablePadding
                                >
                                    <ListItem
                                        button
                                        key='backlogMonitoring'
                                        className={this.props.path === MENU.BACKLOG_MONITORING ? 'sub-menu-selected' : 'sub-menu'}
                                        onClick={() =>
                                            this._handleClick(MENU.BACKLOG, MENU.BACKLOG_MONITORING)
                                        }
                                    >
                                        <ListItemIcon
                                            classes={{ root: 'icon-root' }}
                                        >
                                            <img
                                                src={Assignment}
                                                alt='assignment-icon'
                                                className='item-icon'
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary='Monitoring'
                                            classes={{ primary: 'item-text', root: 'item-text' }}
                                        />
                                    </ListItem>
                                </List>
                            </Collapse>
                            {/*Side Menu For Problem Log*/}
                            <ListItem
                                button
                                key='problemLog'
                                className={this.props.path === MENU.PROBLEMLOG_MONITORING ? 'menu-item-selected' : 'menu-item'}
                                onClick={() => this._handleClick(MENU.PROBLEMLOG_MONITORING, '')}
                            >
                                <ListItemIcon
                                    classes={{ root: 'icon-root' }}
                                >
                                    <img
                                        src={Assignment}
                                        alt='assignment-icon'
                                        className='item-icon'
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary='Problemlog Monitoring'
                                    classes={{ primary: 'item-text', root: 'item-text' }}
                                />
                            </ListItem>
                            {/*Side Menu For Setting*/}
                            <ListItem
                                button
                                key='setting'
                                className={this.props.path === MENU.SETTING ? 'menu-item-selected' : 'menu-item'}
                                onClick={() => this._handleClick(MENU.SETTING, '')}
                            >
                                <ListItemIcon
                                    classes={{ root: 'icon-root' }}
                                >
                                    <img
                                        src={Setting}
                                        alt='assignment icon'
                                        className='item-icon'
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary='Settings'
                                    classes={{ primary: 'item-text', root: 'item-text' }}
                                />
                            </ListItem>
                            {/*Side Menu For Log Out*/}
                            <ListItem
                                button
                                key='logOut'
                                className={this.props.path === MENU.LOGOUT ? 'menu-item-selected' : 'menu-item'}
                                onClick={() => this.setState({
                                    isLogoutModalShow: true
                                })}
                            >
                                <ListItemIcon
                                    classes={{ root: 'icon-root' }}
                                >
                                    <img
                                        src={LogOut}
                                        alt='assignment icon'
                                        className='item-icon'
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary='Log Out'
                                    classes={{ primary: 'item-text', root: 'item-text' }}
                                />
                            </ListItem>
                        </List>
                        {this._renderLogOutModal()}
                    </Drawer>
                </>
            )
        return drawer
    }
}
export default SideMenuBar;