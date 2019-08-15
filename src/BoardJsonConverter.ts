import Tile from './Tile';
import { JsonTile, JsonRule } from './interfaces';
import {
  Rule,
  MoveRule,
  DisplayRule,
  TeleportRule,
  SkipTurnRule,
  SpeedModifierRule,
  GameOverRule,
  ExtraTurnRule,
  DrinkDuringLostTurnsRule,
  ApplyMoveConditionRule,
  DiceRollRule,
  RollUntilRule,
  ChoiceRule,
  SkipNextMandatoryRule,
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
  ExtraTurnRule: ExtraTurnRule,
  DrinkDuringLostTurnsRule: DrinkDuringLostTurnsRule,
  ApplyMoveConditionRule: ApplyMoveConditionRule,
  DiceRollRule: DiceRollRule,
  RollUntilRule: RollUntilRule,
  ChoiceRule: ChoiceRule,
  SkipNextMandatoryRule: SkipNextMandatoryRule,
};

export function createTiles(tilesJson: Array<JsonTile>): Array<Tile> {
  return tilesJson.map((tileJson: JsonTile) => {
    const { mandatory, rule, position } = tileJson;

    if (!rule) { // this is temporary
      console.warn('No rule specified. Was this a todo?');
      return null;
    }

    return new Tile(mandatory, createRule(rule), position);
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