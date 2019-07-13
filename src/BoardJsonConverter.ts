import Tile from './Tile';
import {
  Rule,
  MoveRule,
  DisplayRule,
  TeleportRule,
  SkipTurnRule,
  SpeedModifierRule
} from './rules';

// TODO: symbol?
const RULE_TYPES = {
  DisplayRule: null,
  TeleportRule: null,
  SpeedModifierRule: null,
  SkipTurnRule: null,
  MoveRule: null,
};

function createTiles(tilesJson) {
  const tiles = tilesJson.map(tileJson => {
    const { displayText, isMandatory, diceRolls, rule } = tileJson;
    return new Tile(displayText, isMandatory, createRule(rule));
  });
}

// TODO: this needs to be cleaned up
function createRule(ruleJson): Rule {
  const { type } = ruleJson;
  switch(type) {
    case DISPLAY:
      
      break;
    case TELEPORT:
      break;
    case SPEED_MODIFIER:
      break;
    case SKIP_TURN:
      break;
    case MOVE:
      break;
    default:
      throw new Error('Invalid rule type specified');
  }
}

module.exports = {
  createTiles,
  createRule
}