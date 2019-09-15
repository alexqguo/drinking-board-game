/*
trainer battles

## need to choose pokemon at game start
- add pokemon to player status?

## need to trigger battles
- needs to be at the beginning of the move end event
- check current player current space
- if the current space has another player on it AND it's not a gym
  - open up a modal which contains the logic 
  - when modal closes, fire next()
  - if there are more than two people...

*/
const w = window as any;

if (w.drinking) {
  w.drinking.GameEvents.on(w.drinking.events.TURN_START, (next: Function) => {
    console.log('Pokemon!');
    next();
  });
}