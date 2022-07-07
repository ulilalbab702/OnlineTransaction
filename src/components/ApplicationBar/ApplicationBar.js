import React from 'react';
import {AppBar,Toolbar} from '@material-ui/core';
import {AccountPic,DcaLogo} from 'assets/images';
import {getStorage} from 'utils/storage.helper';
import {USER_STORAGE} from 'constants/storage';
import {MenuToggle} from 'assets/icons';
import './ApplicationBar.scss';


class ApplicationBar extends React.PureComponent {
    render() {
        const {displayMode} = this.props
        let appBar = null;
        if (getStorage(USER_STORAGE)){
            if(displayMode === 'web'){
                appBar = (
                    <AppBar 
                        position='fixed' 
                        className='app-bar'
                    >
                        <Toolbar 
                            variant='dense'
                            className='tool-bar'
                        >
                            <p>
                            {/* Translate soon */}
                                {`Hi ${this.props.userData.firstName} ${this.props.userData.lastName}`}
                            </p>
                            <img className='account-pic' alt='icon-avatar' src={AccountPic}/>
                        </Toolbar>
                    </AppBar>
                )
            } else {
                appBar = (
                    <AppBar
                        position='fixed'
                        className='app-bar-tab'
                    >
                        <div onClick={() => this.props.onClick()}>
                            <img src={MenuToggle} alt='menu' className='menu-toggle'/>
                        </div>
                        <Toolbar
                            variant='dense'
                            className='toolbar'
                        >
                            <img className='logo-dca' alt='icon' src={DcaLogo}/>
                        </Toolbar>
                    </AppBar>
                )
            }
    }
    return appBar;
    }
}

export default ApplicationBar;