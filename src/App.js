import React, { Component } from "react";
import ManualCounter from "./components/ManualCounter";
import PatternForm from "./components/PatternForm";
import InstructionView from "./components/InstructionView";
import { PatternLexer } from "./PatternLexer";

class App extends Component {
  constructor() {
    super();
    this.state = {
      patternInput: "",
      pattern: undefined,
      instruction: 0,
      instrIndex: 0,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(e) {
    this.setState({patternInput: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      pattern: new PatternLexer(this.state.patternInput),
      instruction: 0,
      instrIndex: 0,
    });
    
  }

  render() {
    let display = null;
    if (this.state.pattern !== undefined) {
      display = (
        <div>
          <InstructionView instruction={this.state.pattern.getCurrentInstruction()} index={this.state.instrIndex}/>
          <ManualCounter /> 
        </div>
      )
    }
    
    return (
      <div>
        {display}
        <PatternForm value={this.state.patternInput} onChange={this.handleChange} onSubmit={this.handleSubmit}/>
      </div>  
    );
  }
}

export default App;
