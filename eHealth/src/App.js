import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import { Navbar, Jumbotron, Button } from 'react-bootstrap';
//var $ = require('jquery');
    
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to the HealthySELFIE eHealthWallet!</h2>
        </div>
        <p className="App-intro">
        <div><img src="http://melanieswan.com/images/HS.png" alt="image" /></div>
        sample UX - app homescreen<br /></p>
      </div>
    );
  }
}

export default App;
