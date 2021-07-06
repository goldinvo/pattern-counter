import {TokenType, mapToToken, tokenFactory} from './Token'

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
class PatternLexer {  
  constructor(pattern) {
    this._tokens = tokenize(pattern);
    this._instrIndex = 0;
    this._tokenIndex = 0;
  }

  getCurrentToken() {
    return this._tokens[this._instrIndex][this._tokenIndex];
  }

  setPosition(instrIndex, tokenIndex) {
    if (this._tokens[instrIndex] === undefined || this._tokens[instrIndex][tokenIndex] === undefined) {
      return false;
    }
    this._instrIndex = instrIndex;
    this._tokenIndex = tokenIndex;
    return true;
  }

  advance() {
    return this.setPosition(this._instrIndex, this._tokenIndex + 1)
  }

  nextInstr() {
    return this.setPosition(this._instrIndex + 1, 0);
  }

}



// create an array of token arrays that represent an individual instruction
function tokenize(pattern) {

  // first, reduce in string form 
  // ex) `                            [
  //     5. (SC 3, INC) * 6 (30)        ["5", ".", "(", "SC 3", ",", "INC", ")", "*", "6", "(", "30", ")"],
  //     6. (SC 4, INC) * 6 (36)  ==>   ["6", ".", "(", "SC 4", ",", "INC", ")", "*", "6", "(", "36", ")"],
  //     7. (SC 5, INC) * 6 (42)        ["7", ".", "(", "SC 5", ",", "INC", ")", "*", "6", "(", "42", ")"]
  //     `                            ]
  let ret = pattern
    .trim()
    .split("\n")                // analyze each line of pattern instruction separately (array of arrays)
    .filter(token => token.trim() !== "")
    .map(tokenString => {
      return tokenString
        .trim()   
        .split(/([(){}[\].,*])/) // separate all non-literal tokens (literals always surrounded by separators)
        .map(token => token.trim())     // get rid of all whitespace
        .filter(token => token !== "");
    });


  // next, convert from strings to tokens (do a little parsing here too for special elements)
  ret = ret.map(tokenString => {
    let tokenArr = [];
    let index = 0; 
    // special case: step number  ex) 5.  or   5) at the beginning only
    if (mapToToken(tokenString[0] + tokenString[1]) === TokenType.INSTR_CNT){
        tokenArr.push(tokenFactory(TokenType.INSTR_CNT, tokenString[0] + tokenString[1]));
        index += 2;
    }
    while (index < tokenString.length) {
      const tokType = mapToToken(tokenString[index]);
      tokenArr.push(tokenFactory(tokType, tokenString[index]))
      index++;
    }
    return tokenArr;
  }) 

  return ret;
}


export { PatternLexer };