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

*/

// Unfortunately this will bring in lit-element a second time
import { LitElement, html, customElement, property } from 'lit-element';

interface PokemonSelection { 
  [playerName: string]: string
}

@customElement('pokemon-selector')
export class PokemonSelector extends LitElement {
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

const w = window as any;

if (w.drinking) {
  const { Game, GameEvents, events } = w.drinking;

  GameEvents.on(events.GAME_START, (next: Function) => {
    const frag: DocumentFragment = document.createDocumentFragment();
    const pokemonSelector = document.createElement('pokemon-selector');
    const playerNames = Game.players.map((p: any) => p.name);
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

    console.log('Check if players are on the same space (and it\'s not a gym');
    next();
  });
}