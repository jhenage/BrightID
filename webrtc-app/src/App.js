import React, { Component } from 'react';
import { Provider } from 'react-redux';
import nacl from 'tweetnacl';
import store from './store';
import WebRTC from './WebRTC';
import QRCode from './QRCode';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

window.nacl = nacl;

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <header className="header">
            <h1 className="display-4">WebRTC</h1>
          </header>
          <QRCode />
          <hr />
          <WebRTC />
        </div>
      </Provider>
    );
  }
}

export default App;