import { LitElement, html, customElement, property, css } from 'lit-element';
import { PlayerStatusData } from '../interfaces';

@customElement('player-status')
export class PlayerStatus extends LitElement {

  @property({ type: Object })
  data: PlayerStatusData;

  createRenderRoot() {
    return this;
  }

  renderCustomProperties() {
    if (!this.data.custom || Object.keys(this.data.custom).length === 0) return null;

    return html`
      ${Object.keys(this.data.custom).map((key: string) => {
        return html`<li class="label success">${key}: ${(this.data.custom as any)[key]}</li>`
      })}
    `;
  }

  render() {
    if (!this.data) return null;
    const {
      extraTurns,
      skippedTurns,
      speedModifiers,
      moveCondition,
      mandatorySkips
    } = this.data.effects;

    return html`
      <h4>${this.data.name}</h4>
      <ul class="player-status">
        ${extraTurns ? html`<li class="label success">Extra turn</li>` : null}
        ${skippedTurns ? html`<li class="label success">Missed turn</li>` : null}
        ${speedModifiers[0] ? html`<li class="label success">Speed modifier: ${speedModifiers[0]}</li>` : null}
        ${!!moveCondition ? html`<li class="label success">Move condition</li>` : null}
        ${mandatorySkips > 0 ? html`<li class="label success">Skip next mandatory space</li>` : null}
        ${this.data.zoneName ? html`<li class="label success">Zone: ${this.data.zoneName}</li>` : null}
        ${this.data.custom ? this.renderCustomProperties() : null}
      </ul>
    `;
  }
}