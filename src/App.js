import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import {ApplicationBar,SideMenuBar} from './components';
import routes from './route'
import './App.css';

class App extends React.Component{

  
  render (){
  return (
    <div className='app-container'>
      <ApplicationBar/>
      <ConnectedRouter history={this.props.history}>
        {routes}
      </ConnectedRouter>
    </div>
  );
  }
}

export default App;
