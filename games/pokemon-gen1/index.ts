/*
trainer battles

## need to choose pokemon at game start
- add pokemon to player status?
- DONE!

## need to trigger battles
- needs to be at the beginning of the move end event
- check current player current space
- if the current space has another player on it AND it's not a gym
  - open up a modal which contains the logic 
  - when modal closes, fire next()
  - if there are more than two people...

todo: split this out to multiple files. this is a gigantic mess
*/

// Unfortunately this will bring in lit-element a second time
import { LitElement, html, customElement, property } from 'lit-element';

interface PokemonSelection {
  [playerName: string]: string;
}

interface Trainer {
  playerName: string;
  starterName: string;
  numRolls?: number;
}

interface BattleResults {
  [playerName: string]: number[];
}

/////////////////////////////////////////////////////////////////////////oh god why
///////////////////////////////////////////////////////////////////////////////////

const starterNames = {
  pikachu: 'pikachu',
  squirtle: 'squirtle',
  charmander: 'charmander',
  bulbasaur: 'bulbasaur',
};

const starterStrengths = {
  [starterNames.pikachu]: starterNames.squirtle,
  [starterNames.squirtle]: starterNames.charmander,
  [starterNames.charmander]: starterNames.bulbasaur,
  [starterNames.bulbasaur]: starterNames.squirtle,
};

@customElement('trainer-battle')
class TrainerBattle extends LitElement {
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

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

@customElement('pokemon-selector')
class PokemonSelector extends LitElement {
  selectedPokemon: PokemonSelection;

  @property({ type: Array })
  playerNames: string[];

  @property({ type: Boolean })
  canSubmit: boolean;

  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this.selectedPokemon = {};
  }

  renderPlayerSelection(name: string) {
    return html`
      <label for="pokemon-select-${name}">${name}</label>
      <select @change="${this.handleSelect}" id="pokemon-select-${name}" data-player-name="${name}">
        <option value="" selected disabled hidden>Choose your Pokemon!</option>
        <option value="charmander">Charmander</option>
        <option value="squirtle">Squirtle</option>
        <option value="bulbasaur">Bulbasaur</option>
      </select>

      <br><br>
    `;
  }

  handleSelect(e: Event) {
    const playerName = (e.currentTarget as HTMLSelectElement).dataset.playerName;
    const pokemon = (e.currentTarget as HTMLSelectElement).value;
    this.selectedPokemon[playerName] = pokemon;
    
    if (Object.keys(this.selectedPokemon).length === this.playerNames.length) {
      this.canSubmit = true;
    }
  }

  handleDone() {
    // Lazy, just return the names in the same order as they were received
    const results = this.playerNames.map((n: string) => this.selectedPokemon[n]);
    const e: CustomEvent = new CustomEvent('pokemon-selected', {
      detail: {
        pokemon: results,
      },
    });
    this.dispatchEvent(e);
  }

  render() {
    return html`
      <div style="font-size: 1rem">
        ${this.playerNames.map((name: string) => this.renderPlayerSelection(name))}

        <button @click="${this.handleDone}" ?disabled="${!this.canSubmit}">Done</button>
      </div>
    `;
  }
}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

const w = window as any;

if (w.drinking) {
  const { Game, GameEvents, events } = w.drinking;

  GameEvents.on(events.GAME_START, (next: Function) => {
    const frag: DocumentFragment = document.createDocumentFragment();
    const pokemonSelector: HTMLElement = document.createElement('pokemon-selector');
    const playerNames: string[] = Game.players.map((p: any) => p.name);
    pokemonSelector.setAttribute('playerNames', JSON.stringify(playerNames));
    pokemonSelector.addEventListener('pokemon-selected', (e: CustomEvent) => {
      e.detail.pokemon.forEach((pokemon: string, i: number) => {
        Game.players[i].custom.pokemon = pokemon;
      });
      Game.modal.close();
      next();
    });

    frag.appendChild(pokemonSelector);
    Game.modal.openWithFragment('Choose your Pokemon!', frag);
    Game.modal.disableClose();
  });

  GameEvents.on(events.MOVE_END, (next: Function) => {
    // Check if it's the pikachu space, if so switch the pokemon for the current player

    if (Game.currentPlayer.currentTileIndex === 4) {
      Game.currentPlayer.custom.pokemon = 'pikachu';
    }

    const playersAtCurrentTile: Set<Object> = Game
      .board
      .tiles[Game.currentPlayer.currentTileIndex]
      .currentPlayers;

    if (playersAtCurrentTile.size >= 2) {
      triggerTrainerBattle(playersAtCurrentTile)
        .then(() => { next() });
    } else {
      next();
    }
  });

  function triggerTrainerBattle(players: Set<Object>): Promise<void> {
    return new Promise(resolve => {
      const frag: DocumentFragment = document.createDocumentFragment();
      const battle: HTMLElement = document.createElement('trainer-battle');
      const componentArgs = [...players].map((p: any) => {
        return {
          playerName: p.name,
          starterName: p.custom.pokemon,
        }
      });
      battle.setAttribute('data', JSON.stringify(componentArgs));
      battle.addEventListener('battle-ended', (e: CustomEvent) => {
        Game.modal.enableClose();
        resolve();
      });

      frag.appendChild(battle);
      Game.modal.openWithFragment('Trainer battle!', frag);
      Game.modal.disableClose();
    });
  }
}