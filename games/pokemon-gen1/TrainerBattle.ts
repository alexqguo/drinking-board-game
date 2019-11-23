import { LitElement, html, customElement, property, TemplateResult } from 'lit-element';
import { Trainer, BattleResults } from './constants';

@customElement('trainer-battle')
export default class TrainerBattle extends LitElement {
  results: BattleResults;

  @property({ type: Object })
  data: Trainer[];

  @property({ type: Object })
  starterStrengths: { [key: string]: string };

  @property({ type: String })
  winners: Trainer[];

  @property({ type: String })
  losers: Trainer[];

  @property({ type: String })
  battleSrc: string;

  @property({ type: String })
  victorySrc: string;

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
    let losers: Trainer[] = [];
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
      const curTrainer: Trainer = this.data.find((p: Trainer) => p.playerName === playerName);

      if (Math.max(...this.results[playerName]) === maxRoll) {
        winners.push(curTrainer);
      } else {
        losers.push(curTrainer);
      }
    });

    this.winners = winners;
    this.losers = losers;
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
    const winnerNames: string = this.winners
      .map((winner: Trainer) => winner.playerName)
      .join(', ');
    const loserNames: string = this.losers
      .map((loser: Trainer) => loser.playerName)
      .join(', ');

    const doneButton = html`<button @click="${this.done}">Done</button>`;
    if (this.winners.length > 1 && this.losers.length === 0) {
      return html`
        Tie: ${winnerNames}. Each drink one.
        ${doneButton}
      `;
    } else {
      return html`
        Winners: ${winnerNames}. Losers: ${loserNames}. Losers drink two.
        ${doneButton}
      `;
    }
  }

  render() {
    return html`
      <audio autoplay loop src="${this.winners ? this.victorySrc : this.battleSrc}"></audio>
      <div style="font-size: 1rem">
        <div class="md">
          Land on the same space as another player: You each roll a die, and whoever rolls the higher number wins!
          Loser drinks 2. If you roll the same number, both drink 1 unless there is an outright loser.
          <span data-tooltip="House rule"><span class="help-icon"></span></span>
          If your starter is strong against an opponents starter, you get 2 dice rolls to their 1, and you take the higher of the 2 rolls.
        </div>

        ${this.data.map((player: Trainer) => this.renderPlayer(player))}
        ${this.winners && this.renderWinCondition()}
      </div>
    `;
  }

  firstUpdated() {
    this.data.forEach((player: Trainer) => {
      const weakPokemon: string = this.starterStrengths[player.starterName];
      const hasStrength: boolean = this.data.filter((p: Trainer) => p.starterName === weakPokemon).length > 0;
      player.numRolls = hasStrength ? 2 : 1;
      this.results[player.playerName] = [];
    });

    this.requestUpdate();
  }
}