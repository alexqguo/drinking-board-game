import Rule from './Rule';
import Game from '../Game';
import { JsonRule } from '../interfaces';

export default class ExtraTurnRule extends Rule {
  constructor(json: JsonRule) {
    super(json);
    // TODO - specify number of extra turns? need to involve playerTarget here
  }

  execute(): void {
    super.execute();
    
    // can specify now or later?
    Game.playerTurns.unshift(Game.currentPlayer);
    Game.modal.enableClose();
  }
}