import InstructionText from './InstructionText'
import Counter from './Counter'
import ManualCounter from './ManualCounter';

import './InstructionView.css';

const COLORS = ['red', 'orange', 'yellow'];

// properties: instruction, index, repeats
function InstructionView(props) { 
  let repeatCounters = props.repeats.map( (repeatElement, index) => {
    let color = index < COLORS.length ? COLORS[index] : COLORS[COLORS.length - 1];
    return (
        <Counter key={index} color={color} name={`Repeat Counter ${index + 1}`} value={repeatElement.numRepeats}/>
    );
  });
   
  return (
    <div className='instructionView'>
      <div><InstructionText instruction={props.instruction} index={props.index} colors={COLORS}/></div>
      <div className='countersContainer'>
        {repeatCounters}
        <ManualCounter />
      </div>
      
    </div>
  );
} 

export default InstructionView;