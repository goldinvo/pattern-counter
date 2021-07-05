// lexing interface for a given pattern string to be used by parser
// ex) `                            [
//     5. (SC 3, INC) x 6 (30)        ["5", ".", "(", "SC 3", ",", "INC", ")", "x", "6", "(", "30", ")"],  (instruction 0)
//     6. (SC 4, INC) x 6 (36)  ==>   ["6", ".", "(", "SC 4", ",", "INC", ")", "x", "6", "(", "36", ")"],  (instruction 1)
//     7. (SC 5, INC) x 6 (42)        ["7", ".", "(", "SC 5", ",", "INC", ")", "x", "6", "(", "42", ")"]   (instruction 2)
//     `                            ]
//
// currentToken: starts at first token of first instruction
// advance(): advance to next token within an instruction. returns false iff cannot advance (end of instr);
// nextInstr(): currentToken is now the first token of the next instruction. returns false iff no next instruction.
// 
class PatternLexer {  
  constructor(pattern) {
    this._tokens = tokenize(pattern);
    this._instrIndex = 0;
    this._tokenIndex = 0;
  }

  get currentToken() {
    return this._tokens[this._instrIndex][this._tokenIndex];
  }

  advance() {
    if (this._tokens[this._instrIndex][this._tokenIndex + 1] !== undefined) {
      this._tokenIndex++;
      return true;
    }
    return false;
  }

  nextInstr() {
    this._tokenIndex = 0;
    if (this._tokens[this._instrIndex + 1] !== undefined) {
      this._instrIndex++;
      return true;
    }
    return false;
  }

}

// create an array of token arrays that represent an individual instruction
// ex) `                            [
//     5. (SC 3, INC) x 6 (30)        ["5", ".", "(", "SC 3", ",", "INC", ")", "x", "6", "(", "30", ")"],
//     6. (SC 4, INC) x 6 (36)  ==>   ["6", ".", "(", "SC 4", ",", "INC", ")", "x", "6", "(", "36", ")"],
//     7. (SC 5, INC) x 6 (42)        ["7", ".", "(", "SC 5", ",", "INC", ")", "x", "6", "(", "42", ")"]
//     `                            ]
function tokenize(pattern) {
  return pattern
    .trim()
    .split("\n")                // analyze each line of pattern instruction separately (array of arrays)
    .filter(token => token.trim() !== "")
    .map(tokenString => {
      return tokenString
        .trim()   
        .split(/([(){}[\].,x])/) // separate all non-literal tokens (literals always surrounded by separators)
        .map(token => token.trim())     // get rid of all whitespace
        .filter(token => token !== "");
    })

}



export { PatternLexer };