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
      description='Keep track of your place in your knitting or crochet pattern!'
      info={
        <div>
          <p>Start by putting inputting your pattern in the correct syntax. Visit my <a href='https://goldinvo.com'>blog post</a> for examples and usage details.</p>
        </div>   
      }
    />
    <div class='content'><App /></div>
  </React.StrictMode>,
  document.getElementById('root')
);

// tester();
