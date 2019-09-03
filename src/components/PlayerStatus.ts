import { LitElement, html, customElement, property } from 'lit-element';
import { PlayerStatusData } from '../interfaces';

@customElement('player-status')
export class PlayerStatus extends LitElement {

  @property({ type: Object })
  data: PlayerStatusData;

  createRenderRoot() {
    return this;
  }

  // Redo this UI 
  render() {
    if (!this.data) return null;

    return html`
      <h4>${this.data.name}</h4>
      <ul class="player-status">
        <li>Extra turns: ${this.data.effects.extraTurns}</li>
        <li>Lost turns: ${this.data.effects.skippedTurns}</li>
        <li>Speed modifier: ${this.data.effects.speedModifiers[0] || 'None'}</li>
        <li>Move condition: ${!!this.data.effects.moveCondition ? 'Yes' : 'None'}</li>
        <li>Skip next required: ${this.data.effects.mandatorySkips > 0 ? 'Yes' : 'No'}</li>
      </ul>
    `;
  }
}