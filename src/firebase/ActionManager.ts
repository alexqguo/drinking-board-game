import { createId } from '../utils';
import { Action } from './constants';
import Player from '../engine/Player';
import { addAction, removeAction } from '.';

export default class ActionManager {
  actions: Map<string, Action>;

  constructor() {
    this.actions = new Map();
    // todo- set up listen on firebase
  }

  createAction(name: string, actionFn: Function, gameId: string, player: Player): void {
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