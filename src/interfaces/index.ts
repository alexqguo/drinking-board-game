export interface JsonTile {
  mandatory?: boolean;
  rule: JsonRule;
  position: Position[]; // optional until I have time to fill them all out
  zone?: string; // Key (name as of right now) to look up the zone
}

export interface Position {
  x: number;
  y: number;
}

export enum Direction {
  forward = 'forward',
  back = 'back',
}

export enum TurnIncrementer {
  normal = 1,
  reverse = -1,
}

export enum ZoneType {
  passive = 'passive',
  active = 'active',
}

export interface SpeedModifier {
  fn: Function;
  description: string;
}

export enum ModifierOperation {
  addition = '+',
  multiplication = '*',
}

export interface PlayerInput {
  name: string;
  color: string;
}

export interface PlayerColor {
  r: number;
  g: number;
  b: number;
}
export interface PlayerStatusData {
  name: string,
  effects: PlayerEffects,
  zoneName?: string,
  custom: Object,
}

export interface PlayerEffects {
  mandatorySkips: number,
  customMandatoryTiles: number[],
  extraTurns: number,
  skippedTurns: number,
  speedModifiers: SpeedModifier[],
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
  modifier?: [ModifierOperation, number];
  diceRolls?: DiceRoll;
  condition?: MoveCondition;
  criteria?: number[];
  choices?: JsonRule[];
  proxyRuleId?: string;
}

export interface JsonZone {
  name: string;
  type: ZoneType;
  rule: JsonRule;
}

export interface MoveCondition {
  criteria: number[];
  numSuccessesRequired: number;
  immediate?: boolean;
  consequence?: JsonRule;
}

export interface DiceRoll {
  outcomes?: JsonOutcome[];
  any?: JsonOutcome; // I got lazy. Any match on an "any" will override all other rules
  numRequired: number;
}

export interface JsonOutcome {
  rule: JsonRule;
  criteria: number[];
}

export enum PlayerTarget {
  custom = 'custom',
  self = 'self',
  allOthers = 'allOthers',
}

export interface JsonBoard {
  imgSrc?: string;
  tiles: JsonTile[];
  zones: JsonZone[];
}