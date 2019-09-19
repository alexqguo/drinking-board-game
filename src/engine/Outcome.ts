import { Rule } from '../rules';

export default class Outcome {
  rule: Rule;
  criteria: number[];

  constructor(rule: Rule, criteria: number[]) {
    this.rule = rule;
    this.criteria = criteria;
  }
}