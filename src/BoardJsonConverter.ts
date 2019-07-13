import Tile from './Tile';
import {
  Rule,
  MoveRule,
  DisplayRule,
  TeleportRule,
  SkipTurnRule,
  SpeedModifierRule
} from './rules';

const RULE_MAPPINGS: { 
  [key: string]: new (...args: any[]) => Rule 
} = {
  MoveRule: MoveRule,
  DisplayRule: DisplayRule,
  TeleportRule: TeleportRule,
  SkipTurnRule: SkipTurnRule,
  SpeedModifierRule: SpeedModifierRule,
};

export function createTiles(tilesJson: Array<any>): Array<Tile> {
  return tilesJson.map(tileJson => {
    console.log(tileJson);
    const { displayText, isMandatory, diceRolls, rule } = tileJson;

    if (!rule) { // this is temporary
      console.warn('No rule specified. Was this a todo?');
      return null;
    }

    return new Tile(displayText, isMandatory, createRule(rule));
  });
}

export function createRule(ruleJson: any): Rule { //todo- fix any
  const { type } = ruleJson;

  if (!RULE_MAPPINGS.hasOwnProperty(type)) {
    throw new Error('Invalid rule type specified');
  }

  return new RULE_MAPPINGS[type](ruleJson);
}