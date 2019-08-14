import Rule from './Rule';
import Game from '../Game';
import { JsonRule } from '../interfaces';

export default class GameOverRule extends Rule {
  constructor(json: JsonRule) {
    super(json);
  }

  execute(): void {
    alert('Game over!');
    Game.gameOver();
    Game.modal.enableClose();
  }
}