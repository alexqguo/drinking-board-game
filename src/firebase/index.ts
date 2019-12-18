import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/database';
import { FIREBASE_CONFIG, RemoteStatus, Action, GameData } from './constants';

let db: firebase.database.Database;

export function initPageWithFirebase(): void {
  firebase.initializeApp(FIREBASE_CONFIG);
  firebase.analytics();
  db = firebase.database();
}

export async function initFirebaseSession(gameId: string, players: string[]): Promise<void> {
  // Init player names to empty value
  const playerValues: { [key: string]: RemoteStatus } = players.reduce((acc: any, cur: string) => {
    acc[cur] = {
      active: false,
      lastAction: '',
      lastActionTime: '',
    };
    return acc;
  }, {});

  const gameData: GameData = {
    players: playerValues,
    id: gameId,
    active: true,
    startDate: Date.now().toString()
  };

  await db.ref(`games/${gameId}`).set(gameData);
}

export async function addAction(action: Action): Promise<void> {
  await db.ref(action.path).set({
    id: action.id,
    name: action.name,
  });
}

export function subscribeToPlayerActions(gameId: string, playerName: string, actionPath: string, cb: any) {
  db.ref(`games/${gameId}/players/${playerName}/${actionPath}`).on('value', cb);
}

export async function setPlayerAction(gameId: string, playerName: string, actionId: string): Promise<void> {
  const basePath: string = `games/${gameId}/players/${playerName}`;
  const updates: { [key: string]: any } = {};
  updates[`${basePath}/lastAction`] = actionId;
  updates[`${basePath}/lastUpdated`] = Date.now().toString();
  
  await db.ref().update(updates);
}

export async function removeAction(action: Action): Promise<void> {
  await db.ref(action.path).remove();
}

export async function findSession(gameId: string): Promise<GameData> {
  const snap: firebase.database.DataSnapshot = await db.ref(`games/${gameId}`).once('value');
  if (!(snap && snap.val() && snap.val().id === gameId && snap.val().active)) {
    throw new Error('No game found');
  }

  return snap.val();
}

export async function connectToSession(gameId: string, playerName: string): Promise<boolean> {
  const dataPath: string = `games/${gameId}/players/${playerName}`;
  const snap: firebase.database.DataSnapshot = await db.ref(dataPath).once('value');

  if (!(snap && snap.val())) {
    throw new Error('No player found');
  }

  const updates: { [key: string]: any } = {};
  updates[`${dataPath}/active`] = true;
  updates[`${dataPath}/lastAction`] = 'connect';
  updates[`${dataPath}/lastUpdated`] = Date.now().toString();

  try {
    await db.ref().update(updates);
    return true;
  } catch (e) {
    throw new Error(e.message || 'Could not join');
  }
}

export function deactivateGame(gameId: string) {
  db.ref(`games/${gameId}/active`).set(false);
}

// This performs an async operation but we will never await on it
export function logOff(gameId: string, playerName: string) {
  const dataPath: string = `games/${gameId}/players/${playerName}`;
  const updates: { [key: string]: any } = {};
  updates[`${dataPath}/active`] = false;
  updates[`${dataPath}/lastAction`] = 'disconnect';
  updates[`${dataPath}/lastUpdated`] = Date.now().toString();

  db.ref().update(updates);
}