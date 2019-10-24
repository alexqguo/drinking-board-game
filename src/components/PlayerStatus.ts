import { LitElement, html, customElement, property } from 'lit-element';
import { PlayerStatusData } from '../interfaces';

@customElement('player-status')
export default class PlayerStatus extends LitElement {

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
      mandatorySkips,
      customMandatoryTiles,
      anchors,
      rollAugmentation,
    } = this.data.effects;

    return html`
      <h4>${this.data.name}</h4>
      <ul class="player-status">
        ${extraTurns ? html`<li class="label success">Extra turn</li>` : null}
        ${mandatorySkips > 0 ? html`<li class="label success">Skip next mandatory space</li>` : null}
        ${speedModifiers[0] ? html`<li class="label success">Speed modifier: ${speedModifiers[0].description}</li>` : null}
        ${rollAugmentation ? html`<li class="label success">${rollAugmentation.description}</li>` : null}
        ${skippedTurns.length ? html`<li class="label error">Missed turn</li>` : null}
        ${!!moveCondition ? html`<li class="label warning">${moveCondition.description}</li>` : null}
        ${customMandatoryTiles.length ? html`<li class="label warning">Custom mandatory</li>` : null}
        ${anchors > 0 ? html`<li class="label info">Cannot pass</li>` : null}
        ${this.data.zoneName ? html`<li class="label info">Zone: ${this.data.zoneName}</li>` : null}
        ${this.data.custom ? this.renderCustomProperties() : null}
      </ul>
    `;
  }
}