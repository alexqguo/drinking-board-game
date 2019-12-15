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
    startDate: Date.now().toString()
  };

  await db.ref(`games/${gameId}`).set(gameData);
}

export async function findSession(gameId: string): Promise<GameData> {
  const snap: firebase.database.DataSnapshot = await db.ref(`games/${gameId}`).once('value');
  if (!(snap && snap.val() && snap.val().id === gameId)) {
    throw 'No game found';
  }

  return snap.val();
}

export async function connectToSession(gameId: string, playerName: string): Promise<boolean> {
  const updates: RemoteStatus = {
    active: true,
    lastAction: RemoteAction.connect,
    lastUpdated: Date.now().toString(),
  };

  return false;
}

export async function logOff(gameId: string, playerName: string) {

}