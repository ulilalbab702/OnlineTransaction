import React, { Component } from "react";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { MENU } from "constants/menu";
import { getStorage } from "utils/storage.helper";
import { USER_STORAGE } from "constants/storage";
import { getUser } from "actions/user";

export default function (ComposedComponent) {
  class AuthGuard extends Component {
    constructor(props) {
      super(props);
    }
    UNSAFE_componentWillMount() {
      this._handleUser();
    }
    _handleUser = () => {
      const user = getStorage(USER_STORAGE);
      if (user !== null) {
        this.props.getUser();
      }
    };
    render() {
      return <ComposedComponent {...this.props} history={this.props.history} />;
    }
  }
  const mapStateToProps = (state) => ({
    user: state.user,
  });
  const mapDispatchToProps = (dispatch) => ({
    goToLogin: (url) => dispatch(push(url)),
    getUser: () => dispatch(getUser()),
  });
  return connect(mapStateToProps, mapDispatchToProps)(AuthGuard);
}
