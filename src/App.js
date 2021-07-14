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

  // for keyboard shortcuts
  onKeyPressed(e) {
    // ignore keys when inputting pattern
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
    
    // is tokenized pattern valid(ish)?
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
      if (pattern[0][0].type !== TokenType.STR) this.next(); // start on first string
    }); 
    
  }

  // advance to next string. Use transState and transNext to quickly advance state multiple times
  // synchronously. 
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

  // complete 1 repeat. Do this by advancing (next()) over and over until we see that the repeat
  // array in state has changed. Use transState/transNext to quickly advance through state synchronously.
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
      } while (!transState.finished 
        && transState.repeats[repeatIndex] 
        && numRepeats === transState.repeats[repeatIndex].numRepeats)

      return {...transState};
    });
  }

  // breka out of current repeat by setting current index ahead of next ')' and 
  // popping the repeat stack.
  finishRepeat() {
    const instruction = this.state.pattern[this.state.instrIndex];
    let i = this.state.tokIndex;
    do {
      i++
    } while (instruction[i].type !== TokenType.CLS_PAREN);
  
    this.setState({
      tokIndex: i + 1,
      repeats: JSON.parse(JSON.stringify(this.state.repeats.slice(0, -1))),
    }, () => {
      if (instruction[i + 1].type !== TokenType.STR) this.next(); // leave us off at next string
    })
  }

  // skip to next instruction in the pattern
  nextInstruction() {
    const pattern = this.state.pattern;
    if(this.state.instrIndex >= pattern.length - 1) {
      // already at last pattern
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
        this.next(); // start at first string
      }
    })
  }

  // change count inside of repeats[index] when user manually changes it.
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
    // has pattern been inputted by user yet? do we have any repeats (if not, don't display repeat buttons)? 
    if (this.state.pattern !== undefined) {
      display = (
        <div>
          <div>
            <InstructionView instruction={this.state.pattern[this.state.instrIndex]} tokIndex={this.state.tokIndex} repeats={this.state.repeats} onRepeatChange={this.handleRepeatChange}/>
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

// Call when we are at a ')' to see if we are ready to finish repeating
function needToRepeat(instruction, index, numRepeats) {
  
  // assumes we are at ')' token
  if (instruction[index].type !== TokenType.CLS_PAREN) console.log("fxn needToRepeat!!!!!");
  
  // if no multiplier, repeat indefinitely within ()'s
  if (instruction[index + 1] && instruction[index + 1].type !== TokenType.REP) {
    return true;
  }
  
  // do we have (sequence) * NUM ?
  if (instruction[index + 2] && instruction[index + 2].type === TokenType.NUM) {
    return numRepeats < Number(instruction[index + 2].value) - 1;
  }
  
  // we don't have (sequence) * NUM
  return true;
}

// advances to next token using repeat logic. if no next token, go to next instruction.
// 'static' method. mutates transState to avoid problems with asynchronous setState.
function advance(transState) {
  let {pattern, instrIndex, tokIndex, finished} = transState;
  let repeats = transState.repeats.slice();

  if (pattern[instrIndex][tokIndex].type === TokenType.OPN_PAREN) {
    // '(': create new repeat
    repeats.push({index: tokIndex, numRepeats: 0});
    tokIndex++;
  } else if (pattern[instrIndex][tokIndex].type === TokenType.CLS_PAREN) {
    // ')' do we continue or repeat?
    if (needToRepeat(pattern[instrIndex], tokIndex, repeats[repeats.length - 1].numRepeats)){
      // go back to beginning of repeat
      tokIndex = repeats[repeats.length-1].index + 1;
      repeats[repeats.length - 1].numRepeats++;
    } else {
      // finish repeat
      repeats.pop();
      tokIndex++;
    }

  } else {
    tokIndex++;
  }

  if (!pattern[instrIndex][tokIndex]) {
    // need to move on to next instruction
    if(instrIndex >= pattern.length - 1) {
      // already on last instruction
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

// advances to next string 
// 'static' method. mutates transState to avoid problems with asynchronous setState.
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
