import React, { Component } from "react";
import ManualCounter from "./components/ManualCounter";
import PatternForm from "./components/PatternForm";
import InstructionView from "./components/InstructionView";

class App extends Component {
  constructor() {
    super();
    this.state = {
      patternInput: "",
      pattern: "",
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(e) {
    this.setState({patternInput: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({pattern: this.state.patternInput});
    
  }

  render() {
    return (
      <div>
        <InstructionView />
        <ManualCounter />
        <PatternForm value={this.state.patternInput} onChange={this.handleChange} onSubmit={this.handleSubmit}/>
      </div>  
    );
  }
}

export default App;
