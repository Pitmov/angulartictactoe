export class State {
  turn:string;
  board:string[];
  numberOfTurns:number;
  result:string;
  winningLine:string;
  oMovesCount:number;

  constructor(state?:State) {
    this.turn = 'X';
    this.board = Array(9).fill(null);
    this.numberOfTurns = 0;
    this.result = '';
    this.winningLine = '';
    this.oMovesCount = 0;

    if (state !== undefined) {
      this.board = state.board.slice();
      this.turn = state.turn;
      this.numberOfTurns = state.numberOfTurns;
      this.result = state.result;
      this.winningLine = state.winningLine;
      this.oMovesCount = state.oMovesCount;
    }
  }
}
