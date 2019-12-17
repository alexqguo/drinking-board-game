// Hello
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDQxVG0YgF30AJq-fpclM2sdecM-umH-zw',
  authDomain: 'drink-alexguo.firebaseapp.com',
  databaseURL: 'https://drink-alexguo.firebaseio.com',
  projectId: 'drink-alexguo',
  storageBucket: 'drink-alexguo.appspot.com',
  messagingSenderId: '891863376076',
  appId: '1:891863376076:web:43e8380311c98693bce269',
  measurementId: 'G-EMDCRKRSE5',
};

export interface Action {
  id: string;
  name: string;
  fn: Function;
  path: string;
}

export interface RemoteAction {
  id: string;
  name: string;
}

export interface RemoteStatus {
  active: boolean;
  lastAction: string;
  lastUpdated: string;
  actions?: { [key: string]: string };
};

export interface GameData {
  id: string;
  active: boolean;
  startDate: string;
  players: { [key: string]: RemoteStatus };
}