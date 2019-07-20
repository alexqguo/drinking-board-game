export interface JsonTile {
  displayText: string;
  mandatory?: boolean;
  rule: JsonRule;
}

export interface JsonRule {
  type: string;
  tileIndex?: number;
  direction?: string;
  numSpaces?: number;
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
  img: string;
  tiles: JsonTile[];
}