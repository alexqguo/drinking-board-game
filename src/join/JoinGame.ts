import { LitElement, html, customElement, property } from 'lit-element';
import { findSession, connectToSession, logOff } from '../firebase';
import { GameData, RemoteStatus } from '../firebase/constants';

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

  @property({ type: Boolean })
  playerJoined = false;

  @property({ type: Object })
  gameData: GameData = null;

  @property({ type: String })
  selectedPlayer = '';

  createRenderRoot() {
    return this;
  }

  async findGame(e: Event) {
    e.preventDefault();
    const gameId: string = (e.target as HTMLElement).querySelector('input').value;
    try {
      const gameData: GameData = await findSession(gameId);
      this.status = 'warn'; // reset the status message
      this.statusMessage = '';
      this.gameJoined = true;
      this.gameId = gameId;
      this.gameData = gameData;
      console.log('Connected to Firebase DB --', gameData);
    } catch (e) {
      this.status = 'error';
      this.statusMessage = `Could not find game with id ${gameId}.`;
    }
  }

  async joinGame(e: Event) {
    e.preventDefault();
    const playerName: string = this.selectedPlayer;

    try {
      await connectToSession(this.gameId, playerName);
      this.playerJoined = true;

      window.addEventListener('unload', () => {
        logOff(this.gameId, this.selectedPlayer);
      });
    } catch (e) {
      this.status = 'error';
      this.statusMessage = e.message;
    }
  }

  renderStatusMessage() {
    if (!this.statusMessage) return;
    return html`
      <span class="label ${this.status}">${this.statusMessage}</span>
    `;
  }

  renderGameId() {
    if (this.gameJoined) {
      return html`Game joined: ${this.gameId}`;
    }
    return html`
      <form @submit="${this.findGame}">
        <input class="three" type="text" placeholder="Game ID">
        <button>Join</button>
        ${this.renderStatusMessage()}
      </form>
    `;
  };

  renderPlayer() {
    if (!this.gameJoined) return;
    if (this.playerJoined) {
      return html`Player: ${this.selectedPlayer}`;
    }

    const activePlayers: string[] = [];
    const inactivePlayers: string[] = [];
    const playerNames: string[] = Object.keys(this.gameData.players)

    playerNames.forEach((name: string) => {
      const playerData: RemoteStatus = this.gameData.players[name];
      if (playerData.active) {
        activePlayers.push(name);
      } else {
        inactivePlayers.push(name);
      }
    });

    return html`
      <form @submit="${this.joinGame}">
        <h3>Select player</h3>
        Already active: ${activePlayers.join(', ') || 'None'}
        <br>
        ${inactivePlayers.map((p: string) => {
          return html`
            <label @click="${() => this.selectedPlayer = p}">
              <input type="radio" name="playername" value="${p}">
              <span class="checkable">${p}</span>
            </label><br>
          `;
        })}
        <br>
        <button ?disabled="${!this.selectedPlayer}">Join</button>
        ${this.renderStatusMessage()}
      </form>
    `;
  }

  render() {
    return html`
      <div>
        ${this.renderGameId()}
      </div>

      <div>
        ${this.renderPlayer()}
      </div>
    `;
  }
}