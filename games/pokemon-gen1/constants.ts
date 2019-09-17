export const starterNames = {
  pikachu: 'pikachu',
  squirtle: 'squirtle',
  charmander: 'charmander',
  bulbasaur: 'bulbasaur',
};

export const starterStrengths = {
  [starterNames.pikachu]: starterNames.squirtle,
  [starterNames.squirtle]: starterNames.charmander,
  [starterNames.charmander]: starterNames.bulbasaur,
  [starterNames.bulbasaur]: starterNames.squirtle,
};

export interface PokemonSelection {
  [playerName: string]: string;
};

export interface Trainer {
  playerName: string;
  starterName: string;
  numRolls?: number;
};

export interface BattleResults {
  [playerName: string]: number[];
};