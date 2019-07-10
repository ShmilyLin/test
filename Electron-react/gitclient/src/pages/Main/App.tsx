import React from 'react';
// import logo from '../../assets/logo.svg';
import './App.css';
import Navigation from './components/Navigation/Navigation';


const App: React.FC = (argument) => {
  console.log('App', argument);

  return (
    <div className="App">
      <Navigation />
    </div>
  );
}

export default App;
