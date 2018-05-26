import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import moment from 'moment';
import { Line } from 'react-chartjs';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import _ from 'lodash';
const options = [
  "GBP", "AUD", "BRL", "CAD", "HNL", "DKK", "GBP", "EUR", "USD"
];
const dayOptions = [
  "1 Week", "1 Month", "3 Month"
]

class App extends Component {
  constructor() {
    super();
    this.state = {
      currency: {},
      base: 0,
      versus: 0,
      baseCurrency: options[4],
      versusCurrency: options[2],
      rateBV: 1,
      rateVB: 1,
      data: {},
      end: moment().format('YYYY-MM-DD'),
      start: moment().subtract(1, 'M').format('YYYY-MM-DD'),
      graphicOption: "Select"
    };
    this.handleBaseCurrencyChange = this.handleBaseCurrencyChange.bind(this);
    this.handleVersusCurrencyChange = this.handleVersusCurrencyChange.bind(this);
    this.handleBaseInputChange = this.handleBaseInputChange.bind(this);
    this.handleVersusInputChange = this.handleVersusInputChange.bind(this);
    this.reloadGraphic = this.reloadGraphic.bind(this);
    this.handleGraphicChanges = this.handleGraphicChanges.bind(this);
  }
  componentDidMount() {
    const { end, start } = this.state;
    this.reloadGraphic(end, start);
  }
  
  reloadGraphic(end, start) {
    const { baseCurrency, versusCurrency } = this.state;
    const url = `https://currencyupdate.azurewebsites.net/historical/${baseCurrency}-${versusCurrency}?start=${start}&end=${end}`;

    fetch(url, {
      Accept: 'application/json'
    }).then(res => res.json())
      .then(data => this.setState({
        data: this.getDataGraphic(moment(data.end), moment(data.start), data.rate)
      }))
  }
  handleGraphicChanges(options) {
    const value = options.value;
    this.setState({ graphicOption: value })
    let end = moment().format('YYYY-MM-DD');
    let start = '';
    if (value === '1 Week') {
      start = moment().subtract(7, 'd').format('YYYY-MM-DD');
    } else if (value === '1 Month') {
      start = moment().subtract(1, 'M').format('YYYY-MM-DD');
    } else {
      start = moment().subtract(3, 'M').format('YYYY-MM-DD');
    }
    this.setState({ start })
    this.reloadGraphic(end, start);
  }

  getDataGraphic(dateEnd, dateStart, rates) {
    var timeValues = [];
    while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
      timeValues.push(dateStart.format('YYYY-MM'));
      dateStart.add(1, 'month');
    }
    let allRates = _.toArray(rates);
    let monthWithRate = {};
    timeValues.forEach(function (month) {
      monthWithRate[month] = [];
      Object.keys(rates).forEach(function (date, index) {
        if (month === moment(date).format('YYYY-MM')) {
          monthWithRate[month].push(allRates[index])
        }
      })
    });
    let response = {
      labels: timeValues,
      datasets: [],
    };
    Object.keys(monthWithRate).forEach(function (date, index) {
      response.datasets.push({ data: monthWithRate[date],fillColor: "rgba(220,220,220,0.2)",
      strokeColor: "rgba(220,220,220,1)",
      pointColor: "rgba(220,220,220,1)" ,
      label: date});
    })

    return response;
  }

  handleBaseCurrencyChange(option) {
    const value = option.value;
    this.setState({ baseCurrency: value })
    const { versusCurrency, base } = this.state;

    fetch(`https://currencyupdate.azurewebsites.net/latest/${value}-${versusCurrency}`, {
      Accept: 'application/json'
    })
      .then(res => res.json())
      .then(data => this.setState({ versus: base * data.rate, rateVB: data.rate }))
      .then(() => this.reloadGraphic(this.state.end, this.state.start));
  }

  handleVersusCurrencyChange(option) {
    const value = option.value;
    this.setState({ versusCurrency: value })
    const { baseCurrency, base } = this.state;
    fetch(`https://currencyupdate.azurewebsites.net/latest/${baseCurrency}-${value}`, {
      Accept: 'application/json'
    })
      .then(res => res.json())
      .then(data => this.setState({ versus: base * data.rate, rateBV: data.rate }))
      .then(() => this.reloadGraphic(this.state.end, this.state.start));
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
    const { graphicOption, baseCurrency, versusCurrency } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Or - Be</h1>
        </header>
        <Line data={this.state.data} width="600" height="250" redraw />
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
        <div className="container">
          <div className="row">
            <div className="col-5">
              <div className="row">
                <Dropdown className="dropdown-menu"
                  className="col-6"
                  value={graphicOption}
                  onChange={this.handleGraphicChanges}
                  options={dayOptions}

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
