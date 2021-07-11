import InstructionText from './InstructionText'
import Counter from './Counter'
import './InstructionText.css';

const COLORS = ['red', 'orange', 'yellow'];

// properties: instruction, index, repeats
function InstructionView(props) { 
  let repeatCounters = props.repeats.map( (repeatElement, index) => {
    let style = index < COLORS.length ? COLORS[index] : COLORS[COLORS.length - 1];
    return (
      <div className={style}>
        <Counter key={index} name={`Repeat Counter ${index + 1}`} value={repeatElement.numRepeats}/>
      </div>
    );
  });
  
  return (
    <div>
      <InstructionText instruction={props.instruction} index={props.index} colors={COLORS}/>
      {repeatCounters}
    </div>
  );
} 

export default InstructionView;