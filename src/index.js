import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Sidebar from './components/Sidebar'

// import tester from './tester';

ReactDOM.render(
  <React.StrictMode>
    <Sidebar 
      title='Pattern Counter'
      description='Keep track of your place in your knitting or crochet pattern'
      info={
        <p>stuff</p>
      }
    />
    <div class='content'><App /></div>
  </React.StrictMode>,
  document.getElementById('root')
);

// tester();
