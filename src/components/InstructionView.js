import {TokenType} from '../Token'
import './InstructionView.css';

const COLORS = ['red', 'orange', 'yellow'];

// properties: instruction, index
function InstructionView(props) {
  let indicesToStyle = [];
  props.instruction.forEach((token, index) => {
    if (token.type === TokenType.OPN_PAREN && index < props.index) {
      indicesToStyle.push(index);
    } else if (token.type === TokenType.CLS_PAREN) {
      index < props.index ? indicesToStyle.pop() : indicesToStyle.push(index);
    }
  });


  let colorIndex = 0;    
  let clsParenColorStack = [];
  let output = props.instruction.map( (token, index) => {
    
    const currentInstr = index === props.index;
    const coloredParen = indicesToStyle.includes(index);
    let classes = currentInstr ? 'focused ' : '';
    if (coloredParen) {
      if (token.type === TokenType.OPN_PAREN) {
        classes += COLORS[colorIndex];
        clsParenColorStack.push(COLORS[colorIndex]);
        
        if ((colorIndex + 1) < COLORS.length) colorIndex++;
      } else {
        // closed paren
        classes += clsParenColorStack.pop();
      }
      
    }

    return <span className={classes} key={index}>{token.value + " "}</span>;
  }) 
  
  return (
    <div>
      {output}
    </div>
  );
}

export default InstructionView