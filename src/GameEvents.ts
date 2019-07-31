export const TURN_START = 'TURN_START';
export const ROLL_START = 'ROLL_START';
export const ROLL_END = 'ROLL_END';
export const MOVE_START = 'MOVE_START';
export const MOVE_END = 'MOVE_END';
export const RULE_TRIGGER = 'RULE_TRIGGER';
export const TURN_END = 'TURN_END';
export const GAME_OVER = 'GAME_OVER';
export const TURN_SKIP = 'TURN_SKIP';

const ALL_EVENTS = [
  TURN_START, ROLL_START, ROLL_END, MOVE_START, MOVE_END, RULE_TRIGGER, TURN_END,
  GAME_OVER, TURN_SKIP,
];

class GameEvents {
  static instance: GameEvents;
  eventHandlerMap: Map<string, Function[]>;

  constructor() {
    if (!GameEvents.instance) {
      GameEvents.instance = this;
    }

    this.eventHandlerMap = new Map(); // could just be an object?
    ALL_EVENTS.forEach((event: string) => {
      this.eventHandlerMap.set(event, []);
    });

    return GameEvents.instance;
  }

  on(eventName: string, callback: Function): void {
    this.validateEvent(eventName);
    this.eventHandlerMap.get(eventName).push(callback);
  }

  trigger(eventName: string, eventValues?: any[]): void {
    this.validateEvent(eventName);
    this.eventHandlerMap.get(eventName).forEach((eventHandler: Function) => {
      eventHandler.apply(null, eventValues);
    });
  }

  validateEvent(eventName: string) {
    if (!this.eventHandlerMap.has(eventName)) {
      throw new Error(`${eventName} is not a valid event`);
    }
  }
}

const gameEventsInstance = new GameEvents();

export default gameEventsInstance;