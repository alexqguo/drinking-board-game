import Rule from './Rule';
import { JsonRule, Direction, PlayerTarget } from '../interfaces';
import Game from '../Game';
import Player from '../Player';

class MoveRule extends Rule {
  direction: Direction;
  numSpaces: number;

  constructor(json: JsonRule) {
    const { displayText, type, playerTarget, diceRolls, direction, numSpaces } = json;
    super(displayText, type, playerTarget, diceRolls);
    this.validateRequired(playerTarget, direction, numSpaces);
    this.direction = direction;
    this.numSpaces = numSpaces;
  }

  execute(): void {
    super.execute();

    this.selectPlayers()
      .then((value: Player[]) => {
        const targetPlayer: Player = value[0];
        // TODO: make sure we don't exceed either bound
        const targetTileIndex: number = Math.max(0, targetPlayer.currentTileIndex + this.numSpaces);
        
        targetPlayer.moveToTile(targetTileIndex);
        targetPlayer.currentPos = targetPlayer.destinationPos;
        Game.painter.drawPlayers();
        Game.modal.close();
      });
  }
}

export default MoveRule;