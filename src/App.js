import React, { Component } from "react";
import PatternForm from "./components/PatternForm";
import InstructionView from "./components/InstructionView";
import PatternLexer from "./PatternLexer";
import {TokenType} from './Token'

import './App.css';

// these examples will be put below the form for the user to learn syntax
const EXAMPLE_TXT = `Press the 'Next' button or spacebar to advance!

4. sc 3, hdc, dc 3, hdc, sc 3
5. (sc 3, dc 5) * 3 (24 sts) (parenthesis without commas or periods are ignored)

On the next instruction try using the 'Complete Repeat' button! 

6. ((sc 2, dec, sc 2, dec) * 5, sc) * 3

You can also type into the counter display to edit counts directly!

7. ((sc, dc, sc) * 594, sc 3, dc 2) * 2 (Click on the orange counter number and type in something else)

Switch to a G hook (Instructions don't have to start with a number)

You will need to use the 'Exit repeat' button in the next instruction

8. (sc 3, picot) until end of row, sc, hdc, dc

Cut and weave in ends (Now try your own pattern!)
`

class App extends Component {
  constructor() {
    super();
    
    let storedState = JSON.parse(localStorage.getItem('patternCounterState'));
    this.state = storedState ? storedState : {
      patternInput: EXAMPLE_TXT,
      pattern: undefined,
      instrIndex: 0,
      tokIndex: 0,
      finished: false,
      repeats: [],     // {index, numRepeats}
      previousStates: [], // {instrIndex, tokIndex, finished, repeats}
    } 


    this.initialize = this.initialize.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.next = this.next.bind(this);
    this.nextInstruction = this.nextInstruction.bind(this);
    this.finishRepeat = this.finishRepeat.bind(this);
    this.addRepeat = this.addRepeat.bind(this);
    this.handleRepeatChange = this.handleRepeatChange.bind(this);
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.undo = this.undo.bind(this);
    this.saveAndDo = this.saveAndDo.bind(this);
  }

  initialize(patternInput) {
    this.setState({
      patternInput: patternInput,
      pattern: undefined,
      instrIndex: 0,
      tokIndex: 0,
      finished: false,
      repeats: [],
      previousStates: [],
    });
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
        this.saveAndDo(this.next);
        break;
      case "c":
        if (this.state.repeats.length > 0) this.saveAndDo(this.addRepeat);
        break;
      case "v":
        if (this.state.repeats.length > 0) this.saveAndDo(this.finishRepeat);
        break;
      case "z":
        if (e.ctrlKey) this.undo();
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
    i++

    // instruction[i] is token directly after ')'. move on to next token/instruction and pop repeat stack.
    if (!instruction[i]) {
      // need to move on to next instruction
      this.setState({
        instrIndex: this.state.instrIndex + 1,
        tokIndex: 0,
        repeats: [],
      }, () => {
        if (instruction[this.state.instrIndex].type !== TokenType.STR) this.next(); // leave us off at next string
      })
    } else {
      this.setState({
        tokIndex: i,
        repeats: JSON.parse(JSON.stringify(this.state.repeats.slice(0, -1))),
      }, () => {
        if (instruction[i].type !== TokenType.STR) this.next(); // leave us off at next string
      })
    }
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

  // Save state only when user directly interact with methods.
  saveAndDo(func) {
    this.saveState();
    func();
    this.storeState();
  }

  // save relevant parts of state in previousStates stack for undo();
  saveState() {
    this.setState( prevState => {
      let ret = JSON.parse(JSON.stringify(prevState.previousStates));
      ret.push({
        instrIndex: prevState.instrIndex,
        tokIndex: prevState.tokIndex,
        finished: prevState.finished,
        repeats: JSON.parse(JSON.stringify(prevState.repeats)),
      })

      return {
        previousStates: ret,
      }
    })
  }

  // save the current state using web storage api
  storeState() {
    localStorage.setItem('patternCounterState', JSON.stringify(this.state));
  }

  // restore state to top of previousState stack
  undo() {
    let previousStates = JSON.parse(JSON.stringify(this.state.previousStates));
    
    this.setState(
      {...previousStates.pop(), previousStates: previousStates} // [].pop() undefined
    , () => this.storeState())
  }

  render() {
    if (this.state.pattern === undefined) {
      // user needs to input pattern
      return (
        <div>
          <PatternForm value={this.state.patternInput} onChange={this.handleFormChange} onSubmit={this.handleFormSubmit}/>
        </div>
      )

    } else if (this.state.finished) {
      return (
        <div>
          <InstructionView finished={true}/> 
          <div className='button-menu'>
            <button onClick={this.undo}>Undo (ctrl-z)</button>
            <button onClick={() => this.initialize(this.state.patternInput)}>Submit Anonther Pattern</button>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div>
            <InstructionView 
            instruction={this.state.pattern[this.state.instrIndex]} 
            tokIndex={this.state.tokIndex} 
            repeats={this.state.repeats} 
            onRepeatChange={(index, event) => this.saveAndDo(() => this.handleRepeatChange(index, event))}
            finished={this.state.finished}
            />
          </div>
          <div className='button-menu'>
            <button onClick={() => this.saveAndDo(this.next)}>Next (Space)</button>
            {this.state.repeats.length > 0 ? <button onClick={() => this.saveAndDo(this.addRepeat)}>Complete Repeat (c)</button> : null}
            {this.state.repeats.length > 0 ? <button onClick={() => this.saveAndDo(this.finishRepeat)}>Exit repeat (v)</button> : null}
          </div>
          <div className='button-menu'>
            <button onClick={this.undo}>Undo (ctrl-z)</button>
            <button onClick={() => this.saveAndDo(this.nextInstruction)}>Next Instruction</button>
            <button onClick={() => this.initialize(this.state.patternInput)}>Submit Anonther Pattern</button>
          </div>
        </div>
      )
    }
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
