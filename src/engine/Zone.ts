import { Rule } from '../rules';
import { ZoneType } from '../interfaces';

class Zone {
  name: string;
  type: ZoneType;
  rule: Rule;

  constructor(name: string, type: ZoneType, rule: Rule) {
    this.name = name;
    this.type = type;
    this.rule = rule;
  }
}

export default Zone;