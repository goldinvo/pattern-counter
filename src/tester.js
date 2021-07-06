import { PatternLexer } from "./PatternLexer";

function tester() {
  console.log("====== tester ======");

  const testString = `
    5. (SC 3, INC) * 6, sc 1 (give it a shot), sc 2 (30)    
    6. (SC 4, INC) * 6 (36) 
    7. (SC 5, INC) * 6 (42) 
    `;

  let lexer = new PatternLexer(testString);
  console.log("==LEXER STATE==");
  console.log(lexer._tokens);

  // iterate over tokens
  let i = 0;
  do {
    console.log(`instruction ${i}`)
    do {
      console.log(lexer.getCurrentToken());
    } while (lexer.advance());
    i++;
  } while (lexer.nextInstr());


}
export default tester;