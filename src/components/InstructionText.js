import {TokenType} from '../Token'

// The text view for the current line of instruction. Displays in bold the step of the instruction 
// you are currently on (according to tokIndex), and highlights parenthesis pairs in individual colors
//
// properties: instruction, tokIndex, colors (an array of the sequence of colors)
function InstructionText(props) {

  let indicesToStyle = [];
  let rejectNextClsParen = 0;
  props.instruction.forEach((token, index) => {

    if (token.type === TokenType.OPN_PAREN) {
      index < props.tokIndex ? indicesToStyle.push(index) : rejectNextClsParen++;

    } else if (token.type === TokenType.CLS_PAREN) {
      if (index < props.tokIndex) {
        indicesToStyle.pop();
      } else {
        rejectNextClsParen ? rejectNextClsParen-- : indicesToStyle.push(index);
      }
    }

  });


  
  let colorIndex = 0;    
  let clsParenColorStack = [];
  let output = props.instruction.map( (token, index) => {
    const currentInstr = index === props.tokIndex;
    const coloredParen = indicesToStyle.includes(index);
    let classes = currentInstr ? 'focusedText ' : '';
    if (coloredParen) {
      if (token.type === TokenType.OPN_PAREN) {
        classes += props.colors[colorIndex];
        clsParenColorStack.push(props.colors[colorIndex]);
        
        if ((colorIndex + 1) < props.colors.length) colorIndex++;
      } else {
        // closed paren
        classes += clsParenColorStack.pop();
      }
      
    }

    return <span className={classes} key={index}>{token.value + " "}</span>;
  }) 
  
  return (
    <div className='instructionText'>
      {output}
    </div>
  );
}

export default InstructionText;