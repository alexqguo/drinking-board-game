import Rule from './Rule';
import Game from '../Game';
import { JsonRule } from '../interfaces';

export default class ExtraTurnRule extends Rule {
  constructor(json: JsonRule) {
    super(json);
    // TODO - specify number of extra turns? now or later? need to involve playerTarget here
  }

  execute(): void {
    super.execute();
    Game.currentPlayer.extraTurns++;
    Game.modal.enableClose();
  }
}