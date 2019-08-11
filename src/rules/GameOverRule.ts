import Rule from './Rule';
import Game from '../Game';
import { JsonRule } from '../interfaces';

export default class GameOverRule extends Rule {
  constructor(json: JsonRule) {
    const { displayText, type, playerTarget, diceRolls } = json;
    super(displayText, type, playerTarget, diceRolls);
  }

  execute(): void {
    alert('Game over!');
    Game.gameOver();
  }
}