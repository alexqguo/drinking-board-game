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

// Should next events be handled here instead? 
// Each event has a nextEvent type of property, the next() function can trigger it if there's
// no next function left
// Just have to consider skipping turns. It could have a next event of turn end
// Should refactor it to be this way? It's more rigid though

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
    console.log(`Setting an event: ${eventName}`);
    this.validateEvent(eventName);
    this.eventHandlerMap.get(eventName).push(callback);
  }

  trigger(eventName: string, eventValues?: any[]): void {
    console.log(`Triggering event: ${eventName}`);
    this.validateEvent(eventName);

    const eventFunctions: Function[] = this.eventHandlerMap.get(eventName);
    if (!eventFunctions.length) return;

    let functionIdx: number = 0;
    const next: Function = () => {
      if (eventFunctions[++functionIdx]) {
        invokeEventFunction();
      }
    }
    const invokeEventFunction: Function = () => {
      eventFunctions[functionIdx].apply(null, [next, ...eventValues]);
    }

    invokeEventFunction();
  }

  validateEvent(eventName: string) {
    if (!this.eventHandlerMap.has(eventName)) {
      throw new Error(`${eventName} is not a valid event`);
    }
  }
}

const gameEventsInstance = new GameEvents();

export default gameEventsInstance;