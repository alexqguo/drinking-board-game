import Rule from './Rule';
import { JsonRule, TurnIncrementer } from '../interfaces';
import Game from '../engine/Game';

export default class ReverseTurnOrderRule extends Rule {
  constructor(json: JsonRule) {
    super(json);
  }

  execute(closedCb: Function) {
    super.execute(closedCb);
    
    // Could also *= -1 but that avoids the interface
    if (TurnIncrementer.reverse === Game.turnIncrementer) {
      Game.turnIncrementer = TurnIncrementer.normal;
    } else {
      Game.turnIncrementer = TurnIncrementer.reverse;
    }

    Game.modal.enableClose();
  }
}