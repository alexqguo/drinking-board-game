import Rule from './Rule';
import { JsonRule } from '../interfaces';
import GameEvents from '../engine/GameEvents';

export default class ProxyRule extends Rule {
  proxyRuleId: string;

  constructor(json: JsonRule) {
    super(json);
    const { proxyRuleId } = json;
    this.validateRequired(proxyRuleId);
    this.proxyRuleId = proxyRuleId;
  }

  execute(closedCb: Function) {
    super.execute(closedCb);
    GameEvents.trigger(this.proxyRuleId);
  }
}