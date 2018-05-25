import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Line } from  'react-chartjs';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
const options = [
  'USD', 'EUR', 'HND'
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
      base: 'b',
      versus: 'v',
    };
    this.superComboBox= this.superComboBox.bind(this);
  }

  componentWillMount() {
    fetch('https://www.reddit.com/.json', {
      Accept: 'application/json'
    })
    .then(res => res.json())
    .then(data => this.setState({currency: data}));
  }

  calculateCurrency() {
    fetch('https://www.reddit.com/.json', {
      body: JSON.stringify({balance: 0, type: 'us'}),
      method: 'POST'
    })
    .then(res => res.json())
    .then(data => this.setState({currency: data}));
  }
  superComboBox(e){
    fetch(`https://currencyupdate.azurewebsites.net/latest/hnl`, {
      Accept: 'application/json'
    }) .then(res => res.json())
    .then(data => console.log(data));
  }
  test(e, event){
    console.log(this.state.versus)
    console.log(event.target.value);
  
  }

  render() {
    const { currency, defaultOption } = this.state;
    console.log(Object.values(currency).toString());
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Loyica</h1>
        </header>
        <Line data={data}  width="600" height="250"/>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={() => this.calculateCurrency()}>Meow</button>
        <Dropdown options={options} onChange={this.superComboBox} value={defaultOption} placeholder="Select an option" />
        <input type="text" name="base" value={this.state.versus} onChange = {this.test.bind(this.state,this)} />
        =
        <input type="text" name="versus" value={this.state.base} onChange = {this.test} disabled/>
        
        <Dropdown class="dropdown-menu" options={options} onChange={this.superComboBox} value={defaultOption} placeholder="Select an option" />
        <h1>{currency.kind}</h1>
      </div>
    );
  }
}

export default App;
