import { Rule } from './rules';

class Tile {
  displayText: string;
  isMandatory: boolean;
  rule: Rule;

  // todo- coords
  constructor(displayText: string, isMandatory: boolean, rule: Rule) {
    this.displayText = displayText;
    this.isMandatory = isMandatory;
    this.rule = rule;
  }
}

export default Tile;