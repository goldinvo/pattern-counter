import React, { Component } from "react";
import PatternForm from "./components/PatternForm";
import InstructionView from "./components/InstructionView";
import PatternLexer from "./PatternLexer";
import {TokenType} from './Token'

import './App.css';


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
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.next = this.next.bind(this);
    this.nextInstruction = this.nextInstruction.bind(this);
    this.finishRepeat = this.finishRepeat.bind(this);
    this.addRepeat = this.addRepeat.bind(this);
    this.handleRepeatChange = this.handleRepeatChange.bind(this);
    this.onKeyPressed = this.onKeyPressed.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyPressed);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyPressed);
  }

  onKeyPressed(e) {
    if (e.target.tagName === 'TEXTAREA' || this.state.pattern === undefined) return;
    
    switch(e.key) {
      case " ":
        e.preventDefault();
        this.next();
        break;
      case "c":
        if (this.state.repeats.length > 0) this.addRepeat();
        break;
      case "v":
        if (this.state.repeats.length > 0) this.finishRepeat();
        break;
      default: 
        return;

    }
  }
  
  handleFormChange(e) {
    this.setState({patternInput: e.target.value});
  }

  handleFormSubmit(e) {
    e.preventDefault();
    
    const pattern = PatternLexer.tokenize(this.state.patternInput);
    const err = PatternLexer.isInvalid(pattern);
    if (err) {
      alert("Pattern Syntax Error: " + err + ".");
      return;
    } 

    this.setState({
      pattern: pattern,
      instrIndex: 0,
      tokIndex: 0,
      finished: false,
      repeats: [],
    }, () => {
      if (pattern[0][0].type !== TokenType.STR) this.next();
    }); 
    
    
  }

  next() {
    this.setState( prevState => {

      let transState = {
        pattern: prevState.pattern,
        instrIndex: prevState.instrIndex,
        tokIndex: prevState.tokIndex,
        repeats: JSON.parse(JSON.stringify(prevState.repeats)),
        finished: prevState.finished,
      }
      
      transNext(transState);

      return {...transState};
    });
  }

  addRepeat() {
    // go 'next()' until repeat status in state changes
    this.setState( prevState => {

      let transState = {
        pattern: prevState.pattern,
        instrIndex: prevState.instrIndex,
        tokIndex: prevState.tokIndex,
        repeats: JSON.parse(JSON.stringify(prevState.repeats)),
        finished: prevState.finished,
      }
      
      const repeatIndex = transState.repeats.length - 1;
      const numRepeats = transState.repeats[repeatIndex].numRepeats;

      do { 
        transNext(transState);
      } while (!transState.finished && transState.repeats[repeatIndex] && numRepeats === transState.repeats[repeatIndex].numRepeats)

      return {...transState};
    });
  }

  finishRepeat() {
    // go ahead of next ')' token and pop repeats
    const instruction = this.state.pattern[this.state.instrIndex];
    
    let i = this.state.tokIndex;
    do {
      i++
    } while (instruction[i].type !== TokenType.CLS_PAREN);
  
    this.setState({
      tokIndex: i + 1,
      repeats: JSON.parse(JSON.stringify(this.state.repeats.slice(0, -1))),
    }, () => {
      if (instruction[i + 1].type !== TokenType.STR) this.next();
    })
  }

  nextInstruction() {
    const pattern = this.state.pattern;
    if(this.state.instrIndex >= pattern.length - 1) {
      this.setState({finished: true});
      return;
    }
    let nextInstrIndex = this.state.instrIndex + 1;
    let nextTokIndex = 0;
    
    this.setState({
      instrIndex: nextInstrIndex,
      tokIndex: nextTokIndex,
      repeats: [],
    }, () => {
      if (pattern[nextInstrIndex][nextTokIndex].type !== TokenType.STR) {
        this.next();
      }
    })
  }

  handleRepeatChange(index, event) {
    let newVal = event.target.value;
    if (newVal.match(/\D/)) {
      // Don't accept non-numeric chars
      return;
    }   
    newVal = parseInt(newVal); // NaN if empty string

    let newRepeats = JSON.parse(JSON.stringify(this.state.repeats));
    newRepeats[index].numRepeats = newVal ? newVal : 0;
    this.setState({
      repeats: newRepeats,
    })
    return;
  }

  render() {
    let display = null;
    if (this.state.pattern !== undefined) {
      display = (
        <div>
          <div className='visualContent'>
            <InstructionView instruction={this.state.pattern[this.state.instrIndex]} index={this.state.tokIndex} repeats={this.state.repeats} onRepeatChange={this.handleRepeatChange}/>
          </div>  
          <div className='button-menu'>
            <button onClick={this.next}>Next (Space)</button>
            <button onClick={this.nextInstruction}>Next Instruction</button>  
            {this.state.repeats.length > 0 ? <button onClick={this.addRepeat}>Complete Repeat (c)</button> : null}
            {this.state.repeats.length > 0 ? <button onClick={this.finishRepeat}>Exit repeat (v)</button> : null}
            
          </div>
        </div>
      )
    }
    
    return (
      <div>
        {display}
        <PatternForm value={this.state.patternInput} onChange={this.handleFormChange} onSubmit={this.handleFormSubmit}/>
      </div>  
    );
  }
}

// ====== static methods ======

// 
function needToRepeat(instruction, index, numRepeats) {
  
  // assumes we are at ')' token
  if (instruction[index].type !== TokenType.CLS_PAREN) console.log("fxn needToRepeat!!!!!");
  
  // if no multiplier, repeat indefinitely within ()'s
  if (instruction[index + 1] && instruction[index + 1].type !== TokenType.REP) {
    return true;
  }
  
  // (sequence) * NUM
  if (instruction[index + 2] && instruction[index + 2].type === TokenType.NUM) {
    return numRepeats < Number(instruction[index + 2].value) - 1;
  }
  
  return false;
  
}

// advances to next token using repeat logic. if no next token, call nextInstruction.
function advance(transState) {
  let {pattern, instrIndex, tokIndex, finished} = transState;
  let repeats = transState.repeats.slice();

  if (pattern[instrIndex][tokIndex].type === TokenType.OPN_PAREN) {
    repeats.push({index: tokIndex, numRepeats: 0});
    tokIndex++;
  } else if (pattern[instrIndex][tokIndex].type === TokenType.CLS_PAREN) {
    if (needToRepeat(pattern[instrIndex], tokIndex, repeats[repeats.length - 1].numRepeats)){
      tokIndex = repeats[repeats.length-1].index + 1;
      repeats[repeats.length - 1].numRepeats++;
    } else {
      repeats.pop();
      tokIndex++;
    }

  } else {
    tokIndex++;
  }

  if (!pattern[instrIndex][tokIndex]) {
    if(instrIndex >= pattern.length - 1) {
      tokIndex = transState.tokIndex;
      repeats = transState.repeats.slice();
      finished = true;
    } else {
      instrIndex++;
      tokIndex = 0;
    }
  }

  transState.pattern = pattern;
  transState.instrIndex = instrIndex;
  transState.tokIndex = tokIndex;
  transState.repeats = repeats;
  transState.finished = finished;

}

function transNext(transState) {
  const initInstr = transState.instrIndex;
  const initTok = transState.tokIndex;
  const initReps = JSON.parse(JSON.stringify(transState.repeats));
  
  do {
    advance(transState);
  } while (transState.pattern[transState.instrIndex][transState.tokIndex].type !== TokenType.STR
    && !transState.finished);

  if (transState.finished) {
    transState.instrIndex = initInstr;
    transState.tokIndex = initTok;
    transState.repeats = initReps;
  }
} 

export default App;
