import Rule from './Rule';
import Game from '../engine/Game';
import Player from '../engine/Player';
import { JsonRule } from '../interfaces';

/**
 * This rule can probably be extended quite a bit if needed
 * - num rolls for each
 * - outcome for the winner
 */
export default class GroupRollRule extends Rule {

  constructor(json: JsonRule) {
    super(json);
  }

  execute(closedCb: Function) {
    super.execute(closedCb);
    const playerNames = Game.players.map((p: Player) => p.name);

    const frag: DocumentFragment = document.createDocumentFragment();
    const display: HTMLDivElement = document.createElement('div');
    display.innerText = this.displayText;
    const el: HTMLElement = document.createElement('group-roll');
    el.setAttribute('players', JSON.stringify(playerNames));
    frag.appendChild(display);
    frag.appendChild(el);

    Game.modal.openWithFragment(Game.currentPlayer.name, frag);
    el.addEventListener('done', () => {
      Game.modal.enableClose(); 
    });
  }
}