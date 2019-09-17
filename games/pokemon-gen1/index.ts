import PokemonSelector from './PokemonSelector';
import TrainerBattle from './TrainerBattle';
import { starterNames } from './constants';

// Small hack to ensure they're included in the bundle without having to complicate rollup config
console.info(`[pokemon-gen1] including web components ${PokemonSelector.name}, ${TrainerBattle.name}`);

const w = window as any;

if (w.drinking) {
  const { Game, GameEvents, events } = w.drinking;

  GameEvents.on(events.GAME_START, (next: Function) => {
    const frag: DocumentFragment = document.createDocumentFragment();
    const pokemonSelector: HTMLElement = document.createElement('pokemon-selector');
    const playerNames: string[] = Game.players.map((p: any) => p.name);
    pokemonSelector.setAttribute('playerNames', JSON.stringify(playerNames));
    pokemonSelector.addEventListener('pokemon-selected', (e: CustomEvent) => {
      e.detail.pokemon.forEach((pokemon: string, i: number) => {
        Game.players[i].custom.pokemon = pokemon;
      });
      Game.modal.close();
      next();
    });

    frag.appendChild(pokemonSelector);
    Game.modal.openWithFragment('Choose your Pokemon!', frag);
    Game.modal.disableClose();
  });

  GameEvents.on(events.MOVE_END, (next: Function) => {
    // Check if it's the pikachu space, if so switch the pokemon for the current player

    if (Game.currentPlayer.currentTileIndex === 4) {
      Game.currentPlayer.custom.pokemon = starterNames.pikachu;
    }

    const playersAtCurrentTile: Set<Object> = Game
      .board
      .tiles[Game.currentPlayer.currentTileIndex]
      .currentPlayers;

    if (playersAtCurrentTile.size >= 2) {
      triggerTrainerBattle(playersAtCurrentTile)
        .then(() => { next() });
    } else {
      next();
    }
  });

  function triggerTrainerBattle(players: Set<Object>): Promise<void> {
    return new Promise(resolve => {
      const frag: DocumentFragment = document.createDocumentFragment();
      const battle: HTMLElement = document.createElement('trainer-battle');
      const componentArgs = [...players].map((p: any) => {
        return {
          playerName: p.name,
          starterName: p.custom.pokemon,
        }
      });
      battle.setAttribute('data', JSON.stringify(componentArgs));
      battle.addEventListener('battle-ended', (e: CustomEvent) => {
        Game.modal.enableClose();
        resolve();
      });

      frag.appendChild(battle);
      Game.modal.openWithFragment('Trainer battle!', frag);
      Game.modal.disableClose();
    });
  }
}