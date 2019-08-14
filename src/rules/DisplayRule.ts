import Rule from './Rule';
import { JsonRule } from '../interfaces';
import Game from '../Game';

class DisplayRule extends Rule {
  constructor(json: JsonRule) {
    super(json);
    this.validateRequired(json.displayText);
  }

  execute() {
    super.execute()
    Game.modal.enableClose(); // Nothing to do
  }
}

export default DisplayRule;