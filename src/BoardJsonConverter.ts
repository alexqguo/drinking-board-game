import Tile from './Tile';
import { JsonTile, JsonRule } from './interfaces';
import {
  Rule,
  MoveRule,
  DisplayRule,
  TeleportRule,
  SkipTurnRule,
  SpeedModifierRule,
  GameOverRule
} from './rules';

const RULE_MAPPINGS: { 
  [key: string]: new (...args: any[]) => Rule 
} = {
  MoveRule: MoveRule,
  DisplayRule: DisplayRule,
  TeleportRule: TeleportRule,
  SkipTurnRule: SkipTurnRule,
  SpeedModifierRule: SpeedModifierRule,
  GameOverRule: GameOverRule,
};

export function createTiles(tilesJson: Array<JsonTile>): Array<Tile> {
  return tilesJson.map((tileJson: JsonTile) => {
    const { displayText, mandatory, rule, position } = tileJson;

    if (!rule) { // this is temporary
      console.warn('No rule specified. Was this a todo?');
      return null;
    }

    return new Tile(displayText, mandatory, createRule(rule), position);
  });
}

export function createRule(ruleJson: JsonRule): Rule {
  const { type } = ruleJson;

  if (!RULE_MAPPINGS.hasOwnProperty(type)) {
    console.warn(`Invalid rule type specified: ${type}`);
    // TODO: throw error instead of warn. warn is just for debugging
    return null;
  }

  return new RULE_MAPPINGS[type](ruleJson);
}