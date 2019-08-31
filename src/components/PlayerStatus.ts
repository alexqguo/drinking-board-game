import { LitElement, html, customElement, property } from 'lit-element';
import Player from '../Player';

@customElement('player-status')
export class PlayerStatus extends LitElement {

  @property({ type: Player })
  player: Player = null;

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <h4>${this.player.name}</h4>
      hello
    `;
  }
}