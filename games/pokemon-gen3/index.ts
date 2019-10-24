import PokemonSelector from '../pokemon-gen1/PokemonSelector';
import TrainerBattle from '../pokemon-gen1/TrainerBattle';

// Small hack to ensure they're included in the bundle without having to complicate rollup config
console.info(`[pokemon-gen3] including web components ${PokemonSelector.name}, ${TrainerBattle.name}`);

const starterNames = {
  treecko: 'treecko',
  torchic: 'torchic',
  mudkip: 'mudkip',
};

const starterStrengths = {
  [starterNames.treecko]: starterNames.mudkip,
  [starterNames.torchic]: starterNames.treecko,
  [starterNames.mudkip]: starterNames.torchic,
};

const w = window as any;

if (w.drinking) {
  const { Game, GameEvents, events } = w.drinking;

  GameEvents.on(events.GAME_START, (next: Function) => {
    const frag: DocumentFragment = document.createDocumentFragment();
    const pokemonSelector: HTMLElement = document.createElement('pokemon-selector');
    const playerNames: string[] = Game.players.map((p: any) => p.name);
    pokemonSelector.setAttribute('playerNames', JSON.stringify(playerNames));
    pokemonSelector.setAttribute('starterNames', JSON.stringify(Object.values(starterNames)));
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
    const currentTile = Game.board.tiles[Game.currentPlayer.currentTileIndex];
    const playersAtCurrentTile: Set<Object> = currentTile.currentPlayers;

    if (playersAtCurrentTile.size >= 2 && !currentTile.isMandatory) {
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
      battle.setAttribute('victorySrc', 'public/pokemon-gen3/victory.mp3');
      battle.setAttribute('battleSrc', 'public/pokemon-gen3/battle.mp3');
      battle.setAttribute('starterStrengths', JSON.stringify(starterStrengths));
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