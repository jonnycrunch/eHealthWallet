import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import { Navbar, Nav, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';
import Web3 from 'web3'; 

//var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar>
            <Navbar.Header>
            <Navbar.Brand>
                <a href="#">HealthySELFIE (eHealthWallet)</a>
            </Navbar.Brand>
            </Navbar.Header>
            <Nav>
            <NavItem eventKey={1} href="#">Add Condition</NavItem>
            <NavItem eventKey={2} href="#">Add Medication</NavItem>
            <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                <MenuItem eventKey={3.1}>Action</MenuItem>
                <MenuItem eventKey={3.2}>Another action</MenuItem>
                <MenuItem eventKey={3.3}>Something else here</MenuItem>
            </NavDropdown>
            </Nav>
        </Navbar>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
      </div>
    );
  }
}

export default App;
