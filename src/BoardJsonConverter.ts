import Tile from './Tile';
import { JsonTile, JsonRule } from './interfaces';
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

export function createTiles(tilesJson: Array<JsonTile>): Array<Tile> {
  return tilesJson.map(tileJson => {
    console.log(tileJson);
    const { displayText, mandatory, rule } = tileJson;

    if (!rule) { // this is temporary
      console.warn('No rule specified. Was this a todo?');
      return null;
    }

    return new Tile(displayText, mandatory, createRule(rule));
  });
}

export function createRule(ruleJson: JsonRule): Rule {
  const { type } = ruleJson;

  if (!RULE_MAPPINGS.hasOwnProperty(type)) {
    throw new Error('Invalid rule type specified');
  }

  return new RULE_MAPPINGS[type](ruleJson);
}