import * as React from 'react';
import './App.css';
import logo from './logo.svg';

import * as cc from './cc/CC';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <cc.CC
        />
        <footer className="App-footer">
          <p>(c) 2018</p>
        </footer>
      </div>
    );
  }
}

export default App;
