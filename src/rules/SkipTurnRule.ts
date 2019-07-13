import Rule from './Rule';

class SkipTurnRule extends Rule {
  numTurns: number;

  constructor(json: any) { // todo- fix any
    const { type, playerTarget, diceRolls, numTurns } = json;
    super(type, playerTarget, diceRolls);
    this.validateRequired(numTurns);
    this.numTurns = numTurns;
  }

  execute() {
    // todo
  }
}

export default SkipTurnRule;