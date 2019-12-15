import { LitElement, html, customElement, property } from 'lit-element';
import { findSession, connectToSession } from '../firebase';
import { GameData } from '../firebase/constants';

@customElement('join-game')
export default class JoinPage extends LitElement {

  @property({ type: String })
  status = 'warning';

  @property({ type: String })
  statusMessage = 'No game joined'

  @property({ type: String })
  gameId = '';

  @property({ type: Boolean })
  gameJoined = false;

  @property({ type: String })
  currentPlayer = '';

  createRenderRoot() {
    return this;
  }

  async joinGame(e: Event) {
    e.preventDefault();
    const gameId: string = (e.target as HTMLElement).querySelector('input').value;
    try {
      const gameData: GameData = await findSession(gameId);
      this.status = 'success';
      this.statusMessage = gameId;
      this.gameJoined = true;
      console.log(gameData);
    } catch (e) {
      this.status = 'error';
      this.statusMessage = `Could not find game with id ${gameId}.`;
    }

    // On page unload, log off the current user
  }

  render() {
    return html`
      <form @submit="${this.joinGame}">
        <input class="three" type="text" placeholder="Game ID" ?disabled="${this.gameJoined}">
        <button ?disabled="${this.gameJoined}">Join</button>
        <span class="label ${this.status}">${this.statusMessage}</span>
      </form>
    `;
  }
}