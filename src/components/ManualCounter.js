import React, { Component } from "react";
import Counter from "./Counter"

const maxCount = 999;

// an independent simple counter component with button controls for if the user wants to manually count something
//
// state: count is always a string that is either empty or represents a 3 digit whole number
class ManualCounter extends Component {
  constructor() {
    super();
    this.state = {
      count: '0',
    }
    this.handleChange = this.handleChange.bind(this);
    this.increment = this.increment.bind(this);
    this.reset = this.reset.bind(this);
    this.onKeyPressed = this.onKeyPressed.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyPressed);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyPressed);
  }

  // for keyboard shortcuts
  onKeyPressed(e) {
    if (e.target.tagName === 'TEXTAREA') return; // avoid accidental presses when inputting pattern
    
    switch(e.key) {
      case "z":
        if (!e.ctrlKey) this.increment(1); // avoid conflict with undo feature of main app
        break;
      case "x":
        this.increment(10);
        break;
      default: 
        return;
    }
  }

  handleChange(e) {
    let newCount = e.target.value;
    if (newCount.match(/\D/)) {
      // Don't accept non-numeric chars
      return;
    }    
    newCount = parseInt(newCount); // NaN if empty string
    this.setState({
      count: newCount ? newCount : "", 
    })
  }

  increment(i) {
    let newCount = Number(this.state.count) + i; // Number('') === 0
    this.setState({
      count: newCount <= maxCount 
        ? "" + newCount 
        : "" + (newCount - maxCount - 1),
    })
  }

  reset(){
    this.setState({count: '0'});
  }

  render() {
    const controls = (
      <div id='controls' style={{display: 'flex', justifyContent: 'center'}}>
        <button type='button' onClick={() => this.increment(1)}>+1 (z)</button>
        <button type='button' onClick={() => this.increment(10)}>+10 (x)</button>
        <button type='button' onClick={this.reset}>Reset</button>
      </div>
    )
    
    return (
      <div className='manual-counter'>
        <Counter name="Manual Counter" onChange={this.handleChange} value={this.state.count} controls={controls}/>
      </div>
    );
  }
}

export default ManualCounter;