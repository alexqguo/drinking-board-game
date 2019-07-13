import Rule from './Rule';

class TeleportRule extends Rule {
  tileIndex: number;

  constructor(json: any) {
    const { type, playerTarget, diceRolls, tileIndex } = json;
    super(type, playerTarget, diceRolls);
    this.validateRequired(tileIndex);
    this.tileIndex = tileIndex;
  }

  execute() {
    // todo
  }
}

export default TeleportRule;