import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Navbar, Jumbotron, Button } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to eHealthWallet app</h2>
        </div>
        <p className="App-intro">
    <div class="jumbotron">
      <h1>
        Hello, @user  
      </h1>
      <p>
        Tell me about your medical record
      </p>
      <p>
      </p>
      <div class="form-group">
        <label>
          Allergies:
        </label>
        <select class="form-control">
          <option value="//dynamic">
            dynamic
          </option>
          <option value="salad">
            Salad
          </option>
          <option value="pizzasalad">
            Pizza and Salad
          </option>
          <option value="value3">
            Item3
          </option>
          <option value="value4">
            Item4
          </option>
        </select>
        <div class="form-group">
          <label>
            Medication:
          </label>
          <select class="form-control">
            <option value="pizza">
              Pizza
            </option>
            <option value="salad">
              Salad
            </option>
            <option value="pizzasalad">
              Pizza and Salad
            </option>
          </select>
          <div class="form-group">
            <label>
              Health Problems:
            </label>
          </div>
        </div>
      </div>
      <select class="form-control">
        <option value="pizza">
          Pizza
        </option>
        <option value="salad">
          Salad
        </option>
        <option value="pizzasalad">
          Pizza and Salad
        </option>
      </select>
    </div>

        </p>
      </div>
    );
  }
}

export default App;
