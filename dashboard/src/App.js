import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
    fetch('https://45577961.ngrok.io/temperature')
      .then(res => {
        return res.json()
      })
      .then(readings => this.setState({readings}))
  }

  render() {
    // console.log('typeof readings', typeof this.state.readings)

    if (!this.state.readings) {
      return (
        <div className="App">
          <h1>
            Loading...
          </h1>
        </div>
      )
    }

    // console.log('readings', this.state.readings)
    // return null

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <table>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Temperature</th>
              <th>Humidity</th>
              <th>Pressure</th>
            </tr>
            {this.state.readings.readings.map(reading => {
              return (
                <tr>
                  <td>{reading[0]}</td>
                  <td>{reading[1]}</td>
                  <td>{reading[2]}</td>
                  <td>{reading[3]}</td>
                  <td>{reading[4]}</td>
                </tr>
              )
            })}
          </table>

          <form action="https://45577961.ngrok.io/temperature" method="post">
            <button type="submit" formmethod="post">Get Reading!</button>
          </form>

        </p>
      </div>
    );
  }
}

export default App;
