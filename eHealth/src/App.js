import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Navbar, Jumbotron, Button } from 'react-bootstrap';
var $ = require('jquery');
    
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to eHealthWallet app</h2>
        </div>
        <p className="App-intro">
        </p>
      </div>
    );
  }
}

export default App;
