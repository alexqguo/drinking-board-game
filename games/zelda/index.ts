console.log('hello from the zelda game');

/*
todo: do not repeat mandatory spaces

deku tree: 4, 5, 6
dodongo: 14, 15, 16
jabu jabu:
forest temple:
fire temple:
water temple:
shadow temple:
spirit temple:
ganon's castle:
temple of time:
*/

const w = window as any;

if (w.drinking) {
  const { Game, GameEvents, events } = w.drinking;

  GameEvents.on(events.MOVE_END, (next: Function) => {
    if (Game.currentPlayer.currentTileIndex === 4) {
    }
  });
}