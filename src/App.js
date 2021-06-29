import React, { Component } from "react";
import ManualCounter from "./components/ManualCounter";
import PatternForm from "./components/PatternForm";
import InstructionView from "./components/InstructionView";

class App extends Component {
  render() {
    return (
      <div>
        <InstructionView />
        <ManualCounter />
        <PatternForm />
      </div>  
    );
  }
}

export default App;
