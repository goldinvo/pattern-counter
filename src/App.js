import React, { Component } from "react";
import ManualCounter from "./components/ManualCounter";
import PatternForm from "./components/PatternForm";
import InstructionView from "./components/InstructionView";
import { PatternLexer } from "./PatternLexer";
import {TokenType} from './Token'


class App extends Component {
  constructor() {
    super();
    this.state = {
      patternInput: "",
      pattern: undefined,
      instruction: 0,
      tokenIndex: 0,
      finished: false,
      repeats: [],
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.step = this.step.bind(this);
    this.nextInstruction = this.nextInstruction.bind(this);
  }
  
  handleChange(e) {
    this.setState({patternInput: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const pattern = new PatternLexer(this.state.patternInput);
    if (pattern.currentToken.type !== TokenType.STR) {
      pattern.nextStr();
    }
    this.setState({
      pattern: pattern,
      instruction: 0,
      tokenIndex: pattern.tokenIndex,
    });
    
  }

  step() {
    const pattern = this.state.pattern;
    const index = pattern.tokenIndex;
    if (pattern.tokenAtIndex(index + 1) === TokenType.CLS_PAREN) {
      
    }
    if (!pattern.nextStr()) {
      this.nextInstruction();
      return;
    }
    this.setState({
      tokenIndex: pattern.tokenIndex,
      instruction: pattern.instrIndex,      
    })
  }

  nextInstruction() {
    const pattern = this.state.pattern;
    if(!pattern.nextInstr()) {
      this.setState({finished: true});
    }
    pattern.nextStr();
    this.setState({
      tokenIndex: pattern.tokenIndex,
      instruction: pattern.instrIndex,      
    })
  }

  render() {
    let display = null;
    if (this.state.pattern !== undefined) {
      display = (
        <div>
          <InstructionView instruction={this.state.pattern.currentInstruction} index={this.state.tokenIndex}/>
          <ManualCounter /> 
          <button onClick={this.step}>Step</button>   
          <button onClick={this.nextInstruction}>Next</button>
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
