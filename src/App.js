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
    this.setState({
      pattern: pattern,
    }, () => {
      if (pattern[0][0].type !== TokenType.STR) this.next();
    }); 
    
    
  }

  // advances to next token using repeat logic. if no next token, call nextInstruction.
  advance(transState) {
    let {pattern, instrIndex, tokIndex, repeats, finished} = transState;

    if (pattern[instrIndex][tokIndex].type === TokenType.OPN_PAREN) {
      repeats.push({index: tokIndex, numRepeats: 0});
      tokIndex++;
    } else if (pattern[instrIndex][tokIndex].type === TokenType.CLS_PAREN) {
      if (needToRepeat(pattern[instrIndex], tokIndex, repeats[repeats.length - 1].numRepeats)){
        tokIndex = repeats[repeats.length-1].index + 1;
        repeats[repeats.length - 1].numRepeats++;
        console.log(repeats[repeats.length -1].numRepeats)
      } else {
        repeats.pop();
        tokIndex++;
      }

    } else {
      tokIndex++;
    }

    if (!pattern[instrIndex][tokIndex]) {
      instrIndex++;
      tokIndex = 0;

      if(instrIndex >= pattern.length) {
        finished = true;
        console.log('finished');
      }
    }

    transState.pattern = pattern;
    transState.instrIndex = instrIndex;
    transState.tokIndex = tokIndex;
    transState.repeats = repeats;
    transState.finished = finished;
  
  }

  next() {
    let transState = {
      pattern: this.state.pattern,
      instrIndex: this.state.instrIndex,
      tokIndex: this.state.tokIndex,
      repeats: this.state.repeats.slice(),
      finished: this.state.finished,
    }
    do {
     this.advance(transState);
    } while (transState.pattern[transState.instrIndex][transState.tokIndex].type !== TokenType.STR
      && !transState.finished);

    this.setState({
      ...transState,
    });
  }

  nextInstruction() {
    const pattern = this.state.pattern;
    if(this.state.instrIndex >= pattern.length) {
      this.setState({finished: true});
      console.log('done')
      return;
    }
    let nextInstrIndex = this.state.instrIndex + 1;
    let nextTokIndex = 0;
    
    this.setState({
      instrIndex: nextInstrIndex,     
    }, () => {
      if (pattern[nextInstrIndex][nextTokIndex].type !== TokenType.STR) {
        this.next();
      }
    })
    
    
  }

  render() {
    let display = null;
    if (this.state.pattern !== undefined) {
      display = (
        <div>
          <InstructionView instruction={this.state.pattern[this.state.instrIndex]} index={this.state.tokIndex}/>
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

// 
function needToRepeat(instruction, index, numRepeats) {
  
  // assumes we are at ')' token
  if (instruction[index].type !== TokenType.CLS_PAREN) console.log("fxn needToRepeat!!!!!");
  
  // if no multiplier, repeat indefinitely within ()'s
  if (instruction[index + 1].type !== TokenType.REP) return true;

  // we have a ()xNUM
  if (instruction[index + 2].type !== TokenType.NUM) console.log("asldkfjldkjlk");

  return numRepeats < Number(instruction[index + 2].value);
  
}

export default App;
