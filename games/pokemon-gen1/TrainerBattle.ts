import { LitElement, html, customElement, property } from 'lit-element';
import { starterStrengths, Trainer, BattleResults } from './constants';

@customElement('trainer-battle')
export default class TrainerBattle extends LitElement {
  results: BattleResults;

  @property({ type: Object })
  data: Trainer[];

  @property({ type: String })
  winners: Trainer[];

  constructor() {
    super();
    this.results = {};
  }

  createRenderRoot() {
    return this;
  }

  isBattleOver(): boolean {
    const incompletePlayers: Trainer[] = this.data.filter((player: Trainer) => {
      return this.results[player.playerName].length < player.numRolls;
    });

    return incompletePlayers.length === 0;
  }

  battleOver() {
    let winners: Trainer[] = [];
    let maxRoll: number = null;

    // Calculate the max roll
    Object.keys(this.results).forEach((playerName: string) => {
      const playerMax: number = Math.max(...this.results[playerName]);
      if (maxRoll === null || playerMax > maxRoll) {
        maxRoll = playerMax;
      }
    });

    // Find all players with that roll
    Object.keys(this.results).forEach((playerName: string) => {
      if (Math.max(...this.results[playerName]) === maxRoll) {
        winners.push(this.data.find((p: Trainer) => p.playerName === playerName));
      }
    });

    this.winners = winners;
  }

  handleRoll(e: CustomEvent) {
    const roll: number = e.detail.roll;
    const player: string = (e.currentTarget as HTMLElement).dataset.playerName;
    this.results[player].push(roll);
    
    if (this.isBattleOver()) {
      this.battleOver();
    }
  }

  done() {
    this.dispatchEvent(new CustomEvent('battle-ended'));
  }

  renderPlayer(player: Trainer) {
    return html`
      ${player.playerName}: ${player.starterName}
      ${new Array(player.numRolls).fill(null).map(() => {
        // Hacky way to do numRoll.times. Rendering logic in lit-element isn't great
        return html`<dice-roll @roll="${this.handleRoll}" data-player-name="${player.playerName}"></dice-roll>`;
      })}
      <br>
    `;
  }

  renderWinCondition() {
    if (this.winners.length === 1) {
      return html`
        ${this.winners[0].playerName} wins. All losers take two drinks.
        <button @click="${this.done}">Done</button>
      `;
    }

    const winnerNames: string[] = this.winners.map((winner: Trainer) => winner.playerName);
    return html`
      Winners: ${winnerNames.join(', ')}. All losers take two drinks.
      <button @click="${this.done}">Done</button>
    `;
  }

  render() {
    return html`
      <div style="font-size: 1rem">
        ${this.data.map((player: Trainer) => this.renderPlayer(player))}
        ${this.winners && this.renderWinCondition()}
      </div>
    `;
  }

  firstUpdated() {
    this.data.forEach((player: Trainer) => {
      const weakPokemon: string = starterStrengths[player.starterName];
      const hasStrength: boolean = this.data.filter((p: Trainer) => p.starterName === weakPokemon).length > 0;
      player.numRolls = hasStrength ? 2 : 1;
      this.results[player.playerName] = [];
    });

    this.requestUpdate();
  }
}