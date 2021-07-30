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
          <p>
            Start by putting inputting your pattern using the pattern counter syntax. 
            Visit my <a href='https://goldinvo.com/2021/07/22/pattern-counter.html' target='_blank' rel="noreferrer">blog post</a> for examples and usage details.
          </p>
          <p>
            Please send any questions, comments/feedback, or bug reports my way! I would much appreciate it: goldin@goldinvo.com
          </p>
        </div>   
      }
    />
    <div className='content'><App /></div>
  </React.StrictMode>,
  document.getElementById('root')
);

// tester();
