export interface JsonTile {
  displayText: string;
  mandatory?: boolean;
  rule: JsonRule;
}

export enum Direction {
  forward = 'forward',
  back = 'back',
}

export interface JsonRule {
  type: string;
  tileIndex?: number;
  direction?: Direction;
  numSpaces?: number;
  numTurns?: number;
  playerTarget?: JsonPlayerTarget;
  multiplier?: number;
  diceRolls?: JsonDiceRoll;
}

export interface JsonDiceRoll {
  outcomes?: JsonDiceRollOutcome[];
  numRequired: number;
}

export interface JsonDiceRollOutcome {
  // Prop name is a comma separated string of numbers to trigger the particular rule
  [propName: string]: JsonRule;
}

export enum JsonPlayerTarget {
  custom = 'custom',
  self = 'self',
  allOthers = 'allOthers',
}

export interface JsonBoard {
  imgSrc: string;
  tiles: JsonTile[];
}