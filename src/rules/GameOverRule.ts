import Rule from './Rule';
import Game from '../Game';
import { JsonRule } from '../interfaces';

export default class GameOverRule extends Rule {
  constructor(json: JsonRule) {
    const { type, playerTarget, diceRolls } = json;
    super(type, playerTarget, diceRolls);
  }

  execute(): void {
    console.log('Game over!');
    Game.gameOver();
  }
}