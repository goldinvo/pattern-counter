import {TokenType} from '../Token'


// properties: instruction, index, colors
function InstructionText(props) {
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