import { createId } from '../utils';
import { Action } from './constants';
import Player from '../engine/Player';
import { addAction, removeAction, subscribeToPlayerActions } from '.';

export default class ActionManager {
  actions: Map<string, Action>;

  constructor(gameId: string, players: Player[]) {
    this.actions = new Map();

    players.forEach((p: Player) => {
      subscribeToPlayerActions(gameId, p.name, 'lastAction', (snap: firebase.database.DataSnapshot) => {
        const actionId: string = snap && snap.val();
        if (actionId && this.actions.has(actionId)) {
          this.actions.get(actionId).fn();
        }
      });
    });
  }

  createAction(name: string, gameId: string, player: Player, actionFn: Function): Action {
    const actionId: string = createId(name);
    const path: string = `games/${gameId}/players/${player.name}/actions/${actionId}`;
    const action: Action = {
      name,
      path,
      id: actionId,
      fn: () => {
        this.remove(action);
        actionFn();
      },
    };
    this.actions.set(actionId, action);
    
    addAction(action); // Add reference to firebase
    return action;
  }

  remove(action: Action) {
    this.actions.delete(action.id);
    removeAction(action); // Remove reference from firebase
  }

  clear() {
    this.actions.forEach((value: Action) => {
      // Call remove explicitly to remove the reference from Firebase as well
      this.remove(value);
    });
  }
}