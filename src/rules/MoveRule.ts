import Rule from './Rule';
import { JsonRule, Direction, PlayerTarget } from '../interfaces';
import Game from '../engine/Game';
import Player from '../engine/Player';

class MoveRule extends Rule {
  direction: Direction;
  numSpaces: number;

  constructor(json: JsonRule) {
    super(json);
    const { playerTarget, direction, numSpaces } = json;
    this.validateRequired(playerTarget, direction, numSpaces);
    this.direction = direction;
    this.numSpaces = numSpaces;
  }

  execute(closedCb: Function): void {
    super.execute(closedCb);

    this.selectPlayers()
      .then((value: Player[]) => {
        const targetPlayer: Player = value[0];
        // TODO: make sure we don't exceed either bound
        const targetTileIndex: number = Math.max(0, targetPlayer.currentTileIndex + this.numSpaces);
        
        targetPlayer.teleportToTile(targetTileIndex);
        Game.painter.drawPlayers();
        Game.modal.close();
      });
  }
}

export default MoveRule;