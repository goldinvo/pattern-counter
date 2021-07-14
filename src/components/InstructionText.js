import {TokenType} from '../Token'

// The text view for the current line of instruction. Displays in bold the step of the instruction 
// you are currently on (according to tokIndex), and highlights different parenthesis pairs in different colors
//
// properties: instruction, tokIndex, colors (an array of the sequence of colors)
function InstructionText(props) {

  // Get list of the indices of the parentheses we need to color
  //
  // Go left to right adding to stack if valid. Keep rejectNextClsParen to remember to reject corresponding
  // closing parenthesis from rejected open parenthesis.
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

  // crete output as sequence of token values surrounded by styled spans
  let colorIndex = 0; // index of color in input color array
  let clsParenColorStack = []; // to match with corresponding open paren colors

  let output = props.instruction.map( (token, index) => {

    const currentInstr = index === props.tokIndex; // bold this
    const coloredParen = indicesToStyle.includes(index); // color this

    let classes = currentInstr ? 'focusedText ' : '';

    if (coloredParen) {
      if (token.type === TokenType.OPN_PAREN) {
        classes += props.colors[colorIndex];
        clsParenColorStack.push(props.colors[colorIndex]);
        
        if ((colorIndex + 1) < props.colors.length) colorIndex++; // if we used up all of the colors already, just stay at last color
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