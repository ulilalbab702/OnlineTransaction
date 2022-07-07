import React from 'react';
import { DefaultHeader, DefaultFooter } from 'components';
import { ConnectedRouter } from 'connected-react-router';
import { history } from 'config/router.config';
import routes from 'route';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {
  IconDenied,
  IconMail,
  IconUTCall,
  TanyaAdmin,
} from "assets/icons";
import IdleTimer from 'react-idle-timer';
import moment from 'moment';
import { MENU } from 'constants/menu';

const idleTimeout = 1800000// 30 menit
const localStorage = window.localStorage;
export default class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowDrawer: false,
      modalChat: this.props.clickEvent,
      denied: false,
    };
    this.idleTimer = null
    this.onAction = this._onAction.bind(this)
    this.onActive = this._onActive.bind(this)
    this.onIdle = this._onIdle.bind(this)
  }


  UNSAFE_componentWillMount() {
    window.addEventListener('resize', this._handleWindowSizeChange);
  }
  componentDidMount() {
    if (localStorage.getItem('idleTimeoutThreshold') != null) {
      const { startDate, endDate } = JSON.parse(localStorage.getItem('idleTimeoutThreshold'))
      if (startDate > endDate) {
        this.props.clearStore()
        localStorage.clear();
        window.location.replace(MENU.LANDING)
      }
    }
    this._handleWindowSizeChange();
  }

  UNSAFE_componentWillUnmount() {
    window.removeEventListener('resize', this._handleWindowSizeChange);
  }

  _onAction(e) {
    this._onUpdate()
  }

  _onActive(e) {

  }

  _onIdle(e) {
    this.props.clearStore()
    localStorage.clear();
    window.location.replace(MENU.LANDING)
  }

  _onUpdate() {
    if (this.idleTimer && this.idleTimer !== null) {
      const diffThreshold = (Math.abs(this.idleTimer.getRemainingTime() - idleTimeout)) / 1000
      let idleTimeoutThreshold = JSON.parse(localStorage.getItem('idleTimeoutThreshold'))
      idleTimeoutThreshold = {
        ...idleTimeoutThreshold,
        startDate: moment(new Date()),
        endDate: idleTimeoutThreshold != null ? moment(idleTimeoutThreshold.endDate).add(diffThreshold, 'second') : null,
      }
      localStorage.setItem('idleTimeoutThreshold', JSON.stringify(idleTimeoutThreshold))
    }

  }

  _handleWindowSizeChange = () => {

    let mode = 'web';
    if (window.innerWidth < 600) {
      mode = 'mobile';
    } else if (window.innerWidth < 1026) {
      mode = 'tab';
    }
    this.props.setDisplayMode(mode);
  }
  handleClick = (key) => {
    switch (key) {
      case 'isOpen':
        this.setState({
          isShowDrawer: !this.state.isShowDrawer
        })
        break;
      case 'isClose':
        this.setState({
          isShowDrawer: false
        })
        break;

      default:
        break;
    }
  }
  _toggleChat = (param) => {
    this.setState({ modalChat: param })
    window.test();
    localStorage.setItem('eventClick', param)
    this.props.clickChat(param)
  };

  _renderAdmin = () => {
    if (this.state.modalChat === false || this.state.modalChat === null) {
      return (
        <img className='iconAdmin' src={TanyaAdmin} onClick={() => this._toggleChat(true)} />
      )
    }
  };

  render() {
    return (
      <>
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          element={document}
          onActive={this.onActive}
          onIdle={this.onIdle}
          onAction={this.onAction}
          debounce={250}
          timeout={idleTimeout} />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DefaultHeader props={this.props} />
          <ConnectedRouter history={history}>
            {routes}
          </ConnectedRouter>
          <DefaultFooter />
        </MuiPickersUtilsProvider>
      </>
    )
  }
}