const TokenType = Object.freeze({
  INSTR_CNT: 'instrcnt', // 5. or 5)  (instruction number)
  INFO: 'info', // (30)  (30 stitches for this round)
  NUM: 'num', // 3
  STR: 'str', // '4'
  OPN_PAREN: 'opnparen', // (
  CLS_PAREN: 'clsparen', // ) 
  REP: 'rep', // *
  SEP: 'sep' // . or ,
})

function mapToToken(str) {
  if (str.match(/^\d+\.$/)) return TokenType.INSTR_CNT; // special cases go first!!! 5) 5.  or  (info)
  else if (str.match(/(\(.*?\))/)) return TokenType.INFO; 
  else if (str === '(' || str === '{' || str === '[') return TokenType.OPN_PAREN; // ( { [
  else if (str === ')' || str === '}' || str === ']') return TokenType.CLS_PAREN; // ) ] }
  else if (str === '*') return TokenType.REP;
  else if (str === ',' || str === '.') return TokenType.SEP;
  else if (str.match(/^\d+$/)) return TokenType.NUM;
  else return TokenType.STR;
 
}

const tokenFactory = (type, value) => {
  return {type, value};
}
export {TokenType, mapToToken, tokenFactory};