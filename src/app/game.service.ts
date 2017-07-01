import {Injectable} from '@angular/core';
import {State} from './state.model';

@Injectable()
export class GameService {
  nextStep(state:State):State {
    let newState:State = new State(state);
    newState = this.changeTurn(state);
    if (newState.turn === 'O' && !this.isGameEnded(state)) {
      newState = this.takeAMasterMove(newState);
    }
    return newState;
  }

  makeStep(index:number, state:State):State {
    let newState = new State(state);
    newState.board[index] = state.turn;
    if (newState.turn === 'O') {
      newState.oMovesCount++;
    }
    return newState;
  }

  makeFullStep(index:number, state:State):State {
    let newState:State = new State(state);
    if (!this.isGameEnded(newState) && !newState.board[index]) {
      newState = this.makeStep(index, newState);
      newState = this.nextStep(newState);
    }
    return newState;
  }

  changeTurn(state:State):State {
    return Object.assign({}, state, {turn: state.turn === 'X' ? 'O' : 'X'});
  }

  reset():State {
    return new State();
  }

  isGameEnded(state):boolean {
    // check rows
    for (let i = 0; i < 9; i += 3) {
      if (!!state.board[i] && state.board[i] === state.board[i + 1] && state.board[i] === state.board[i + 2]) {
        state.result = `${state.board[i]} player win!`;
        if (i === 0) {
          state.winningLine = 'first-row';
        } else if (i === 3) {
          state.winningLine = 'second-row';
        } else if (i === 6) {
          state.winningLine = 'third-row';
        }
        return true;
      }
    }
    // check columns
    for (let i = 0; i < 3; i++) {
      if (!!state.board[i] && state.board[i] === state.board[i + 3] && state.board[i] === state.board[i + 6]) {
        state.result = `${state.board[i]} player win!`;
        if (i === 0) {
          state.winningLine = 'first-col';
        } else if (i === 1) {
          state.winningLine = 'second-col';
        } else if (i === 2) {
          state.winningLine = 'third-col';
        }
        return true;
      }
    }
    // check diagonals
    if (!!state.board[0] && state.board[0] === state.board[4] && state.board[0] === state.board[8]) {
      state.result = `${state.board[0]} player win!`;
      state.winningLine = 'left-diagonal';
      return true;
    }
    if (!!state.board[2] && state.board[2] === state.board[4] && state.board[2] === state.board[6]) {
      state.result = `${state.board[2]} player win!`;
      state.winningLine = 'right-diagonal';
      return true;
    }

    if (!state.board.some((cell) => !cell)) {
      state.result = 'Draw';
      return true;
    }

    return false;
  }

  score(state:State) {
    if (this.isGameEnded(state)) {
      if (state.result === 'X player win!') {
        return 10 - state.oMovesCount;
      } else if (state.result === 'O player win!') {
        return -10 + state.oMovesCount;
      } else if (state.result === 'Draw') {
        return 0;
      }
    }
  }

  /*
   * private recursive function that computes the minimax value of a game state
   * @param state [State] : the state to calculate its minimax value
   * @returns [Number]: the minimax value of the state
   */
  minimaxValue(state:State) {
    if (this.isGameEnded(state)) {
      //a terminal game state is the base case
      return this.score(state);
    }
    else {
      let stateScore:number; // this stores the minimax value we'll compute

      if (state.turn === "X")
      // X maximizs --> initialize to a value smaller than any possible score
        stateScore = -1000;
      else
      // O minimizes --> initialize to a value larger than any possible score
        stateScore = 1000;

      let availablePositions:number[] = this.getEmptyCellIndexes(state);

      //enumerate next available states using the info form available positions
      let availableNextStates:State[] = availablePositions.map((pos) => {

        let nextState:State = this.makeFullStep(pos, state);

        return nextState;
      });

      /* calculate the minimax value for all available next states
       * and evaluate the current state's value */
      availableNextStates.forEach((nextState) => {

        let nextScore:number = this.minimaxValue(nextState); //recursive call

        if (state.turn === "X") {
          // X wants to maximize --> update stateScore iff nextScore is larger
          if (nextScore > stateScore)
            stateScore = nextScore;
        }
        else {
          // O wants to minimize --> update stateScore iff nextScore is smaller
          if (nextScore < stateScore)
            stateScore = nextScore;
        }
      });

      //backup the minimax value
      return stateScore;
    }
  }

  getEmptyCellIndexes(state):number[] {
    let emptyCells:number[] = [];
    state.board.forEach((cell, index) => {
      if (!cell) {
        emptyCells.push(index);
      }
    });
    return emptyCells;
  }

  takeAMasterMove(state:State) {
    let available = this.getEmptyCellIndexes(state);

    //enumerate and calculate the score for each avaialable actions to the ai player
    let availableActions = available.map((pos) => {
      let newState:State = this.makeFullStep(pos, state);

      //calculate and set the action's minmax value
      let minimaxVal:number = this.minimaxValue(newState);

      return {minimaxVal: minimaxVal, state: newState};
    });

    //sort the enumerated actions list by score
    if (state.turn === "X")
    //X maximizes --> descend sort the actions to have the largest minimax at first
      availableActions.sort(this.desceding);
    else
    //O minimizes --> acend sort the actions to have the smallest minimax at first
      availableActions.sort(this.asceding);


    //take the first action as it's the optimal
    let chosenAction = availableActions[0];
    let next = chosenAction.state;

    return next;
  }

  /*
   * public static method that defines a rule for sorting AIAction in ascending manner
   * @param firstAction [AIAction] : the first action in a pairwise sort
   * @param secondAction [AIAction]: the second action in a pairwise sort
   * @return [Number]: -1, 1, or 0
   */
  asceding(firstAction, secondAction) {
    if (firstAction.minimaxVal < secondAction.minimaxVal)
      return -1; //indicates that firstAction goes before secondAction
    else if (firstAction.minimaxVal > secondAction.minimaxVal)
      return 1; //indicates that secondAction goes before firstAction
    else
      return 0; //indicates a tie
  }

  /*
   * public static method that defines a rule for sorting AIAction in descending manner
   * @param firstAction [AIAction] : the first action in a pairwise sort
   * @param secondAction [AIAction]: the second action in a pairwise sort
   * @return [Number]: -1, 1, or 0
   */
  desceding(firstAction, secondAction) {
    if (firstAction.minimaxVal > secondAction.minimaxVal)
      return -1; //indicates that firstAction goes before secondAction
    else if (firstAction.minimaxVal < secondAction.minimaxVal)
      return 1; //indicates that secondAction goes before firstAction
    else
      return 0; //indicates a tie
  }
}
