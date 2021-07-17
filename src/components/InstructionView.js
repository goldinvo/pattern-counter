import InstructionText from './InstructionText'
import Counter from './Counter'
import ManualCounter from './ManualCounter';

import './InstructionView.css'
import { TokenType } from '../Token';

const COLORS = ['red', 'orange', 'yellow'];

// an instruction displayed when the pattern is finished
const FINISHED = [{type: TokenType.STR, value: "Pattern Finished!"}]

// Create the instruction view based on the state of the pattern 
//
// properties: instruction, tokIndex, repeats (array), onRepeatChange (handle change in # of repeats in counter), finished
function InstructionView(props) {
  // if (props.finished) {
  //   return <InstructionText 
  //     instruction={FINISHED}
  //     tokIndex='0'
  //     colors={COLORS}
  //   />
  // }
  
  let repeatCounters = props.repeats.map( (repeatElement, index) => {
    let color = index < COLORS.length ? COLORS[index] : COLORS[COLORS.length - 1];
    return (
        <Counter 
        key={index} 
        color={color} 
        name={`Repeat Counter ${index + 1}`} 
        value={repeatElement.numRepeats} 
        onChange={(event) => {
          props.onRepeatChange(index, event);
        }}
        />
    );
  });
   
  return (
    <div className='instructionView'>
      <InstructionText 
      instruction={props.instruction}
      tokIndex={props.tokIndex}
      colors={COLORS}
      />
      <div className='countersContainer'>
        {repeatCounters}
        <ManualCounter />
      </div>
    </div>
  );
} 

export default InstructionView;