import firebase from 'firebase/app';
import 'firebase/database';

let db: firebase.database.Database;

export function initRealtimeDb(): void {
  db = firebase.database();
}

export async function initFirebaseSession(gameId: string, players: string[]): Promise<void> {
  // Init player names to empty value
  const playerValues: { [key: string]: any } = players.reduce((acc: any, cur: string) => {
    acc[cur] = ''; // For some reason null doesn't work
    return acc;
  }, {});

  await firebase.database().ref(`games/${gameId}`).set({
    players: playerValues,
    id: gameId,
    startDate: Date.now().toString()
  });
}