import React, { Component } from "react";
import ManualCounter from "./components/ManualCounter";
import PatternForm from "./components/PatternForm";
import InstructionView from "./components/InstructionView";
import PatternLexer from "./PatternLexer";
import {TokenType} from './Token'


class App extends Component {
  constructor() {
    super();
    this.state = {
      patternInput: "",
      pattern: undefined,
      instrIndex: 0,
      tokIndex: 0,
      finished: false,
      repeats: [],
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.next = this.next.bind(this);
    this.nextInstruction = this.nextInstruction.bind(this);
  }
  
  handleChange(e) {
    this.setState({patternInput: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const pattern = PatternLexer.tokenize(this.state.patternInput);
    const tokenIndex = pattern[0][0].type !== TokenType.STR
      ? PatternLexer.nextStr(pattern[0], 0)
      : 0;
    this.setState({
      pattern: pattern,
      tokenIndex: tokenIndex,
    });
    
  }

  next() {
    const pattern = this.state.pattern;
    if (pattern.tokenAtIndex(index + 1) === TokenType.CLS_PAREN) {
      
    }
    if (!pattern.nextStr()) {
      this.nextInstruction();
      return;
    }
    this.setState({
      tokenIndex: pattern.tokenIndex,
      instrIndex: pattern.instrIndex,      
    })
  }

  nextInstruction() {
    const pattern = this.state.pattern;
    if(this.state.instrIndex >= pattern.length) {
      this.setState({finished: true});
      return;
    }
    let nextInstrIndex = this.state.instrIndex + 1;
    let nextTokIndex = 0;
    if (pattern[nextInstrIndex][nextTokIndex].type !== TokenType.STR) {
      nextTokIndex = PatternLexer.nextStr(pattern[nextInstrIndex], 0);
    }
    this.setState({
      instrIndex: nextInstrIndex,  
      tokenIndex: nextTokIndex,    
    })
  }

  render() {
    let display = null;
    if (this.state.pattern !== undefined) {
      display = (
        <div>
          <InstructionView instruction={this.state.pattern[this.state.instrIndex]} index={this.state.tokenIndex}/>
          <ManualCounter /> 
          <button onClick={this.next}>Next</button>   
          <button onClick={this.nextInstruction}>Next Instruction</button>
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
