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

export interface PlayerInput {
  name: string;
  color: string;
}

export interface PlayerStatusData {
  name: string,
  effects: PlayerEffects,
}

export interface PlayerEffects {
  mandatorySkips: number,
  extraTurns: number,
  skippedTurns: number,
  speedModifiers: number[],
  moveCondition: Function,
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
  diceRolls?: DiceRoll;
  condition?: MoveCondition;
  criteria?: number[];
  choices?: JsonRule[];
}

export interface MoveCondition {
  criteria: number[];
  numSuccessesRequired: number;
  immediate?: boolean;
}

export interface DiceRoll {
  outcomes?: JsonRule[];
  any?: JsonRule; // I got lazy. Any match on an "any" will override all other rules
  numRequired: number;
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