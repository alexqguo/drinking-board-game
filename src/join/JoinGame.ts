import { LitElement, html, customElement, property } from 'lit-element';
import { findSession, connectToSession, logOff, subscribeToPlayerActions, setPlayerAction } from '../firebase';
import { GameData, RemoteStatus, RemoteAction } from '../firebase/constants';

// This should probably be a few different components
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

  @property({ type: Boolean })
  playerJoined = false;

  @property({ type: Object })
  gameData: GameData = null;

  @property({ type: String })
  selectedPlayer = '';

  @property({ type: Array })
  availableActions: RemoteAction[] = [];

  @property({ type: Object })
  selectedAction: RemoteAction = null;

  @property({ type: Boolean })
  isPaused: boolean = false;

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
      this.status = 'warn'; // reset status message
      this.statusMessage = '';
      subscribeToPlayerActions(this.gameId, playerName, 'actions', (snap: firebase.database.DataSnapshot) => {
        if (snap && snap.val()) {
          this.availableActions = Object.values(snap.val());
        } else {
          this.availableActions = [];
        }
      });
      window.addEventListener('unload', () => logOff(this.gameId, this.selectedPlayer));
    } catch (e) {
      this.status = 'error';
      this.statusMessage = e.message;
    }
  }

  async sendAction(action: RemoteAction) {
    this.selectedAction = action;
    await setPlayerAction(this.gameId, this.selectedPlayer, action.id);
    this.selectedAction = null;
    this.isPaused = true;
    // Remove this action from the list
    this.availableActions = this.availableActions.filter((a: RemoteAction) => a !== action);

    // Prevent users from accidentally double tapping
    setTimeout(() => this.isPaused = true, 500);
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

  renderActions() {
    if (!this.gameJoined || !this.playerJoined) return;

    return html`
      <h3>You're in!</h3>
      ${this.availableActions.length ? this.availableActions.map((a: RemoteAction) => {
        return html`
          <button @click="${() => { this.sendAction(a) }}" ?disabled="${a === this.selectedAction || this.isPaused}">
            ${a.name}
          </button>
        `;
      }) : 'Please wait...'}
      ${this.renderStatusMessage()}
    `;
  }

  render() {
    return html`
      <div>${this.renderGameId()}</div>
      <div>${this.renderPlayer()}</div>
      <div>${this.renderActions()}</div>
    `;
  }
}