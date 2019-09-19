import Rule from './Rule';
import { JsonRule, Direction, DiceRoll } from '../interfaces';
import Game from '../engine/Game';
import Player from '../engine/Player';

class MoveRule extends Rule {
  diceRolls: DiceRoll;
  direction: Direction;
  numSpaces: number;

  constructor(json: JsonRule) {
    super(json);
    const { playerTarget, direction, numSpaces, diceRolls } = json;
    this.validateRequired(playerTarget, direction);
    this.validateOneOf(numSpaces, diceRolls);
    this.direction = direction;
    this.numSpaces = numSpaces;
    this.diceRolls = diceRolls;
  }

  execute(closedCb: Function): void {
    super.execute(closedCb);

    this.selectPlayers()
      .then((value: Player[]) => {
        const targetPlayer: Player = value[0];

        if (this.numSpaces) {
          // TODO: make sure we don't exceed the end of the game
          const targetTileIndex: number = Math.max(0, targetPlayer.currentTileIndex + this.numSpaces);
          this.movePlayer(targetPlayer, targetTileIndex);
        } else if (this.diceRolls) {
          Game.modal.requireDiceRolls(this.diceRolls.numRequired, (rolls: number[]) => {
            let total = rolls.reduce((acc: number, cur: number) => acc + cur);
            if (this.direction === Direction.back) total *= -1;
            const targetTileIndex: number = Math.max(0, targetPlayer.currentTileIndex + total);
            this.movePlayer(targetPlayer, targetTileIndex);
          });
        }
      });
  }

  movePlayer(targetPlayer: Player, targetTileIndex: number): void {
    targetPlayer.teleportToTile(targetTileIndex);
    Game.painter.drawPlayers();
    Game.modal.close();
  }
}

export default MoveRule;