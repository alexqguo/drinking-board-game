import Rule from './Rule';
import { JsonRule, PlayerTarget } from '../interfaces';
import Player from '../Player';
import Game from '../Game';

/**
 * This is a quick shitty solution until I have enough time to implement a better
 * one as a part of ChoiceRule. Just going to hardcode it for now.
 */
class ChallengeRule extends Rule {
  constructor(json: JsonRule) {
    super(json);
    this.playerTarget = PlayerTarget.custom;
  }

  execute(closedCb: Function) {
    super.execute(closedCb)

    this.selectPlayers()
      .then((value: Player[]) => {
        const challengers = [value[0], Game.currentPlayer];

        Game.modal.requirePlayerSelection(challengers, 'Who won?')
          .then((value: Player[]) => {
            const winningPlayer = value[0];
            const losingPlayer = challengers.find((p: Player) => p !== winningPlayer);

            losingPlayer.effects.skippedTurns++;
            winningPlayer.effects.extraTurns++;
            Game.modal.close();
          });
      });
  }
}

export default ChallengeRule;