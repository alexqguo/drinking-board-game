import { LitElement, html, customElement, property } from 'lit-element';
import { PokemonSelection } from './constants';

@customElement('pokemon-selector')
export default class PokemonSelector extends LitElement {
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