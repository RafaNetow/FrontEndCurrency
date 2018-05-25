import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Line } from 'react-chartjs';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
const options = [
  'USD', 'EUR', 'HNL'
];
var data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "My First dataset",
      fillColor: "rgba(220,220,220,0.2)",
      strokeColor: "rgba(220,220,220,1)",
      pointColor: "rgba(220,220,220,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(220,220,220,1)",
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};
class App extends Component {
  constructor() {
    super();
    this.state = {
      currency: {},
      defaultOption: options[0],
      base: 0,
      versus: 0,
      baseCurrency: options[0],
      versusCurrency: options[0],
      rateBV: 1,
      rateVB: 1,
    };
    this.handleBaseCurrencyChange = this.handleBaseCurrencyChange.bind(this);
    this.handleVersusCurrencyChange = this.handleVersusCurrencyChange.bind(this);
    this.handleBaseInputChange = this.handleBaseInputChange.bind(this);
    this.handleVersusInputChange = this.handleVersusInputChange.bind(this);
  }

  componentWillMount() {
    fetch('https://www.reddit.com/.json', {
      Accept: 'application/json'
    })
    .then(res => res.json())
    .then(data => this.setState({ currency: data }));
  }

  handleBaseCurrencyChange(option) {
    const value = option.value;
    this.setState({baseCurrency: value})
    const { versusCurrency, base } = this.state;

    fetch(`https://currencyupdate.azurewebsites.net/latest/${value}-${versusCurrency}`, {
      Accept: 'application/json'
    })
    .then(res => res.json())
    .then(data => this.setState({ versus: base * data.rate, rateVB: data.rate }));
  }

  handleVersusCurrencyChange(option) {
    const value = option.value;
    this.setState({versusCurrency: value})
    const { baseCurrency, base } = this.state;

    fetch(`https://currencyupdate.azurewebsites.net/latest/${baseCurrency}-${value}`, {
      Accept: 'application/json'
    })
    .then(res => res.json())
    .then(data => this.setState({ versus: base * data.rate, rateBV: data.rate }));
  }

  handleBaseInputChange(e) {
    const base = Number(e.target.value);
    const { rateBV } = this.state;
    this.setState({ base, versus: base * rateBV });
  }

  handleVersusInputChange(e) {
    const versus = Number(e.target.value);
    const { rateVB } = this.state;
    this.setState({ versus, base: versus * rateVB });
  }

  render() {
    const { currency, defaultOption, baseCurrency, versusCurrency } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Loyica</h1>
        </header>
        <Line data={data} width="600" height="250" />
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="container">
          <div className="row">
            <div className="col-5">
              <div className="row">
                <Dropdown
                  className="col-6"
                  options={options}
                  onChange={this.handleBaseCurrencyChange}
                  value={baseCurrency}
                />
                <input
                  className="col-6"
                  type="number"
                  name="base"
                  value={this.state.base}
                  onChange={this.handleBaseInputChange}
                />
              </div>
            </div>
            <span className="col-1">=</span>
            <div className="col-5">
              <div className="row">
                <input
                  className="col-6"
                  type="number"
                  name="base"
                  value={this.state.versus}
                  onChange={this.handleVersusInputChange}
                />
                <Dropdown
                  className="col-6"
                  options={options}
                  onChange={this.handleVersusCurrencyChange}
                  value={versusCurrency}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
