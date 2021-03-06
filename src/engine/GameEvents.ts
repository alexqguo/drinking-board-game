export const GAME_START = 'GAME_START';
export const TURN_START = 'TURN_START';
export const LOST_TURN_START = 'LOST_TURN_START';
export const ROLL_START = 'ROLL_START';
export const ROLL_END = 'ROLL_END';
export const MOVE_START = 'MOVE_START';
export const MOVE_END = 'MOVE_END';
export const RULE_TRIGGER = 'RULE_TRIGGER';
export const RULE_END = 'RULE_END';
export const TURN_END = 'TURN_END';
export const GAME_OVER = 'GAME_OVER';
export const TURN_SKIP = 'TURN_SKIP';

const ALL_EVENTS = [GAME_START, TURN_START, ROLL_START, ROLL_END, MOVE_START, MOVE_END, RULE_TRIGGER, RULE_END,
  TURN_END, GAME_OVER, TURN_SKIP, LOST_TURN_START,
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

  on(eventName: string, callback: Function, isCustomEvent: boolean = false): void {
    this.validateEvent(eventName, isCustomEvent);
    if (isCustomEvent) {
      this.eventHandlerMap.set(eventName, []);
    }
    
    this.eventHandlerMap.get(eventName).unshift(callback);
  }

  trigger(eventName: string, eventValues?: any[]): void {
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
      let args = [next];
      if (eventValues && eventValues.length) {
        args = args.concat(eventValues);
      }
      
      eventFunctions[functionIdx].apply(null, args);
    }

    invokeEventFunction();
  }

  validateEvent(eventName: string, isCustomEvent: boolean = false) {
    if (!isCustomEvent && !this.eventHandlerMap.has(eventName)) {
      throw new Error(`${eventName} is not a valid event`);
    }
  }
}

const gameEventsInstance = new GameEvents();

export default gameEventsInstance;