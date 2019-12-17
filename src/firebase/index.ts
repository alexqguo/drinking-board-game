import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/database';
import { FIREBASE_CONFIG, RemoteStatus, RemoteAction, GameData } from './constants';

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

  const updates: { [key: string]: RemoteStatus } = {};
  const newPlayerData: RemoteStatus = {
    active: true,
    lastAction: RemoteAction.connect,
    lastUpdated: Date.now().toString(),
  };

  updates[dataPath] = newPlayerData;
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
  const newPlayerData: RemoteStatus = {
    active: false,
    lastAction: RemoteAction.disconnect,
    lastUpdated: Date.now().toString()
  };

  db.ref().update({
    [dataPath]: newPlayerData
  });
}