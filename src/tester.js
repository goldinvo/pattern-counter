import PatternLexer from "./PatternLexer";

function tester() {
  console.log("====== tester ======");

  const testString = `
    5. (SC 3, INC) * 6, sc 1 (give it a shot), sc 2 (30)    
    6. (SC 4, INC) * 6 (36) 
    7. (SC 5, INC) * 6 (42) 
    `;

  let pattern = new PatternLexer.tokenize(testString);
  console.log("==LEXER STATE==");
  console.log(pattern);

  // iterate over tokens
  let i = 0;
  let j = 0;
  do {
    console.log(`instruction ${i}`)
    do {
      console.log(pattern[i][j]);
      j++;
    } while (j < pattern[i].length);
    i++;
    j = 0;
  } while (i < pattern.length);
  
}
export default tester;