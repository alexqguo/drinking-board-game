export interface JsonTile {
  mandatory?: boolean;
  rule: JsonRule;
  position: Position[]; // optional until I have time to fill them all out
}

export interface Position {
  x: number;
  y: number;
}

export enum Direction {
  forward = 'forward',
  back = 'back',
}

export interface JsonRule {
  displayText: string;
  type: string;
  tileIndex?: number;
  direction?: Direction;
  numSpaces?: number;
  numTurns?: number;
  playerTarget?: PlayerTarget;
  multiplier?: number;
  diceRolls?: JsonDiceRoll;
  condition?: MoveCondition;
}

export interface MoveCondition {

}

export interface JsonDiceRoll {
  outcomes?: JsonDiceRollOutcome[];
  numRequired: number;
}

export interface JsonDiceRollOutcome {
  // Prop name is a comma separated string of numbers to trigger the particular rule
  [propName: string]: JsonRule;
}

export enum PlayerTarget {
  custom = 'custom',
  self = 'self',
  allOthers = 'allOthers',
}

export interface JsonBoard {
  imgSrc?: string;
  tiles: JsonTile[];
}